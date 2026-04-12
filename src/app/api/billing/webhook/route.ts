import { NextRequest, NextResponse } from "next/server";
import { getStripeWebhookSecret, isStripeConfigured } from "@/lib/billing/env";
import { parseStripeWebhook, verifyStripeWebhookSignature } from "@/lib/billing/stripe";
import { persistBillingEvent } from "@/lib/billing/repository";
import type { BillingEventPreview } from "@/types";

export const runtime = "nodejs";

function summarizeStatus(eventType: string, object: Record<string, unknown>) {
  if (eventType === "invoice.payment_failed") {
    return "failed" satisfies BillingEventPreview["status"];
  }

  if (eventType === "invoice.paid") {
    return "paid" satisfies BillingEventPreview["status"];
  }

  if (eventType === "customer.subscription.deleted") {
    return "canceled" satisfies BillingEventPreview["status"];
  }

  const status = typeof object.status === "string" ? object.status : "";

  if (status === "active" || status === "trialing") {
    return "active" satisfies BillingEventPreview["status"];
  }

  if (status === "draft") {
    return "draft" satisfies BillingEventPreview["status"];
  }

  return "pending" satisfies BillingEventPreview["status"];
}

function summarizeLabel(eventType: string) {
  switch (eventType) {
    case "checkout.session.completed":
      return "Checkout completed";
    case "customer.subscription.created":
      return "Subscription created";
    case "customer.subscription.updated":
      return "Subscription updated";
    case "customer.subscription.deleted":
      return "Subscription canceled";
    case "invoice.paid":
      return "Invoice paid";
    case "invoice.payment_failed":
      return "Invoice payment failed";
    default:
      return "Billing event received";
  }
}

function resolveCustomerName(object: Record<string, unknown>) {
  const customerDetails = object.customer_details;

  if (customerDetails && typeof customerDetails === "object") {
    const customer = customerDetails as { email?: string; name?: string };
    return customer.name || customer.email;
  }

  return typeof object.customer === "string" ? object.customer : undefined;
}

function resolvePlanId(object: Record<string, unknown>) {
  const metadata = object.metadata;

  if (metadata && typeof metadata === "object") {
    const planId = (metadata as Record<string, unknown>).plan_id;

    if (
      planId === "discovery-sprint" ||
      planId === "launch-program" ||
      planId === "embedded-partnership"
    ) {
      return planId;
    }
  }

  return undefined;
}

function summarizeDetail(eventType: string, object: Record<string, unknown>) {
  const customer = resolveCustomerName(object);
  const planId = resolvePlanId(object);
  const status = typeof object.status === "string" ? object.status : "pending";
  const entity = customer ? ` for ${customer}` : "";
  const plan = planId ? ` on ${planId}` : "";

  if (eventType === "invoice.payment_failed") {
    return `Stripe reported a failed invoice payment${entity}${plan}. Finance follow-up is required.`;
  }

  if (eventType === "invoice.paid") {
    return `Stripe confirmed a paid invoice${entity}${plan}. Delivery can continue without billing risk.`;
  }

  if (eventType === "checkout.session.completed") {
    return `Checkout completed${entity}${plan}. Initial billing onboarding is ready to begin.`;
  }

  if (eventType === "customer.subscription.deleted") {
    return `Subscription canceled${entity}${plan}. Review any gated delivery commitments and renewal notes.`;
  }

  return `Stripe received ${eventType}${entity}${plan} with status ${status}.`;
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  try {
    const secret = getStripeWebhookSecret();

    if (!verifyStripeWebhookSignature(payload, signature, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    const event = parseStripeWebhook(payload);
    const object =
      event.data && event.data.object && typeof event.data.object === "object"
        ? (event.data.object as Record<string, unknown>)
        : {};

    await persistBillingEvent({
      source: "stripe",
      eventType: event.type,
      label: summarizeLabel(event.type),
      detail: summarizeDetail(event.type, object),
      status: summarizeStatus(event.type, object),
      customer: resolveCustomerName(object),
      planId: resolvePlanId(object),
      subscriptionId:
        typeof object.subscription === "string"
          ? object.subscription
          : typeof object.id === "string" && typeof object.object === "string" && object.object === "subscription"
            ? object.id
            : undefined,
      amount:
        typeof object.amount_paid === "number"
          ? object.amount_paid
          : typeof object.amount_total === "number"
            ? object.amount_total
            : undefined,
      currency: typeof object.currency === "string" ? object.currency : undefined,
      stripeEventId: event.id,
      payload: event as unknown as Record<string, unknown>,
      createdAt: new Date(event.created * 1000).toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Billing webhook error:", error);
    return NextResponse.json(
      { error: "Unable to process the billing webhook." },
      { status: 500 }
    );
  }
}

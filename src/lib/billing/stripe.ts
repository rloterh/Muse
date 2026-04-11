import { createHmac, timingSafeEqual } from "node:crypto";
import { getAppUrl } from "@/lib/supabase/env";
import {
  getStripeCustomerPortalConfigurationId,
  getStripePriceId,
  getStripeSecretKey,
  type StripePlanId,
} from "@/lib/billing/env";

type CheckoutInput = {
  planId: StripePlanId;
  customerEmail?: string;
  successPath?: string;
  cancelPath?: string;
};

type PortalInput = {
  customerId: string;
  returnPath?: string;
};

type StripeWebhookSummary = {
  id: string;
  type: string;
  livemode: boolean;
  created: number;
  data?: {
    object?: {
      id?: string;
      object?: string;
      customer?: string;
      subscription?: string;
      status?: string;
      currency?: string;
      amount_total?: number;
      amount_paid?: number;
      metadata?: Record<string, string>;
      lines?: {
        data?: Array<{
          price?: {
            id?: string;
          };
        }>;
      };
      customer_details?: {
        email?: string;
        name?: string;
      };
      hosted_invoice_url?: string;
      invoice_pdf?: string;
    };
  };
};

async function postStripeForm<T>(path: string, params: URLSearchParams) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw new Error(data.error?.message || "Stripe request failed.");
  }

  return data;
}

export async function createCheckoutSession(input: CheckoutInput) {
  const params = new URLSearchParams();
  params.set("mode", input.planId === "discovery-sprint" ? "payment" : "subscription");
  params.set("success_url", `${getAppUrl()}${input.successPath ?? "/contact?billing=success"}`);
  params.set("cancel_url", `${getAppUrl()}${input.cancelPath ?? "/services?billing=canceled"}`);
  params.set("billing_address_collection", "auto");
  params.set("allow_promotion_codes", "true");
  params.set("line_items[0][price]", getStripePriceId(input.planId));
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[plan_id]", input.planId);

  if (input.customerEmail) {
    params.set("customer_email", input.customerEmail);
  }

  if (input.planId !== "discovery-sprint") {
    params.set("subscription_data[metadata][plan_id]", input.planId);
  }

  const data = await postStripeForm<{ url?: string; id: string }>("/v1/checkout/sessions", params);

  if (!data.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return data;
}

export async function createCustomerPortalSession(input: PortalInput) {
  const params = new URLSearchParams();
  params.set("customer", input.customerId);
  params.set("return_url", `${getAppUrl()}${input.returnPath ?? "/admin"}`);

  const configurationId = getStripeCustomerPortalConfigurationId();

  if (configurationId) {
    params.set("configuration", configurationId);
  }

  const data = await postStripeForm<{ url?: string; id: string }>(
    "/v1/billing_portal/sessions",
    params
  );

  if (!data.url) {
    throw new Error("Stripe did not return a customer portal URL.");
  }

  return data;
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string, secret: string) {
  const elements = signatureHeader.split(",").reduce<Record<string, string>>((summary, item) => {
    const [key, value] = item.split("=");

    if (key && value) {
      summary[key] = value;
    }

    return summary;
  }, {});

  const timestamp = elements.t;
  const signature = elements.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return secureCompare(expected, signature);
}

export function parseStripeWebhook(payload: string) {
  return JSON.parse(payload) as StripeWebhookSummary;
}

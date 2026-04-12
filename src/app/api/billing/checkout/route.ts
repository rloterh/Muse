import { NextRequest, NextResponse } from "next/server";
import { siteSettings } from "@/lib/site/config";
import { createCheckoutSession } from "@/lib/billing/stripe";
import { isStripeConfigured } from "@/lib/billing/env";

function isPlanId(value: unknown): value is (typeof siteSettings.retainerPlans)[number]["id"] {
  return siteSettings.retainerPlans.some((plan) => plan.id === value);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planId = body.planId;
    const email = typeof body.email === "string" ? body.email.trim() : undefined;
    const fallbackUrl = `/contact?intent=retainer&plan=${encodeURIComponent(
      typeof planId === "string" ? planId : "embedded-partnership"
    )}`;

    if (!isPlanId(planId)) {
      return NextResponse.json({ error: "A valid retainer plan is required." }, { status: 400 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({
        url: fallbackUrl,
        mode: "fallback",
      });
    }

    const session = await createCheckoutSession({
      planId,
      customerEmail: email,
      successPath: `/contact?billing=success&plan=${encodeURIComponent(planId)}`,
      cancelPath: `/services?billing=canceled&plan=${encodeURIComponent(planId)}`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      mode: "stripe",
    });
  } catch (error) {
    console.error("Billing checkout error:", error);
    return NextResponse.json(
      { error: "Unable to start billing checkout right now." },
      { status: 500 }
    );
  }
}

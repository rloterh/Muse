import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/billing/stripe";
import { isStripeConfigured } from "@/lib/billing/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerId = typeof body.customerId === "string" ? body.customerId.trim() : "";

    if (!customerId) {
      return NextResponse.json({ error: "A Stripe customer ID is required." }, { status: 400 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Billing portal is not configured yet." },
        { status: 503 }
      );
    }

    const session = await createCustomerPortalSession({
      customerId,
      returnPath: "/admin",
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json(
      { error: "Unable to create a billing portal session right now." },
      { status: 500 }
    );
  }
}

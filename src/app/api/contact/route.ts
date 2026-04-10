import { NextResponse } from "next/server";
import { contactEmailHtml, sendEmail } from "@/lib/email/send";
import { budgetRanges, serviceOptions } from "@/lib/site/config";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const budget = typeof body.budget === "string" ? body.budget.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const services = Array.isArray(body.services)
      ? body.services.filter(
          (service: unknown): service is string => typeof service === "string"
        )
      : [];

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (name.length > 80 || company.length > 120 || message.length > 4000) {
      return NextResponse.json(
        { error: "One or more fields exceeded the allowed length." },
        { status: 400 }
      );
    }

    if (budget && !budgetRanges.includes(budget)) {
      return NextResponse.json({ error: "Invalid budget selection." }, { status: 400 });
    }

    if (services.some((service: string) => !serviceOptions.includes(service))) {
      return NextResponse.json({ error: "Invalid service selection." }, { status: 400 });
    }

    const recipientEmail = process.env.CONTACT_EMAIL ?? "hello@muse.agency";
    const html = contactEmailHtml({
      name,
      email,
      company,
      services,
      budget,
      message,
    });

    const sent = await sendEmail({
      to: recipientEmail,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
      html,
      replyTo: email,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

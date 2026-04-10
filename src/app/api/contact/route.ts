import { NextResponse } from "next/server";
import { contactEmailHtml, sendEmail } from "@/lib/email/send";
import { buildInquiryRecordDefaults, createInquiryRecord, updateInquiryNotificationStatus } from "@/lib/inquiries/repository";
import {
  budgetRanges,
  projectFocusOptions,
  referralSourceOptions,
  serviceOptions,
  timelineOptions,
} from "@/lib/site/config";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

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
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const budget = typeof body.budget === "string" ? body.budget.trim() : "";
    const timeline = typeof body.timeline === "string" ? body.timeline.trim() : "";
    const projectFocus =
      typeof body.projectFocus === "string" ? body.projectFocus.trim() : "";
    const referralSource =
      typeof body.referralSource === "string" ? body.referralSource.trim() : "";
    const region = typeof body.region === "string" ? body.region.trim() : "";
    const goals = typeof body.goals === "string" ? body.goals.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const consent = body.consent === true;
    const companyField = typeof body.companyField === "string" ? body.companyField.trim() : "";
    const attribution =
      body.attribution && typeof body.attribution === "object" ? body.attribution : {};
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

    if (companyField) {
      return NextResponse.json({ success: true });
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Please confirm consent before submitting your inquiry." },
        { status: 400 }
      );
    }

    if (
      name.length > 80 ||
      company.length > 120 ||
      website.length > 240 ||
      region.length > 120 ||
      goals.length > 1500 ||
      message.length > 4000
    ) {
      return NextResponse.json(
        { error: "One or more fields exceeded the allowed length." },
        { status: 400 }
      );
    }

    if (budget && !budgetRanges.includes(budget)) {
      return NextResponse.json({ error: "Invalid budget selection." }, { status: 400 });
    }

    if (timeline && !timelineOptions.includes(timeline)) {
      return NextResponse.json({ error: "Invalid timeline selection." }, { status: 400 });
    }

    if (projectFocus && !projectFocusOptions.includes(projectFocus)) {
      return NextResponse.json({ error: "Invalid project focus selection." }, { status: 400 });
    }

    if (referralSource && !referralSourceOptions.includes(referralSource)) {
      return NextResponse.json({ error: "Invalid referral source selection." }, { status: 400 });
    }

    if (services.some((service: string) => !serviceOptions.includes(service))) {
      return NextResponse.json({ error: "Invalid service selection." }, { status: 400 });
    }

    if (website && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
      return NextResponse.json({ error: "Invalid website URL." }, { status: 400 });
    }

    const { routing, status, source, notes } = buildInquiryRecordDefaults({
      budget,
      timeline,
      services,
      projectFocus,
      referralSource,
      message,
      attribution,
    });

    const recipientEmail = process.env.CONTACT_EMAIL ?? "hello@muse.agency";
    const html = contactEmailHtml({
      name,
      email,
      company,
      website,
      services,
      budget,
      timeline,
      projectFocus,
      referralSource,
      region,
      goals,
      message,
      consent,
      routing,
      attribution,
    });

    let storedInquiry = null;

    if (isSupabaseConfigured()) {
      try {
        storedInquiry = await createInquiryRecord({
          name,
          email,
          company,
          website,
          region,
          budget,
          timeline,
          projectFocus,
          referralSource,
          services,
          goals,
          message,
          consent,
          source,
          status,
          routing,
          notes,
          attribution,
          notificationDelivered: false,
        });
      } catch (error) {
        console.error("Inquiry persistence error:", error);
      }
    }

    const sent = await sendEmail({
      to: recipientEmail,
      subject: `[${routing.priority.toUpperCase()}] New inquiry from ${name}${company ? ` (${company})` : ""}`,
      html,
      replyTo: email,
    });

    if (storedInquiry && sent) {
      await updateInquiryNotificationStatus(storedInquiry.id, true);
      storedInquiry.notificationDelivered = true;
    }

    if (!sent && !storedInquiry) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: {
        id: storedInquiry?.id,
        status,
        routing,
        attribution,
        notificationDelivered: sent,
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

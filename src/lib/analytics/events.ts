"use client";

import type { InquiryAttribution } from "@/types";

export const ANALYTICS_STORAGE_KEY = "muse.attribution";

type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "capability_deck_download"
  | "discovery_call_click"
  | "proposal_mode_viewed"
  | "inquiry_submitted"
  | "inquiry_reset"
  | "brief_reviewed";

type AnalyticsEventMetadata = Record<
  string,
  string | number | boolean | null | undefined
>;

interface AnalyticsEventPayload {
  name: AnalyticsEventName;
  path: string;
  label?: string;
  location?: string;
  intent?: string;
  attribution?: InquiryAttribution;
  metadata?: AnalyticsEventMetadata;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function readStoredAttribution(): InquiryAttribution {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InquiryAttribution) : {};
  } catch {
    return {};
  }
}

export function persistAttribution(attribution: InquiryAttribution) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readStoredAttribution();
  const next = { ...current, ...Object.fromEntries(Object.entries(attribution).filter(([, value]) => Boolean(value))) };
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next));
}

export function extractAttribution(searchParams: URLSearchParams, pathname: string): InquiryAttribution {
  return {
    landingPath: pathname,
    utmSource: searchParams.get("utm_source") ?? undefined,
    utmMedium: searchParams.get("utm_medium") ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    utmContent: searchParams.get("utm_content") ?? undefined,
    intent: searchParams.get("intent") ?? undefined,
    referralSource: searchParams.get("ref") ?? undefined,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
  };
}

export function trackEvent(payload: AnalyticsEventPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const event = {
    event: payload.name,
    path: payload.path,
    label: payload.label,
    location: payload.location,
    intent: payload.intent,
    attribution: payload.attribution,
    metadata: payload.metadata,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
  window.dispatchEvent(new CustomEvent("muse:analytics", { detail: event }));
}

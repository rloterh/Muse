import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { siteSettings } from "@/lib/site/config";
import { inferInquiryStatus, qualifyInquiry } from "@/lib/inquiries/qualification";
import type { InquiryAttribution, InquiryPreview, InquiryRouting, InquiryStatus } from "@/types";

const inquiryStatusOptions = [
  "New",
  "Qualified",
  "Discovery scheduled",
  "Proposal drafted",
] as const satisfies InquiryStatus[];

interface InquiryRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  region: string | null;
  budget: string | null;
  timeline: string | null;
  project_focus: string | null;
  referral_source: string | null;
  services: string[] | null;
  goals: string | null;
  message: string | null;
  consent: boolean;
  source: string | null;
  status: string | null;
  routing: InquiryRouting | null;
  notes: string | null;
  attribution: InquiryAttribution | null;
  notification_delivered: boolean;
  created_at: string;
  updated_at: string;
}

interface SupabaseErrorLike {
  code?: string;
  message?: string;
}

interface CreateInquiryInput {
  name: string;
  email: string;
  company: string;
  website: string;
  region: string;
  budget: string;
  timeline: string;
  projectFocus: string;
  referralSource: string;
  services: string[];
  goals: string;
  message: string;
  consent: boolean;
  source: string;
  status: InquiryStatus;
  routing: InquiryRouting;
  notes: string;
  attribution: InquiryAttribution;
  notificationDelivered: boolean;
}

interface UpdateInquiryLifecycleInput {
  status?: InquiryStatus;
  notes?: string;
}

const inquirySelect =
  "id,name,email,company,website,region,budget,timeline,project_focus,referral_source,services,goals,message,consent,source,status,routing,notes,attribution,notification_delivered,created_at,updated_at";

function isRouting(value: unknown): value is InquiryRouting {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.team === "string" &&
    typeof candidate.owner === "string" &&
    typeof candidate.fit === "string" &&
    typeof candidate.nextStep === "string" &&
    typeof candidate.priority === "string"
  );
}

function isAttribution(value: unknown): value is InquiryAttribution {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeInquiryStatus(status: string | null | undefined): InquiryStatus {
  if (status && inquiryStatusOptions.includes(status as InquiryStatus)) {
    return status as InquiryStatus;
  }

  return "New";
}

function isMissingInquiryTableError(error: SupabaseErrorLike | null) {
  return (
    error?.code === "PGRST205" ||
    error?.message?.includes("public.inquiries") ||
    error?.message?.includes("relation \"public.inquiries\"")
  );
}

function normalizeAttribution(value: unknown): InquiryAttribution {
  if (!isAttribution(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => typeof entry === "string" && entry.trim())
  ) as InquiryAttribution;
}

function normalizeRouting(row: InquiryRow): InquiryRouting {
  if (isRouting(row.routing)) {
    return row.routing;
  }

  return qualifyInquiry({
    budget: row.budget ?? "",
    timeline: row.timeline ?? "",
    services: row.services ?? [],
    projectFocus: row.project_focus ?? "",
  });
}

function toInquiryPreview(row: InquiryRow): InquiryPreview {
  const attribution = normalizeAttribution(row.attribution);
  const routing = normalizeRouting(row);

  return {
    id: row.id,
    company: row.company?.trim() || row.name,
    contact: row.name,
    email: row.email,
    website: row.website ?? undefined,
    budget: row.budget || "TBD",
    timeline: row.timeline || "TBD",
    services: row.services ?? [],
    source: row.source || row.referral_source || attribution.referralSource || "Direct",
    region: row.region || "Not specified",
    projectFocus: row.project_focus ?? undefined,
    referralSource: row.referral_source ?? undefined,
    status: normalizeInquiryStatus(row.status),
    routing,
    notes: row.notes || row.message || "No internal notes yet.",
    attribution,
    goals: row.goals ?? undefined,
    message: row.message ?? undefined,
    notificationDelivered: row.notification_delivered,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && inquiryStatusOptions.includes(value as InquiryStatus);
}

export function getInquiryStatusOptions() {
  return [...inquiryStatusOptions];
}

export async function fetchPersistedInquiries() {
  if (!isSupabaseConfigured()) {
    return [] as InquiryPreview[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(inquirySelect)
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingInquiryTableError(error)) {
      console.error("Unable to fetch inquiries:", error);
    }
    return [] as InquiryPreview[];
  }

  return ((data ?? []) as InquiryRow[]).map(toInquiryPreview);
}

export async function getInquiryPipeline() {
  const inquiries = await fetchPersistedInquiries();
  return inquiries.length ? inquiries : siteSettings.inquiryPipeline;
}

export async function createInquiryRecord(input: CreateInquiryInput) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: input.name,
      email: input.email,
      company: input.company || null,
      website: input.website || null,
      region: input.region || null,
      budget: input.budget || null,
      timeline: input.timeline || null,
      project_focus: input.projectFocus || null,
      referral_source: input.referralSource || null,
      services: input.services,
      goals: input.goals || null,
      message: input.message || null,
      consent: input.consent,
      source: input.source || null,
      status: input.status,
      routing: input.routing,
      notes: input.notes || null,
      attribution: input.attribution,
      notification_delivered: input.notificationDelivered,
    })
    .select(inquirySelect)
    .single();

  if (error) {
    throw error;
  }

  return toInquiryPreview(data as InquiryRow);
}

export async function updateInquiryNotificationStatus(
  inquiryId: string,
  notificationDelivered: boolean
) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ notification_delivered: notificationDelivered })
    .eq("id", inquiryId);

  if (error) {
    console.error("Unable to update inquiry notification status:", error);
  }
}

export async function updateInquiryLifecycle(
  inquiryId: string,
  input: UpdateInquiryLifecycleInput
) {
  const updates: Record<string, unknown> = {};

  if (input.status) {
    updates.status = input.status;
  }

  if (typeof input.notes === "string") {
    updates.notes = input.notes.trim() || null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .update(updates)
    .eq("id", inquiryId)
    .select(inquirySelect)
    .single();

  if (error) {
    throw error;
  }

  return toInquiryPreview(data as InquiryRow);
}

export function buildInquiryRecordDefaults(input: {
  budget: string;
  timeline: string;
  services: string[];
  projectFocus: string;
  referralSource: string;
  message: string;
  attribution: InquiryAttribution;
}) {
  const routing = qualifyInquiry({
    budget: input.budget,
    timeline: input.timeline,
    services: input.services,
    projectFocus: input.projectFocus,
  });

  return {
    routing,
    status: inferInquiryStatus(routing.priority),
    source: input.referralSource || input.attribution.referralSource || "Direct",
    notes:
      input.message ||
      "Captured from the website inquiry flow and ready for internal qualification.",
  };
}

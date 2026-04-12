import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackBillingEvents } from "@/lib/site/config";
import type { BillingEventPreview } from "@/types";

interface BillingEventRow {
  id: string;
  source: BillingEventPreview["source"];
  event_type: string;
  label: string;
  detail: string;
  status: BillingEventPreview["status"];
  customer_name: string | null;
  plan_id: BillingEventPreview["planId"] | null;
  subscription_id: string | null;
  amount: number | null;
  currency: string | null;
  stripe_event_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

interface SupabaseErrorLike {
  code?: string;
  message?: string;
}

interface PersistBillingEventInput {
  source: BillingEventPreview["source"];
  eventType: string;
  label: string;
  detail: string;
  status: BillingEventPreview["status"];
  customer?: string;
  planId?: BillingEventPreview["planId"];
  subscriptionId?: string;
  amount?: number;
  currency?: string;
  stripeEventId?: string;
  payload?: Record<string, unknown>;
  createdAt?: string;
}

const billingEventSelect =
  "id,source,event_type,label,detail,status,customer_name,plan_id,subscription_id,amount,currency,stripe_event_id,payload,created_at";

function isMissingBillingTableError(error: SupabaseErrorLike | null) {
  return (
    error?.code === "PGRST205" ||
    error?.message?.includes("public.billing_events") ||
    error?.message?.includes('relation "public.billing_events"')
  );
}

function toBillingEventPreview(row: BillingEventRow): BillingEventPreview {
  return {
    id: row.id,
    source: row.source,
    type: row.event_type,
    label: row.label,
    detail: row.detail,
    status: row.status,
    customer: row.customer_name ?? undefined,
    planId: row.plan_id ?? undefined,
    subscriptionId: row.subscription_id ?? undefined,
    amount: row.amount ?? undefined,
    currency: row.currency ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchPersistedBillingEvents() {
  if (!isSupabaseConfigured()) {
    return [] as BillingEventPreview[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("billing_events")
    .select(billingEventSelect)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    if (!isMissingBillingTableError(error)) {
      console.error("Unable to fetch billing events:", error);
    }

    return [] as BillingEventPreview[];
  }

  return ((data ?? []) as BillingEventRow[]).map(toBillingEventPreview);
}

export async function getBillingEvents() {
  const events = await fetchPersistedBillingEvents();
  return events.length ? events : fallbackBillingEvents;
}

export async function persistBillingEvent(input: PersistBillingEventInput) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("billing_events")
    .upsert(
      {
        source: input.source,
        event_type: input.eventType,
        label: input.label,
        detail: input.detail,
        status: input.status,
        customer_name: input.customer ?? null,
        plan_id: input.planId ?? null,
        subscription_id: input.subscriptionId ?? null,
        amount: input.amount ?? null,
        currency: input.currency ?? null,
        stripe_event_id: input.stripeEventId ?? null,
        payload: input.payload ?? null,
        created_at: input.createdAt ?? new Date().toISOString(),
      },
      input.stripeEventId ? { onConflict: "stripe_event_id" } : {}
    )
    .select(billingEventSelect)
    .single();

  if (error) {
    throw error;
  }

  return toBillingEventPreview(data as BillingEventRow);
}

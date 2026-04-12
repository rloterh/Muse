import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import { siteSettings } from "@/lib/site/config";
import type { ModerationActivityEntry, ModerationTask } from "@/types";

interface ModerationTaskRow {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: ModerationTask["kind"];
  priority: ModerationTask["priority"];
  status: ModerationTask["status"];
  owner_id: string | null;
  owner_name: string | null;
  notes: string | null;
  history: ModerationActivityEntry[] | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseErrorLike {
  code?: string;
  message?: string;
}

interface UpdateModerationTaskInput {
  status?: ModerationTask["status"];
  ownerId?: string;
  ownerName?: string;
  notes?: string;
  approvalAction?: "schedule" | "publish";
  actorName: string;
}

const moderationTaskSelect =
  "id,title,description,href,kind,priority,status,owner_id,owner_name,notes,history,created_at,updated_at";

const moderationStatusOptions = [
  "Needs review",
  "Scheduled",
  "Published",
  "In progress",
] as const satisfies ModerationTask["status"][];

function isMissingModerationTableError(error: SupabaseErrorLike | null) {
  return (
    error?.code === "PGRST205" ||
    error?.message?.includes("public.moderation_tasks") ||
    error?.message?.includes('relation "public.moderation_tasks"')
  );
}

function isActivityEntry(value: unknown): value is ModerationActivityEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.detail === "string" &&
    typeof candidate.actor === "string" &&
    typeof candidate.kind === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function normalizeHistory(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as ModerationActivityEntry[];
  }

  return value.filter(isActivityEntry).sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  );
}

function createActivityEntry(
  kind: ModerationActivityEntry["kind"],
  label: string,
  detail: string,
  actor: string,
  createdAt = new Date().toISOString()
): ModerationActivityEntry {
  return {
    id: `${kind}-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    detail,
    actor,
    kind,
    createdAt,
  };
}

function toModerationTask(row: ModerationTaskRow): ModerationTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href,
    kind: row.kind,
    priority: row.priority,
    status: row.status,
    ownerId: row.owner_id ?? undefined,
    ownerName: resolveInquiryOwnerName(row.owner_id, row.owner_name) ?? row.owner_name ?? undefined,
    notes: row.notes ?? undefined,
    history: normalizeHistory(row.history),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureModerationTaskRecord(taskId: string) {
  const seed = siteSettings.moderationQueue.find((task) => task.id === taskId);

  if (!seed) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("moderation_tasks")
    .upsert({
      id: seed.id,
      title: seed.title,
      description: seed.description,
      href: seed.href,
      kind: seed.kind,
      priority: seed.priority,
      status: seed.status,
      owner_id: seed.ownerId ?? null,
      owner_name: seed.ownerName ?? null,
      notes: seed.notes ?? null,
      history: seed.history ?? [],
      created_at: seed.createdAt ?? new Date().toISOString(),
      updated_at: seed.updatedAt ?? new Date().toISOString(),
    })
    .select(moderationTaskSelect)
    .single();

  if (error) {
    throw error;
  }

  return data as ModerationTaskRow;
}

export function isModerationTaskStatus(value: unknown): value is ModerationTask["status"] {
  return typeof value === "string" && moderationStatusOptions.includes(value as ModerationTask["status"]);
}

export async function fetchPersistedModerationTasks() {
  if (!isSupabaseConfigured()) {
    return [] as ModerationTask[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("moderation_tasks")
    .select(moderationTaskSelect)
    .order("updated_at", { ascending: false });

  if (error) {
    if (!isMissingModerationTableError(error)) {
      console.error("Unable to fetch moderation tasks:", error);
    }
    return [] as ModerationTask[];
  }

  return ((data ?? []) as ModerationTaskRow[]).map(toModerationTask);
}

export async function getModerationQueue() {
  const tasks = await fetchPersistedModerationTasks();
  return tasks.length ? tasks : siteSettings.moderationQueue;
}

export async function updateModerationTask(
  taskId: string,
  input: UpdateModerationTaskInput
) {
  const supabase = createAdminSupabaseClient();
  const { data: fetchedTask, error: fetchError } = await supabase
    .from("moderation_tasks")
    .select(moderationTaskSelect)
    .eq("id", taskId)
    .single();

  if (fetchError && isMissingModerationTableError(fetchError)) {
    throw fetchError;
  }

  const current =
    (fetchedTask as ModerationTaskRow | null) ?? (await ensureModerationTaskRecord(taskId));

  if (!current) {
    throw fetchError ?? new Error("Moderation task not found.");
  }

  const history = normalizeHistory(current.history);
  const updates: Record<string, unknown> = {};

  if (input.status) {
    updates.status = input.status;
  }

  if (typeof input.ownerId === "string") {
    updates.owner_id = input.ownerId || null;
    updates.owner_name =
      resolveInquiryOwnerName(input.ownerId, input.ownerName || current.owner_name) ||
      input.ownerName ||
      null;
  }

  if (typeof input.notes === "string") {
    updates.notes = input.notes.trim() || null;
  }

  if (input.status && input.status !== current.status) {
    history.unshift(
      createActivityEntry(
        "status",
        "Moderation status updated",
        `Task moved to ${input.status}.`,
        input.actorName
      )
    );
  }

  if (
    typeof input.ownerId === "string" &&
    input.ownerId !== (current.owner_id ?? "")
  ) {
    const ownerName =
      resolveInquiryOwnerName(input.ownerId, input.ownerName || current.owner_name) || "Unassigned";
    history.unshift(
      createActivityEntry(
        "assignment",
        "Content owner updated",
        `Task ownership moved to ${ownerName}.`,
        input.actorName
      )
    );
  }

  if (
    typeof input.notes === "string" &&
    input.notes.trim() &&
    input.notes.trim() !== (current.notes ?? "")
  ) {
    history.unshift(
      createActivityEntry("note", "Moderation note updated", input.notes.trim(), input.actorName)
    );
  }

  if (input.approvalAction === "schedule") {
    history.unshift(
      createActivityEntry(
        "approval",
        "Approved for scheduling",
        "Task was approved and moved into the scheduled publishing queue.",
        input.actorName
      )
    );
    updates.status = "Scheduled";
  }

  if (input.approvalAction === "publish") {
    history.unshift(
      createActivityEntry(
        "approval",
        "Approved and published",
        "Task was approved and marked as published.",
        input.actorName
      )
    );
    updates.status = "Published";
  }

  updates.history = history.slice(0, 12);

  const { data: updatedTask, error } = await supabase
    .from("moderation_tasks")
    .update(updates)
    .eq("id", taskId)
    .select(moderationTaskSelect)
    .single();

  if (error) {
    throw error;
  }

  return toModerationTask(updatedTask as ModerationTaskRow);
}

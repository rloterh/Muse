"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCheck,
  LoaderCircle,
  Save,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { inquiryOwners, resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ModerationTask } from "@/types";

interface ModerationWorkspaceProps {
  tasks: ModerationTask[];
}

const moderationStatusOptions = [
  "Needs review",
  "Scheduled",
  "Published",
  "In progress",
] as const satisfies ModerationTask["status"][];

function priorityVariant(priority: ModerationTask["priority"]) {
  if (priority === "high") return "warning";
  if (priority === "medium") return "accent";
  return "neutral";
}

function formatTimestamp(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ModerationWorkspace({ tasks }: ModerationWorkspaceProps) {
  const [items, setItems] = useState(tasks);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  function updateTask(id: string, updates: Partial<ModerationTask>) {
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  async function submitTaskUpdate(
    id: string,
    payload: {
      status?: ModerationTask["status"];
      ownerId?: string;
      notes?: string;
      approvalAction?: "schedule" | "publish";
    }
  ) {
    const currentTask = items.find((task) => task.id === id);

    if (!currentTask) {
      return;
    }

    setSavingId(id);
    setMessages((current) => ({ ...current, [id]: "" }));

    try {
      const response = await fetch(`/api/admin/moderation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessages((current) => ({
          ...current,
          [id]: data.error ?? "Unable to update the moderation task right now.",
        }));
        return;
      }

      if (data.task) {
        updateTask(id, data.task);
      }

      setMessages((current) => ({
        ...current,
        [id]:
          payload.approvalAction === "publish"
            ? "Task approved and published."
            : payload.approvalAction === "schedule"
              ? "Task approved for scheduling."
              : "Moderation state saved.",
      }));
    } catch {
      setMessages((current) => ({
        ...current,
        [id]: "Network error. Please try again.",
      }));
    } finally {
      setSavingId(null);
    }
  }

  const counts = {
    total: items.length,
    needsReview: items.filter((task) => task.status === "Needs review").length,
    scheduled: items.filter((task) => task.status === "Scheduled").length,
    published: items.filter((task) => task.status === "Published").length,
  };

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Moderation workspace
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Ownership, approvals, and publishing trail
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              This replaces the static moderation preview with a durable workspace for status
              transitions, content ownership, and approval history.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="accent">{counts.total} active</StatusBadge>
            <StatusBadge>{counts.needsReview} needs review</StatusBadge>
            <StatusBadge>{counts.scheduled} scheduled</StatusBadge>
            <StatusBadge>{counts.published} published</StatusBadge>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        {items.map((task, index) => {
          const history = task.history ?? [];

          return (
            <Reveal key={task.id} delay={index * 0.05}>
              <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      <ShieldAlert className="h-4 w-4 text-[var(--color-accent)]" />
                      {task.kind.replace("-", " ")}
                    </div>
                    <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">
                      {task.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {task.description}
                    </p>
                  </div>
                  <StatusBadge variant={priorityVariant(task.priority)}>{task.priority}</StatusBadge>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge variant="accent">{task.status}</StatusBadge>
                  {task.ownerName ? <StatusBadge>{task.ownerName}</StatusBadge> : <StatusBadge>Unassigned</StatusBadge>}
                  {task.updatedAt ? <StatusBadge>{`Updated ${formatTimestamp(task.updatedAt)}`}</StatusBadge> : null}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      <UserRound className="h-4 w-4 text-[var(--color-accent)]" />
                      Content owner
                    </div>
                    <select
                      value={task.ownerId ?? ""}
                      onChange={(event) =>
                        updateTask(task.id, {
                          ownerId: event.target.value || undefined,
                          ownerName: resolveInquiryOwnerName(event.target.value, task.ownerName),
                        })
                      }
                      className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    >
                      <option value="">Select owner</option>
                      {inquiryOwners.map((owner) => (
                        <option key={owner.id} value={owner.id} className="bg-[var(--color-bg)]">
                          {owner.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Moderation status
                    </p>
                    <select
                      value={task.status}
                      onChange={(event) =>
                        updateTask(task.id, {
                          status: event.target.value as ModerationTask["status"],
                        })
                      }
                      className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    >
                      {moderationStatusOptions.map((status) => (
                        <option key={status} value={status} className="bg-[var(--color-bg)]">
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Moderation notes
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1500}
                    value={task.notes ?? ""}
                    onChange={(event) =>
                      updateTask(task.id, {
                        notes: event.target.value,
                      })
                    }
                    className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                    placeholder="Record approval notes, QA context, or publishing caveats."
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-5">
                  <button
                    type="button"
                    disabled={savingId === task.id}
                    onClick={() =>
                      submitTaskUpdate(task.id, {
                        status: task.status,
                        ownerId: task.ownerId ?? "",
                        notes: task.notes ?? "",
                      })
                    }
                    className="inline-flex items-center gap-2 border border-[var(--color-text)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === task.id ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save moderation state
                      </>
                    )}
                  </button>

                  {task.status !== "Scheduled" && task.status !== "Published" ? (
                    <button
                      type="button"
                      disabled={savingId === task.id}
                      onClick={() => submitTaskUpdate(task.id, { approvalAction: "schedule" })}
                      className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCheck className="h-4 w-4 text-[var(--color-accent)]" />
                      Approve and schedule
                    </button>
                  ) : null}

                  {task.status !== "Published" ? (
                    <button
                      type="button"
                      disabled={savingId === task.id}
                      onClick={() => submitTaskUpdate(task.id, { approvalAction: "publish" })}
                      className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCheck className="h-4 w-4 text-[var(--color-accent)]" />
                      Mark published
                    </button>
                  ) : null}

                  <Link
                    href={task.href}
                    className="inline-flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    Open target
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                  </Link>
                </div>

                {messages[task.id] ? (
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    {messages[task.id]}
                  </p>
                ) : null}

                <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Approval trail
                  </p>
                  <div className="mt-4 space-y-3">
                    {history.length > 0 ? (
                      history.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                              {entry.label}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                              {formatTimestamp(entry.createdAt) ?? "Now"}
                            </p>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {entry.detail}
                          </p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                            {entry.actor}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                        No moderation history recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

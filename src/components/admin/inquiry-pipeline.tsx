"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, LoaderCircle, Radar, Save, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface InquiryPipelineProps {
  inquiries: InquiryPreview[];
}

const statusOptions = [
  "New",
  "Qualified",
  "Discovery scheduled",
  "Proposal drafted",
] as const satisfies InquiryPreview["status"][];

function priorityVariant(priority: InquiryPreview["routing"]["priority"]) {
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

export function InquiryPipeline({ inquiries }: InquiryPipelineProps) {
  const [items, setItems] = useState(inquiries);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const availableStatuses = useMemo(() => [...statusOptions], []);

  useEffect(() => {
    setItems(inquiries);
  }, [inquiries]);

  function updateInquiry(id: string, updates: Partial<InquiryPreview>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  async function handleSave(id: string) {
    const inquiry = items.find((item) => item.id === id);

    if (!inquiry) {
      return;
    }

    setSavingId(id);
    setMessages((current) => ({ ...current, [id]: "" }));

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: inquiry.status,
          notes: inquiry.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((current) => ({
          ...current,
          [id]: data.error ?? "Unable to update the inquiry right now.",
        }));
        return;
      }

      if (data.inquiry) {
        updateInquiry(id, data.inquiry);
      }

      setMessages((current) => ({
        ...current,
        [id]: "Inquiry lifecycle saved.",
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

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Inquiry pipeline
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Operational visibility for new business
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              Live inquiries now persist through Supabase so routing, notes, and lifecycle changes
              can be managed from the operational shell instead of a static preview dataset.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            {items.length} active inquiries
          </div>
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={0.08}>
          <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-sm text-[var(--color-text-muted)]">
            No live inquiries yet. New submissions will appear here once the contact flow starts
            capturing persisted records.
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {items.map((inquiry, index) => {
            const createdAt = formatTimestamp(inquiry.createdAt);
            const updatedAt = formatTimestamp(inquiry.updatedAt);

            return (
              <Reveal key={inquiry.id} delay={index * 0.06}>
                <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        {inquiry.status}
                      </p>
                      <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">
                        {inquiry.company}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {inquiry.contact}
                        {inquiry.email ? ` | ${inquiry.email}` : ""}
                      </p>
                    </div>
                    <StatusBadge variant={priorityVariant(inquiry.routing.priority)}>
                      {inquiry.routing.priority}
                    </StatusBadge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {inquiry.services.map((service) => (
                      <StatusBadge key={`${inquiry.id}-${service}`} variant="accent">
                        {service}
                      </StatusBadge>
                    ))}
                    {inquiry.notificationDelivered === false && (
                      <StatusBadge variant="warning">Email pending</StatusBadge>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Budget
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Timeline
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Source
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.source}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Fit
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.routing.fit}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Region
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.region}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Created
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">
                        {createdAt ?? "Preview seed"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      <Radar className="h-4 w-4 text-[var(--color-accent)]" />
                      Routing
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-text)]">
                      {inquiry.routing.team} | {inquiry.routing.owner}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {inquiry.routing.nextStep}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                    <label className="block text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Lifecycle status
                    </label>
                    <select
                      value={inquiry.status}
                      onChange={(event) =>
                        updateInquiry(inquiry.id, {
                          status: event.target.value as InquiryPreview["status"],
                        })
                      }
                      className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    >
                      {availableStatuses.map((status) => (
                        <option key={status} value={status} className="bg-[var(--color-bg)]">
                          {status}
                        </option>
                      ))}
                    </select>

                    <label className="mt-5 block text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Internal notes
                    </label>
                    <textarea
                      rows={4}
                      maxLength={1500}
                      value={inquiry.notes}
                      onChange={(event) =>
                        updateInquiry(inquiry.id, {
                          notes: event.target.value,
                        })
                      }
                      className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                    />

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        {updatedAt ? `Updated ${updatedAt}` : "Preview data"}
                      </div>
                      <button
                        type="button"
                        disabled={savingId === inquiry.id}
                        onClick={() => handleSave(inquiry.id)}
                        className="inline-flex items-center gap-2 border border-[var(--color-text)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingId === inquiry.id ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Saving
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save lifecycle
                          </>
                        )}
                      </button>
                    </div>

                    {messages[inquiry.id] ? (
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        {messages[inquiry.id]}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Operational inquiry brief
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}

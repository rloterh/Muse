"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  CalendarClock,
  LoaderCircle,
  Radar,
  Save,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  getViewerOwnerId,
  inquiryOwners,
  resolveInquiryOwnerName,
} from "@/lib/inquiries/owners";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface InquiryPipelineProps {
  inquiries: InquiryPreview[];
  viewerName: string;
}

type QueueView = "all" | "mine" | "urgent" | "follow-up" | "proposal";

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

function formatTimestamp(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function toDateInputValue(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function toIsoDate(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T09:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isFollowUpDue(nextTouchAt?: string) {
  if (!nextTouchAt) {
    return false;
  }

  const timestamp = new Date(nextTouchAt).getTime();
  return !Number.isNaN(timestamp) && timestamp <= Date.now();
}

export function InquiryPipeline({ inquiries, viewerName }: InquiryPipelineProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(inquiries);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<InquiryPreview["status"] | "all">(() => {
    const value = searchParams.get("status");
    return value && statusOptions.includes(value as InquiryPreview["status"])
      ? (value as InquiryPreview["status"])
      : "all";
  });
  const [ownerFilter, setOwnerFilter] = useState<string>(() => searchParams.get("owner") ?? "all");
  const [followUpFilter, setFollowUpFilter] = useState(() => searchParams.get("followUp") === "1");
  const [queueView, setQueueView] = useState<QueueView>(() => {
    const value = searchParams.get("view");
    return value === "mine" ||
      value === "urgent" ||
      value === "follow-up" ||
      value === "proposal"
      ? value
      : "all";
  });
  const viewerOwnerId = useMemo(() => getViewerOwnerId(viewerName), [viewerName]);
  const ownerOptions = useMemo(() => inquiryOwners, []);
  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== "all" ||
    ownerFilter !== "all" ||
    followUpFilter ||
    queueView !== "all";

  useEffect(() => {
    setItems(inquiries);
  }, [inquiries]);

  useEffect(() => {
    const nextSearch = searchParams.get("q") ?? "";
    const nextStatus = searchParams.get("status");
    const nextOwner = searchParams.get("owner") ?? "all";
    const nextFollowUp = searchParams.get("followUp") === "1";
    const nextView = searchParams.get("view");

    setSearch(nextSearch);
    setStatusFilter(
      nextStatus && statusOptions.includes(nextStatus as InquiryPreview["status"])
        ? (nextStatus as InquiryPreview["status"])
        : "all"
    );
    setOwnerFilter(nextOwner);
    setFollowUpFilter(nextFollowUp);
    setQueueView(
      nextView === "mine" ||
        nextView === "urgent" ||
        nextView === "follow-up" ||
        nextView === "proposal"
        ? nextView
        : "all"
    );
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    if (ownerFilter !== "all") {
      params.set("owner", ownerFilter);
    } else {
      params.delete("owner");
    }

    if (followUpFilter) {
      params.set("followUp", "1");
    } else {
      params.delete("followUp");
    }

    if (queueView !== "all") {
      params.set("view", queueView);
    } else {
      params.delete("view");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [followUpFilter, ownerFilter, pathname, queueView, router, search, searchParams, statusFilter]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((inquiry) => {
      const matchesSearch =
        !query ||
        [
          inquiry.company,
          inquiry.contact,
          inquiry.email,
          inquiry.source,
          inquiry.region,
          inquiry.assignedTo,
          inquiry.routing.owner,
          ...inquiry.services,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));

      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
      const matchesOwner =
        ownerFilter === "all" ||
        (ownerFilter === "unassigned" && !inquiry.assignedOwnerId) ||
        inquiry.assignedOwnerId === ownerFilter ||
        (!inquiry.assignedOwnerId &&
          ownerFilter !== "unassigned" &&
          resolveInquiryOwnerName(ownerFilter) === (inquiry.assignedTo ?? inquiry.routing.owner));
      const matchesFollowUp = !followUpFilter || isFollowUpDue(inquiry.nextTouchAt);
      const matchesQueueView =
        queueView === "all" ||
        (queueView === "mine" &&
          (viewerOwnerId
            ? inquiry.assignedOwnerId === viewerOwnerId
            : [inquiry.assignedTo, inquiry.routing.owner].some((value) => value === viewerName))) ||
        (queueView === "urgent" && inquiry.routing.priority === "high") ||
        (queueView === "follow-up" && isFollowUpDue(inquiry.nextTouchAt)) ||
        (queueView === "proposal" && inquiry.status === "Proposal drafted");

      return matchesSearch && matchesStatus && matchesOwner && matchesFollowUp && matchesQueueView;
    });
  }, [followUpFilter, items, ownerFilter, queueView, search, statusFilter, viewerName, viewerOwnerId]);

  const queueViews = useMemo(
    () => [
      {
        value: "all" as const,
        label: "All",
        count: items.length,
      },
      {
        value: "mine" as const,
        label: "My queue",
        count: items.filter((inquiry) =>
          viewerOwnerId
            ? inquiry.assignedOwnerId === viewerOwnerId
            : [inquiry.assignedTo, inquiry.routing.owner].some((value) => value === viewerName)
        ).length,
      },
      {
        value: "urgent" as const,
        label: "Urgent",
        count: items.filter((inquiry) => inquiry.routing.priority === "high").length,
      },
      {
        value: "follow-up" as const,
        label: "Follow-up due",
        count: items.filter((inquiry) => isFollowUpDue(inquiry.nextTouchAt)).length,
      },
      {
        value: "proposal" as const,
        label: "Proposal drafted",
        count: items.filter((inquiry) => inquiry.status === "Proposal drafted").length,
      },
    ],
    [items, viewerName, viewerOwnerId]
  );

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
          assignedOwnerId: inquiry.assignedOwnerId,
          nextTouchAt: inquiry.nextTouchAt ?? null,
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
        [id]: "Inquiry ops state saved.",
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
              Inquiries now carry ownership, follow-up timing, and recent activity so the admin
              shell feels like a real operations workspace rather than a static queue.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            {filteredItems.length} visible inquiries
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-5">
            {queueViews.map((view) => (
              <button
                key={view.value}
                type="button"
                onClick={() => setQueueView(view.value)}
                className={
                  queueView === view.value
                    ? "border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-bg)] transition-all"
                    : "border border-[var(--color-border)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                }
              >
                {view.label} ({view.count})
              </button>
            ))}
          </div>

          {hasActiveFilters ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-5">
              <StatusBadge variant="accent">Active filters</StatusBadge>
              {queueView !== "all" ? <StatusBadge>{queueView.replace("-", " ")}</StatusBadge> : null}
              {statusFilter !== "all" ? <StatusBadge>{statusFilter}</StatusBadge> : null}
              {ownerFilter !== "all" ? (
                <StatusBadge>
                  {ownerFilter === "unassigned"
                    ? "Unassigned"
                    : resolveInquiryOwnerName(ownerFilter, ownerFilter)}
                </StatusBadge>
              ) : null}
              {followUpFilter ? <StatusBadge>Follow-up due</StatusBadge> : null}
              {search.trim() ? <StatusBadge>{`Search: ${search.trim()}`}</StatusBadge> : null}
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setOwnerFilter("all");
                  setFollowUpFilter(false);
                  setQueueView("all");
                }}
                className="ml-auto text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]"
              >
                Clear all
              </button>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))]">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                Search
              </span>
              <span className="mt-3 flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
                <Search className="h-4 w-4 text-[var(--color-text-dim)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Company, contact, owner, or service"
                  className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as InquiryPreview["status"] | "all")
                }
                className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status} className="bg-[var(--color-bg)]">
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                Owner
              </span>
              <select
                value={ownerFilter}
                onChange={(event) => setOwnerFilter(event.target.value)}
                className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="all">All owners</option>
                <option value="unassigned">Unassigned</option>
                {ownerOptions.map((owner) => (
                  <option key={owner.id} value={owner.id} className="bg-[var(--color-bg)]">
                    {owner.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 lg:mt-[1.55rem]">
              <input
                type="checkbox"
                checked={followUpFilter}
                onChange={(event) => setFollowUpFilter(event.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--color-text-muted)]">Follow-up due only</span>
            </label>
          </div>
        </div>
      </Reveal>

      {filteredItems.length === 0 ? (
        <Reveal delay={0.08}>
          <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-sm text-[var(--color-text-muted)]">
            No inquiries match the current filters. Clear one of the filters to broaden the queue
            again.
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {filteredItems.map((inquiry, index) => {
            const createdAt = formatTimestamp(inquiry.createdAt);
            const updatedAt = formatTimestamp(inquiry.updatedAt);
            const nextTouchAt = formatTimestamp(inquiry.nextTouchAt, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            const history = inquiry.history ?? [];

            return (
              <Reveal key={inquiry.id} delay={index * 0.05}>
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
                    {isFollowUpDue(inquiry.nextTouchAt) && (
                      <StatusBadge variant="warning">Follow-up due</StatusBadge>
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

                  <div className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 lg:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        <UserRound className="h-4 w-4 text-[var(--color-accent)]" />
                        Owner
                      </div>
                      <select
                        value={inquiry.assignedOwnerId ?? ""}
                        onChange={(event) =>
                          updateInquiry(inquiry.id, {
                            assignedOwnerId: event.target.value,
                            assignedTo: resolveInquiryOwnerName(event.target.value, inquiry.assignedTo),
                          })
                        }
                        className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                      >
                        <option value="">Select owner</option>
                        {ownerOptions.map((owner) => (
                          <option key={owner.id} value={owner.id} className="bg-[var(--color-bg)]">
                            {owner.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                        Suggested owner: {inquiry.routing.owner}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        <CalendarClock className="h-4 w-4 text-[var(--color-accent)]" />
                        Next touch
                      </div>
                      <input
                        type="date"
                        value={toDateInputValue(inquiry.nextTouchAt)}
                        onChange={(event) =>
                          updateInquiry(inquiry.id, {
                            nextTouchAt: toIsoDate(event.target.value) ?? undefined,
                          })
                        }
                        className="mt-3 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                      />
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                        {nextTouchAt ? `Scheduled for ${nextTouchAt}` : "No follow-up date set"}
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
                      {statusOptions.map((status) => (
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
                            Save ops state
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

                  {(inquiry.goals || inquiry.message || history.length > 0) && (
                    <div className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                          Brief context
                        </p>
                        <div className="mt-3 space-y-3">
                          {inquiry.goals ? (
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {inquiry.goals}
                            </p>
                          ) : null}
                          {inquiry.message ? (
                            <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                              {inquiry.message}
                            </p>
                          ) : null}
                          {!inquiry.goals && !inquiry.message ? (
                            <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                              No extended project brief attached yet.
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                          Recent activity
                        </p>
                        <div className="mt-3 space-y-3">
                          {history.slice(0, 2).map((entry) => (
                            <div
                              key={entry.id}
                              className="border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
                            >
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
                          ))}
                          {history.length === 0 ? (
                            <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                              No operational activity recorded yet.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)]"
                    >
                      Open inquiry brief
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                    </Link>
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

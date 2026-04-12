import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, ShieldCheck, UsersRound } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview, ModerationTask } from "@/types";

interface ActivityFeedProps {
  inquiries: InquiryPreview[];
  moderationTasks: ModerationTask[];
}

interface ActivityFeedItem {
  id: string;
  label: string;
  detail: string;
  actor: string;
  createdAt: string;
  source: "Inquiry" | "Moderation";
  sourceVariant: "accent" | "neutral";
  kind: string;
  priority: "low" | "medium" | "high";
  entityTitle: string;
  entityMeta: string;
  href: string;
  linkLabel: string;
}

function toTimestamp(value?: string) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatTimestamp(value: string) {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function priorityVariant(priority: ActivityFeedItem["priority"]) {
  if (priority === "high") {
    return "warning";
  }

  if (priority === "medium") {
    return "accent";
  }

  return "neutral";
}

function formatKind(kind: string) {
  return kind.replace(/-/g, " ");
}

function buildActivityFeedItems(
  inquiries: InquiryPreview[],
  moderationTasks: ModerationTask[]
) {
  const inquiryItems: ActivityFeedItem[] = inquiries.flatMap((inquiry) =>
    (inquiry.history ?? []).map((entry) => ({
      id: `inquiry-${inquiry.id}-${entry.id}`,
      label: entry.label,
      detail: entry.detail,
      actor: entry.actor,
      createdAt: entry.createdAt,
      source: "Inquiry" as const,
      sourceVariant: "accent" as const,
      kind: entry.kind,
      priority: inquiry.routing.priority,
      entityTitle: inquiry.company,
      entityMeta: `${inquiry.status} queue`,
      href: `/admin/inquiries/${inquiry.id}`,
      linkLabel: "Open inquiry",
    }))
  );

  const moderationItems: ActivityFeedItem[] = moderationTasks.flatMap((task) =>
    (task.history ?? []).map((entry) => ({
      id: `moderation-${task.id}-${entry.id}`,
      label: entry.label,
      detail: entry.detail,
      actor: entry.actor,
      createdAt: entry.createdAt,
      source: "Moderation" as const,
      sourceVariant: "neutral" as const,
      kind: entry.kind,
      priority: task.priority,
      entityTitle: task.title,
      entityMeta: task.status,
      href: task.href,
      linkLabel: "Open target",
    }))
  );

  return [...inquiryItems, ...moderationItems]
    .filter((item) => toTimestamp(item.createdAt) !== null)
    .sort((left, right) => (toTimestamp(right.createdAt) ?? 0) - (toTimestamp(left.createdAt) ?? 0));
}

export function ActivityFeed({ inquiries, moderationTasks }: ActivityFeedProps) {
  const items = buildActivityFeedItems(inquiries, moderationTasks);
  const visibleItems = items.slice(0, 8);
  const inquiryActions = items.filter((item) => item.source === "Inquiry").length;
  const approvalActions = items.filter(
    (item) => item.source === "Moderation" && item.kind === "approval"
  ).length;
  const lastTwentyFourHours = Date.now() - 24 * 60 * 60 * 1000;
  const recentActions = items.filter((item) => (toTimestamp(item.createdAt) ?? 0) >= lastTwentyFourHours)
    .length;

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Unified activity feed
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              One timeline for pipeline actions and publishing approvals
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              Inquiry movement and moderation approvals now sit in a single operational stream, so
              the team can spot ownership changes, publishing decisions, and pipeline momentum
              without jumping between cards.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="accent">{items.length} logged events</StatusBadge>
            <StatusBadge>{inquiryActions} inquiry actions</StatusBadge>
            <StatusBadge>{approvalActions} approvals</StatusBadge>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Reveal delay={0.04}>
          <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              <Activity className="h-4 w-4 text-[var(--color-accent)]" />
              Operational pulse
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Total feed events
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">{items.length}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Combined ops and moderation history across the admin surface.
                </p>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Approval decisions
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                  {approvalActions}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Published or scheduled approvals captured in the moderation workflow.
                </p>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Last 24 hours
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">{recentActions}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Fresh activity visible for standups, approvals, and delivery follow-through.
                </p>
              </div>
            </div>

            <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                <Clock3 className="h-4 w-4 text-[var(--color-accent)]" />
                Feed guidance
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Use this stream as the first admin checkpoint before drilling into the inquiry queue
                or moderation workspace. It highlights what changed most recently and where action
                happened.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              <UsersRound className="h-4 w-4 text-[var(--color-accent)]" />
              Recent activity
            </div>

            {visibleItems.length > 0 ? (
              <div className="mt-6 space-y-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge variant={item.sourceVariant}>{item.source}</StatusBadge>
                          <StatusBadge variant={priorityVariant(item.priority)}>
                            {item.priority}
                          </StatusBadge>
                          <StatusBadge>{formatKind(item.kind)}</StatusBadge>
                        </div>
                        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                          {item.label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {item.detail}
                        </p>
                      </div>
                      <StatusBadge>{formatTimestamp(item.createdAt)}</StatusBadge>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                      <span>{item.entityTitle}</span>
                      <span className="text-[var(--color-text-dim)]">/</span>
                      <span>{item.entityMeta}</span>
                      <span className="text-[var(--color-text-dim)]">/</span>
                      <span>{item.actor}</span>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {item.linkLabel}
                        <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
                No shared activity has been recorded yet. As inquiries are updated and moderation
                actions are taken, the feed will populate here automatically.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

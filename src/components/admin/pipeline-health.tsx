"use client";

import Link from "next/link";
import {
  AlarmClockCheck,
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  Globe2,
  Layers3,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface PipelineHealthProps {
  inquiries: InquiryPreview[];
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1;
    return summary;
  }, {});
}

function isFollowUpDue(nextTouchAt?: string) {
  if (!nextTouchAt) {
    return false;
  }

  const timestamp = new Date(nextTouchAt).getTime();
  return !Number.isNaN(timestamp) && timestamp <= Date.now();
}

function ageInDays(value?: string) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
}

function topRows(summary: Record<string, number>, limit = 4) {
  const total = Object.values(summary).reduce((count, value) => count + value, 0);

  return Object.entries(summary)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      share: total ? Math.round((count / total) * 100) : 0,
    }));
}

export function PipelineHealth({ inquiries }: PipelineHealthProps) {
  const attentionNeeded = inquiries.filter(
    (inquiry) =>
      !inquiry.assignedOwnerId ||
      isFollowUpDue(inquiry.nextTouchAt) ||
      inquiry.notificationDelivered === false
  ).length;
  const staleQualified = inquiries.filter((inquiry) => {
    const age = ageInDays(inquiry.updatedAt ?? inquiry.createdAt);
    return age !== null && age >= 5 && inquiry.status !== "Proposal drafted";
  }).length;
  const proposalRunway = inquiries.filter((inquiry) => inquiry.status === "Proposal drafted").length;
  const strategicOpportunities = inquiries.filter(
    (inquiry) => inquiry.routing.fit === "Strategic" || inquiry.routing.fit === "Build-ready"
  ).length;

  const serviceDemand = topRows(
    countBy(inquiries.flatMap((inquiry) => inquiry.services).filter(Boolean)),
    5
  );
  const regionalMix = topRows(countBy(inquiries.map((inquiry) => inquiry.region).filter(Boolean)), 5);
  const actionCards = [
    attentionNeeded > 0
      ? {
          label: "Review at-risk inquiries",
          description:
            "Start with overdue follow-ups and notification misses so nothing valuable slips out of view.",
          href: "/admin?followUp=1",
          badge: `${attentionNeeded} attention item${attentionNeeded === 1 ? "" : "s"}`,
        }
      : null,
    proposalRunway > 0
      ? {
          label: "Move proposal-stage opportunities forward",
          description:
            "Use the proposal-focused queue to package scope, confirm momentum, and close the loop faster.",
          href: "/admin?view=proposal",
          badge: `${proposalRunway} proposal-ready`,
        }
      : null,
    strategicOpportunities > 0
      ? {
          label: "Protect strategic delivery capacity",
          description:
            "High-fit opportunities are stacking up. Review qualification and discovery readiness before intake gets noisy.",
          href: "/admin?status=Qualified",
          badge: `${strategicOpportunities} strong-fit opportunities`,
        }
      : null,
    inquiries.some((inquiry) => inquiry.routing.priority === "high")
      ? {
          label: "Triage urgent opportunities",
          description:
            "Surface urgent work first when the team needs a fast operational pass on timing, ownership, and response quality.",
          href: "/admin?view=urgent",
          badge: `${inquiries.filter((inquiry) => inquiry.routing.priority === "high").length} urgent`,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    description: string;
    href: string;
    badge: string;
  }[];

  const summaryCards = [
    {
      label: "Attention needed",
      value: `${attentionNeeded}`,
      note:
        attentionNeeded > 0
          ? "Overdue follow-up, missing ownership, or notification failures need a closer look."
          : "No immediate response-risk signals detected in the current queue.",
      icon: AlarmClockCheck,
    },
    {
      label: "Stale in stage",
      value: `${staleQualified}`,
      note:
        staleQualified > 0
          ? "These inquiries have not moved recently and may need re-qualification or a clearer next step."
          : "Pipeline movement looks current across the active stages.",
      icon: ClipboardList,
    },
    {
      label: "Proposal runway",
      value: `${proposalRunway}`,
      note:
        proposalRunway > 0
          ? "Proposal-stage work is ready for scope packaging, approvals, or commercial follow-through."
          : "No proposal-stage inquiries are sitting in the queue right now.",
      icon: BriefcaseBusiness,
    },
    {
      label: "Strong-fit pipeline",
      value: `${strategicOpportunities}`,
      note:
        strategicOpportunities > 0
          ? "Strategic and build-ready opportunities are where delivery attention is likely to matter most."
          : "The current queue leans more exploratory than strategically aligned.",
      icon: Layers3,
    },
  ];

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Pipeline health
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Demand signals and operational risk in one place
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              This layer turns the inquiry queue into a practical operating surface by surfacing
              demand mix, stale work, and the next views worth opening for follow-through.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
            <Globe2 className="h-4 w-4 text-[var(--color-accent)]" />
            {regionalMix.length} active region{regionalMix.length === 1 ? "" : "s"}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.05}>
            <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                <card.icon className="h-4 w-4 text-[var(--color-accent)]" />
                {card.label}
              </div>
              <p className="mt-5 font-display text-4xl font-bold tracking-tight text-[var(--color-text)]">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {card.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Reveal>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Demand mix
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                  Services clients are asking for most
                </h3>
              </div>
              <StatusBadge variant="accent">Top services</StatusBadge>
            </div>

            <div className="mt-6 space-y-4">
              {serviceDemand.length > 0 ? (
                serviceDemand.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <p className="text-[var(--color-text)]">{item.label}</p>
                      <p className="text-[var(--color-text-muted)]">
                        {item.count} inquiries · {item.share}%
                      </p>
                    </div>
                    <div className="mt-2 h-2 bg-[var(--color-bg)]">
                      <div
                        className="h-full bg-[var(--color-accent)] transition-all"
                        style={{ width: `${Math.max(item.share, 8)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">
                  Service demand will appear here once inquiries begin carrying scoped services.
                </p>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Regional mix
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                  Where the active pipeline is concentrated
                </h3>
              </div>
              <StatusBadge>Coverage</StatusBadge>
            </div>

            <div className="mt-6 space-y-4">
              {regionalMix.length > 0 ? (
                regionalMix.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                  >
                    <p className="text-sm text-[var(--color-text)]">{item.label}</p>
                    <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                      {item.count}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">
                  Regional distribution will populate once inquiries are attributed to operating
                  regions.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            Recommended queue actions
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {actionCards.length > 0 ? (
              actionCards.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group border border-[var(--color-border)] bg-[var(--color-bg)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge variant="accent">{action.badge}</StatusBadge>
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-[var(--color-text)]">
                    {action.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {action.description}
                  </p>
                </Link>
              ))
            ) : (
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-sm text-[var(--color-text-muted)]">
                The queue is relatively calm right now. Use the shared filters above to inspect the
                pipeline manually when new inquiries arrive.
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

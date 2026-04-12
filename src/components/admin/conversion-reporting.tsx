"use client";

import { BarChart3, Gauge, Radar, Route, TimerReset, Users2 } from "lucide-react";
import { resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import { isFollowUpDue } from "@/lib/inquiries/queue";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface ConversionReportingProps {
  inquiries: InquiryPreview[];
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1;
    return summary;
  }, {});
}

function topRows(summary: Record<string, number>, limit = 5) {
  return Object.entries(summary)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);
}

function percent(value: number, total: number) {
  if (!total) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

export function ConversionReporting({ inquiries }: ConversionReportingProps) {
  const totalInquiries = inquiries.length;
  const attributedCount = inquiries.filter(
    (item) =>
      item.attribution?.landingPath ||
      item.attribution?.utmCampaign ||
      item.attribution?.utmSource ||
      item.attribution?.utmMedium ||
      item.attribution?.intent ||
      item.attribution?.referralSource
  ).length;
  const campaignTaggedCount = inquiries.filter((item) => item.attribution?.utmCampaign).length;
  const proposalIntentCount = inquiries.filter(
    (item) => item.attribution?.intent === "proposal"
  ).length;
  const strategicFitCount = inquiries.filter((item) => item.routing.fit === "Strategic").length;
  const followUpDue = inquiries.filter((item) => isFollowUpDue(item.nextTouchAt)).length;

  const topSources = topRows(countBy(inquiries.map((item) => item.source || "Direct")));
  const topIntents = topRows(
    countBy(inquiries.map((item) => item.attribution?.intent ?? "unclassified"))
  );
  const topCampaigns = topRows(
    countBy(inquiries.map((item) => item.attribution?.utmCampaign ?? "direct"))
  );
  const stageMix = topRows(countBy(inquiries.map((item) => item.status)));
  const ownerLoad = topRows(
    countBy(
      inquiries.map(
        (item) =>
          resolveInquiryOwnerName(item.assignedOwnerId, item.assignedTo ?? item.routing.owner) ??
          "Unassigned"
      )
    )
  );
  const topLandingPaths = topRows(
    countBy(inquiries.map((item) => item.attribution?.landingPath ?? "/contact"))
  );
  const referralMediums = topRows(
    countBy(
      inquiries.map(
        (item) =>
          item.attribution?.utmMedium ??
          item.attribution?.utmSource ??
          item.attribution?.referralSource ??
          item.source ??
          "direct"
      )
    )
  );
  const serviceDemand = topRows(
    countBy(inquiries.flatMap((item) => item.services).filter(Boolean)),
    6
  );
  const pathPerformance = Object.values(
    inquiries.reduce<
      Record<
        string,
        {
          path: string;
          total: number;
          proposal: number;
          strategic: number;
          overdue: number;
        }
      >
    >((summary, inquiry) => {
      const path = inquiry.attribution?.landingPath ?? "/contact";
      const current = summary[path] ?? {
        path,
        total: 0,
        proposal: 0,
        strategic: 0,
        overdue: 0,
      };

      current.total += 1;
      if (inquiry.attribution?.intent === "proposal") {
        current.proposal += 1;
      }
      if (inquiry.routing.fit === "Strategic") {
        current.strategic += 1;
      }
      if (isFollowUpDue(inquiry.nextTouchAt)) {
        current.overdue += 1;
      }

      summary[path] = current;
      return summary;
    }, {})
  )
    .sort((left, right) => right.total - left.total)
    .slice(0, 4);

  const coverageCards = [
    {
      label: "Attribution coverage",
      value: percent(attributedCount, totalInquiries),
      note: `${attributedCount} of ${totalInquiries || 0} inquiries carry usable attribution context.`,
    },
    {
      label: "Campaign tagged",
      value: percent(campaignTaggedCount, totalInquiries),
      note: `${campaignTaggedCount} inquiries include an explicit UTM campaign for reporting.`,
    },
    {
      label: "Proposal intent",
      value: percent(proposalIntentCount, totalInquiries),
      note: `${proposalIntentCount} inquiries are entering through proposal-oriented journeys.`,
    },
    {
      label: "Strategic fit",
      value: percent(strategicFitCount, totalInquiries),
      note: `${strategicFitCount} inquiries look like strategic, higher-value conversations.`,
    },
  ];

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Conversion reporting
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Attribution and route intelligence
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              This layer closes Phase 3 by showing what is driving qualified inquiries, which
              routes are producing serious commercial conversations, and where follow-through risk
              is building.
            </p>
          </div>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
              Follow-up due
            </p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--color-accent)]">
              {followUpDue}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {coverageCards.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.05}>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                {card.label}
              </p>
              <p className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--color-accent)]">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {card.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Reveal>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              Top sources
            </div>
            <div className="mt-6 space-y-4">
              {topSources.map(([source, count]) => (
                <div
                  key={source}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-sm text-[var(--color-text)]">{source}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <Radar className="h-4 w-4 text-[var(--color-accent)]" />
              Intent mix
            </div>
            <div className="mt-6 space-y-4">
              {topIntents.map(([intent, count]) => (
                <div
                  key={intent}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-sm text-[var(--color-text)]">{intent}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <Gauge className="h-4 w-4 text-[var(--color-accent)]" />
              Campaign and medium
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Campaigns
                </p>
                <div className="mt-4 space-y-3">
                  {topCampaigns.map(([campaign, count]) => (
                    <div key={campaign} className="flex items-center justify-between">
                      <p className="text-sm text-[var(--color-text)]">{campaign}</p>
                      <p className="text-sm text-[var(--color-accent)]">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Referral mediums
                </p>
                <div className="mt-4 space-y-3">
                  {referralMediums.map(([medium, count]) => (
                    <div key={medium} className="flex items-center justify-between">
                      <p className="text-sm text-[var(--color-text)]">{medium}</p>
                      <p className="text-sm text-[var(--color-accent)]">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <Route className="h-4 w-4 text-[var(--color-accent)]" />
              Top landing paths
            </div>
            <div className="mt-6 space-y-4">
              {topLandingPaths.map(([path, count]) => (
                <div
                  key={path}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="max-w-[75%] break-all text-sm text-[var(--color-text)]">{path}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              Route quality
            </div>
            <div className="mt-6 space-y-4">
              {pathPerformance.map((path) => (
                <div
                  key={path.path}
                  className="border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="max-w-[70%] break-all text-sm text-[var(--color-text)]">
                      {path.path}
                    </p>
                    <StatusBadge variant="accent">{path.total} inquiries</StatusBadge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge>{path.proposal} proposal</StatusBadge>
                    <StatusBadge>{path.strategic} strategic</StatusBadge>
                    {path.overdue > 0 ? <StatusBadge variant="warning">{path.overdue} overdue</StatusBadge> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <TimerReset className="h-4 w-4 text-[var(--color-accent)]" />
              Stage mix
            </div>
            <div className="mt-6 space-y-4">
              {stageMix.map(([stage, count]) => (
                <div
                  key={stage}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-sm text-[var(--color-text)]">{stage}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <Users2 className="h-4 w-4 text-[var(--color-accent)]" />
              Owner load
            </div>
            <div className="mt-6 space-y-4">
              {ownerLoad.map(([owner, count]) => (
                <div
                  key={owner}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-sm text-[var(--color-text)]">{owner}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-4">
        <Reveal>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
              <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              Service demand
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {serviceDemand.map(([service, count]) => (
                <div key={service} className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                    {service}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

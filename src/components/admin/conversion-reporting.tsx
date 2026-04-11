"use client";

import { BarChart3, Radar, TimerReset, Users2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
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

function isFollowUpDue(nextTouchAt?: string) {
  if (!nextTouchAt) {
    return false;
  }

  const timestamp = new Date(nextTouchAt).getTime();
  return !Number.isNaN(timestamp) && timestamp <= Date.now();
}

export function ConversionReporting({ inquiries }: ConversionReportingProps) {
  const topSources = Object.entries(countBy(inquiries.map((item) => item.source))).sort(
    (left, right) => right[1] - left[1]
  );
  const topIntents = Object.entries(
    countBy(inquiries.map((item) => item.attribution?.intent ?? "unclassified"))
  ).sort((left, right) => right[1] - left[1]);
  const topCampaigns = Object.entries(
    countBy(inquiries.map((item) => item.attribution?.utmCampaign ?? "direct"))
  ).sort((left, right) => right[1] - left[1]);
  const stageMix = Object.entries(countBy(inquiries.map((item) => item.status))).sort(
    (left, right) => right[1] - left[1]
  );
  const ownerLoad = Object.entries(
    countBy(inquiries.map((item) => item.assignedTo ?? item.routing.owner))
  ).sort((left, right) => right[1] - left[1]);
  const followUpDue = inquiries.filter((item) => isFollowUpDue(item.nextTouchAt)).length;

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Conversion reporting
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Attribution snapshot for pipeline review
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              A lightweight view of what is driving inquiries right now, how the queue is staged,
              and where operational load is sitting across the team.
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

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
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
              Top intents
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
              <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              Campaigns
            </div>
            <div className="mt-6 space-y-4">
              {topCampaigns.map(([campaign, count]) => (
                <div
                  key={campaign}
                  className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-sm text-[var(--color-text)]">{campaign}</p>
                  <p className="font-display text-2xl font-bold tracking-tight text-[var(--color-accent)]">
                    {count}
                  </p>
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
    </section>
  );
}

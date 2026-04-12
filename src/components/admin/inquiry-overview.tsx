"use client";

import { BriefcaseBusiness, ClipboardCheck, Target, UsersRound } from "lucide-react";
import { resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import { Reveal } from "@/components/ui/reveal";
import type { InquiryPreview } from "@/types";

interface InquiryOverviewProps {
  inquiries: InquiryPreview[];
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1;
    return summary;
  }, {});
}

function topEntry(summary: Record<string, number>) {
  return Object.entries(summary).sort((left, right) => right[1] - left[1])[0] ?? null;
}

export function InquiryOverview({ inquiries }: InquiryOverviewProps) {
  const ownerSummary = countBy(
    inquiries.map(
      (inquiry) =>
        resolveInquiryOwnerName(inquiry.assignedOwnerId, inquiry.assignedTo ?? inquiry.routing.owner) ??
        "Unassigned"
    )
  );
  const stageSummary = countBy(inquiries.map((inquiry) => inquiry.status));
  const fitSummary = countBy(inquiries.map((inquiry) => inquiry.routing.fit));
  const proposalsReady = inquiries.filter((inquiry) => inquiry.status === "Proposal drafted").length;

  const busiestOwner = topEntry(ownerSummary);
  const dominantStage = topEntry(stageSummary);
  const strongestFit = topEntry(fitSummary);

  const cards = [
    {
      label: "Busiest owner",
      value: busiestOwner?.[0] ?? "No owner",
      note: busiestOwner ? `${busiestOwner[1]} active inquiries` : "Assign owners to balance workload.",
      icon: UsersRound,
    },
    {
      label: "Dominant stage",
      value: dominantStage?.[0] ?? "No active stage",
      note: dominantStage ? `${dominantStage[1]} inquiries currently grouped here` : "Pipeline is empty right now.",
      icon: ClipboardCheck,
    },
    {
      label: "Strongest fit",
      value: strongestFit?.[0] ?? "No fit yet",
      note: strongestFit ? `${strongestFit[1]} inquiries map to this fit` : "Qualification will populate fit data.",
      icon: Target,
    },
    {
      label: "Proposal-ready",
      value: `${proposalsReady}`,
      note: proposalsReady
        ? "These inquiries are ready for scope packaging or proposal follow-through."
        : "No inquiries are in proposal stage right now.",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section className="mt-12">
      <div className="grid gap-4 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.05}>
            <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                <card.icon className="h-4 w-4 text-[var(--color-accent)]" />
                {card.label}
              </div>
              <p className="mt-5 font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {card.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { getViewerOwnerId } from "@/lib/inquiries/owners";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface QueuePlaybooksProps {
  inquiries: InquiryPreview[];
  viewerName: string;
}

function isFollowUpDue(nextTouchAt?: string) {
  if (!nextTouchAt) {
    return false;
  }

  const timestamp = new Date(nextTouchAt).getTime();
  return !Number.isNaN(timestamp) && timestamp <= Date.now();
}

export function QueuePlaybooks({ inquiries, viewerName }: QueuePlaybooksProps) {
  const viewerOwnerId = getViewerOwnerId(viewerName);
  const viewerQueueCount = viewerOwnerId
    ? inquiries.filter((inquiry) => inquiry.assignedOwnerId === viewerOwnerId).length
    : inquiries.filter((inquiry) =>
        [inquiry.assignedTo, inquiry.routing.owner].some((value) => value === viewerName)
      ).length;
  const overdueFollowUps = inquiries.filter((inquiry) => isFollowUpDue(inquiry.nextTouchAt)).length;
  const urgentUnassigned = inquiries.filter(
    (inquiry) => inquiry.routing.priority === "high" && !inquiry.assignedOwnerId
  ).length;
  const proposalRunway = inquiries.filter((inquiry) => inquiry.status === "Proposal drafted").length;
  const strategicQualified = inquiries.filter(
    (inquiry) => inquiry.status === "Qualified" && inquiry.routing.fit === "Strategic"
  ).length;
  const notificationGaps = inquiries.filter((inquiry) => inquiry.notificationDelivered === false).length;

  const playbooks = [
    {
      label: "My queue focus",
      description:
        "Jump straight into the signed-in owner's active workload and make this the first pass for daily review.",
      href: "/admin?view=mine",
      badge: `${viewerQueueCount} in my queue`,
    },
    {
      label: "Rescue overdue follow-ups",
      description:
        "Open the leads where next-touch commitments have already slipped so response quality doesn't erode.",
      href: "/admin?view=follow-up",
      badge: `${overdueFollowUps} overdue`,
    },
    {
      label: "Triage urgent unassigned",
      description:
        "Handle the highest-risk routing gap first by isolating urgent inquiries that still lack an owner.",
      href: "/admin?owner=unassigned&priority=high",
      badge: `${urgentUnassigned} urgent unassigned`,
    },
    {
      label: "Advance proposal runway",
      description:
        "Use the proposal-stage queue to tighten follow-through, package scope, and keep commercial momentum moving.",
      href: "/admin?view=proposal",
      badge: `${proposalRunway} proposal ready`,
    },
    {
      label: "Protect strategic qualification",
      description:
        "Review the strongest strategic opportunities before they age into ambiguity or lose internal attention.",
      href: "/admin?status=Qualified&fit=Strategic",
      badge: `${strategicQualified} strategic qualified`,
    },
    {
      label: "Repair delivery gaps",
      description:
        "Inspect inquiries where the notification path did not complete, so ops handoff is reliable end to end.",
      href: "/admin?delivery=pending",
      badge: `${notificationGaps} delivery gaps`,
    },
  ];

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Queue playbooks
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Guided routes into the ops workspace
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              These playbooks turn the current queue state into a set of quick operating moves, so
              the team can jump from insight to action with the right filters already applied.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
            <Compass className="h-4 w-4 text-[var(--color-accent)]" />
            Route-backed queue shortcuts
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {playbooks.map((playbook, index) => (
          <Reveal key={playbook.label} delay={index * 0.05}>
            <Link
              href={playbook.href}
              className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <div className="flex items-center justify-between gap-3">
                <StatusBadge variant="accent">{playbook.badge}</StatusBadge>
                <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-[var(--color-text)]">
                {playbook.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {playbook.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
                Open queue state
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

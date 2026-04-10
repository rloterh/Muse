"use client";

import { ArrowUpRight, Radar, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryPreview } from "@/types";

interface InquiryPipelineProps {
  inquiries: InquiryPreview[];
}

function priorityVariant(priority: InquiryPreview["routing"]["priority"]) {
  if (priority === "high") return "warning";
  if (priority === "medium") return "accent";
  return "neutral";
}

export function InquiryPipeline({ inquiries }: InquiryPipelineProps) {
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
              Preview how new inbound opportunities are being qualified, routed, and prepared for
              discovery.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            {inquiries.length} active inquiries
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        {inquiries.map((inquiry, index) => (
          <Reveal key={inquiry.id} delay={index * 0.08}>
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
                    {inquiry.contact} | {inquiry.region}
                  </p>
                </div>
                <StatusBadge variant={priorityVariant(inquiry.routing.priority)}>
                  {inquiry.routing.priority}
                </StatusBadge>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {inquiry.services.map((service) => (
                  <StatusBadge key={`${inquiry.id}-${service}`} variant="accent">
                    {service}
                  </StatusBadge>
                ))}
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
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Notes
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {inquiry.notes}
                </p>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Open inquiry brief
                <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

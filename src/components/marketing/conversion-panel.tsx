"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Download, FileText } from "lucide-react";
import { readStoredAttribution, trackEvent } from "@/lib/analytics/events";
import { siteSettings } from "@/lib/site/config";

interface ConversionPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
  note?: string;
  location?: string;
}

export function ConversionPanel({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref = "/api/capability-deck",
  secondaryLabel = "Download capability deck",
  tertiaryHref = siteSettings.discoveryCallHref,
  tertiaryLabel = "Book discovery call",
  note,
  location = "shared",
}: ConversionPanelProps) {
  return (
    <section className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-10 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            <FileText className="h-4 w-4 text-[var(--color-accent)]" />
            {eyebrow}
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
            {description}
          </p>
          {note && (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              {note}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              onClick={() =>
                trackEvent({
                  name: "cta_click",
                  path: typeof window !== "undefined" ? window.location.pathname : primaryHref,
                  label: primaryLabel,
                  location,
                  intent: "proposal",
                  attribution: readStoredAttribution(),
                })
              }
              className="group inline-flex items-center justify-center gap-2 border border-[var(--color-text)] px-6 py-4 text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={secondaryHref}
              onClick={() =>
                trackEvent({
                  name: "capability_deck_download",
                  path: typeof window !== "undefined" ? window.location.pathname : secondaryHref,
                  label: secondaryLabel,
                  location,
                  intent: "capability-deck",
                  attribution: readStoredAttribution(),
                })
              }
              className="group inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-6 py-4 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
            >
              {secondaryLabel}
              <Download className="h-4 w-4 text-[var(--color-accent)] transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-4 sm:justify-end">
            <a
              href={tertiaryHref}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent({
                  name: "discovery_call_click",
                  path: typeof window !== "undefined" ? window.location.pathname : tertiaryHref,
                  label: tertiaryLabel,
                  location,
                  intent: "discovery-call",
                  attribution: readStoredAttribution(),
                })
              }
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
            >
              <CalendarClock className="h-4 w-4 text-[var(--color-accent)]" />
              {tertiaryLabel}
            </a>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
              Scheduling-ready CTA for live scoping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

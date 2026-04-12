import Link from "next/link";
import { ArrowUpRight, CreditCard, FileText, ShieldCheck, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteSettings } from "@/lib/site/config";
import type { BillingEventPreview } from "@/types";

interface RevenueOperationsProps {
  events: BillingEventPreview[];
  stripeConfigured: boolean;
  portalConfigured: boolean;
}

function formatTimestamp(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
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

function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== "number" || !currency) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

function statusVariant(status: BillingEventPreview["status"]) {
  if (status === "paid" || status === "active") {
    return "success";
  }

  if (status === "failed" || status === "canceled") {
    return "warning";
  }

  return "neutral";
}

export function RevenueOperations({
  events,
  stripeConfigured,
  portalConfigured,
}: RevenueOperationsProps) {
  const visibleEvents = events.slice(0, 6);
  const paidEvents = events.filter((event) => event.status === "paid").length;
  const failedEvents = events.filter((event) => event.status === "failed").length;

  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Revenue operations
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Billing readiness, retainer programs, and webhook visibility
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              This commerce layer turns Muse into a subscription-ready studio platform with optional
              Stripe checkout, downloadable engagement briefs, and an auditable billing event trail.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant={stripeConfigured ? "success" : "warning"}>
              {stripeConfigured ? "Stripe enabled" : "Stripe not configured"}
            </StatusBadge>
            <StatusBadge variant={portalConfigured ? "success" : "neutral"}>
              {portalConfigured ? "Portal ready" : "Portal optional"}
            </StatusBadge>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal delay={0.04}>
          <div className="h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              <Wallet className="h-4 w-4 text-[var(--color-accent)]" />
              Billing readiness
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Plans offered
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                  {siteSettings.retainerPlans.length}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Discovery, launch, and embedded delivery models aligned to the service catalog.
                </p>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Paid events
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">{paidEvents}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Successful invoice or subscription events visible in the billing trail.
                </p>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                  Attention needed
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">{failedEvents}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Failed or risky billing events that should trigger finance follow-up.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {siteSettings.retainerPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        {plan.cadence}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                        {plan.name}
                      </h3>
                    </div>
                    <StatusBadge variant="accent">{plan.priceFrom}</StatusBadge>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {plan.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/api/billing/retainer-brief?plan=${plan.id}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <FileText className="h-4 w-4 text-[var(--color-accent)]" />
                      Download brief
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                Operations notes
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Webhooks persist billing events into Supabase, Docker remains the parity build
                target, and Cloudflare should sit in front of Vercel only for DNS, WAF, and cache
                policy control rather than duplicated full-page caching.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/api/billing/retainer-brief?plan=embedded-partnership"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Engagement brief
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                </Link>
                <Link
                  href="https://dashboard.stripe.com/test/logs"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Stripe logs
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              <CreditCard className="h-4 w-4 text-[var(--color-accent)]" />
              Recent billing events
            </div>

            {visibleEvents.length > 0 ? (
              <div className="mt-6 space-y-4">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge variant={statusVariant(event.status)}>{event.status}</StatusBadge>
                          <StatusBadge>{event.source}</StatusBadge>
                          {event.planId ? <StatusBadge variant="accent">{event.planId}</StatusBadge> : null}
                        </div>
                        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                          {event.label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {event.detail}
                        </p>
                      </div>
                      <StatusBadge>{formatTimestamp(event.createdAt)}</StatusBadge>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                      {event.customer ? <span>{event.customer}</span> : null}
                      {event.customer ? <span>/</span> : null}
                      <span>{event.type}</span>
                      {event.subscriptionId ? <span>/ {event.subscriptionId}</span> : null}
                      {formatAmount(event.amount, event.currency) ? (
                        <span>/ {formatAmount(event.amount, event.currency)}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
                No billing activity has been recorded yet. Once Stripe is configured and the
                webhook is connected, invoices and subscription events will appear here.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

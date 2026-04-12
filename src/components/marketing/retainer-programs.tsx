"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Download, LoaderCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { RetainerPlan } from "@/types";

interface RetainerProgramsProps {
  plans: RetainerPlan[];
  checkoutEnabled: boolean;
}

export function RetainerPrograms({ plans, checkoutEnabled }: RetainerProgramsProps) {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  async function startCheckout(planId: RetainerPlan["id"]) {
    if (!checkoutEnabled) {
      window.location.href = `/contact?intent=retainer&plan=${encodeURIComponent(planId)}`;
      return;
    }

    setActivePlan(planId);
    setMessage("");

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await response.json()) as { error?: string; url?: string; mode?: string };

      if (!response.ok || !data.url) {
        setMessage(data.error ?? "Unable to start billing checkout right now.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setMessage("Unable to start billing checkout right now.");
    } finally {
      setActivePlan(null);
    }
  }

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-2">
        <StatusBadge variant={checkoutEnabled ? "success" : "warning"}>
          {checkoutEnabled ? "Stripe checkout enabled" : "Sales-assisted fallback"}
        </StatusBadge>
        <StatusBadge>{plans.length} retainer programs</StatusBadge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isActive = activePlan === plan.id;

          return (
            <div
              key={plan.id}
              className="flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    {plan.cadence}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                </div>
                <StatusBadge variant="accent">{plan.priceFrom}</StatusBadge>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {plan.summary}
              </p>

              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                Best for
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{plan.bestFor}</p>

              <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5">
                {plan.highlights.map((highlight) => (
                  <div
                    key={`${plan.id}-${highlight}`}
                    className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-muted)]"
                  >
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => void startCheckout(plan.id)}
                  disabled={isActive}
                  className="inline-flex items-center justify-center gap-2 border border-[var(--color-text)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isActive ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Starting
                    </>
                  ) : (
                    <>
                      {plan.ctaLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <Link
                  href={`/api/billing/retainer-brief?plan=${plan.id}`}
                  className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                >
                  <Download className="h-4 w-4 text-[var(--color-accent)]" />
                  Download brief
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {message ? (
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}

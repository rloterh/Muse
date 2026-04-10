"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { moderationSummary, siteSettings } from "@/lib/site/config";
import { canAccessRole, useViewerStore } from "@/stores/viewer-store";

const summary = moderationSummary(siteSettings.moderationQueue);

export default function AdminPage() {
  const viewer = useViewerStore((state) => state.viewer);

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Moderation center
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Admin visibility for content,{" "}
              <span className="italic text-[var(--color-accent)]">quality</span>, and pipeline
              health
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
              This Phase 1 surface establishes the operational layer Muse was missing: role-aware
              summaries, moderation tasks, and a destination for future RBAC, inquiries, publishing
              controls, and analytics.
            </p>
          </Reveal>

          {!canAccessRole(viewer, "editor") ? (
            <div className="mt-16 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Access required
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
                Sign in with an editor or admin preview role
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                The moderation center is intentionally hidden for guest and client roles. Use
                preview access to validate the shell now, then replace it with real Supabase-backed
                enforcement in a later phase.
              </p>
              <Link
                href="/auth"
                className="group mt-8 inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
              >
                Open preview access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-16 grid gap-4 lg:grid-cols-3">
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Total queue
                  </p>
                  <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                    {summary.total}
                  </p>
                </div>
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Urgent review
                  </p>
                  <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[var(--color-accent)]">
                    {summary.urgent}
                  </p>
                </div>
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Scheduled items
                  </p>
                  <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                    {summary.scheduled}
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {siteSettings.moderationQueue.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className="group border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-colors hover:border-[var(--color-accent)]/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex items-center gap-2 text-[var(--color-text-dim)]">
                        <ShieldAlert className="h-4 w-4 text-[var(--color-accent)]" />
                        <span className="text-[10px] uppercase tracking-[0.24em]">
                          {task.kind.replace("-", " ")}
                        </span>
                      </div>
                      <StatusBadge
                        variant={
                          task.priority === "high"
                            ? "warning"
                            : task.priority === "medium"
                              ? "accent"
                              : "neutral"
                        }
                      >
                        {task.priority}
                      </StatusBadge>
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                      {task.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {task.description}
                    </p>
                    <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                      <StatusBadge>{task.status}</StatusBadge>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

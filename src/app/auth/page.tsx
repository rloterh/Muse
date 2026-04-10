"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { demoSessions } from "@/lib/site/config";
import { useViewerStore } from "@/stores/viewer-store";
import type { ViewerRole } from "@/types";

const roleOrder: Exclude<ViewerRole, "guest">[] = ["client", "editor", "admin"];

export default function AuthPage() {
  const router = useRouter();
  const signInAs = useViewerStore((state) => state.signInAs);
  const viewer = useViewerStore((state) => state.viewer);

  function handleSignIn(role: Exclude<ViewerRole, "guest">) {
    signInAs(role);
    router.push(role === "client" ? "/work" : "/admin");
  }

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Preview access
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Role-aware access for the{" "}
              <span className="italic text-[var(--color-accent)]">platform shell</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
              Phase 1 introduces a production-minded auth surface with preview roles for client,
              editor, and admin workflows. This is intentionally structured to map to real Supabase
              auth in a later phase without reworking the UI shell.
            </p>
          </Reveal>

          {viewer && (
            <div className="mt-10 inline-flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4">
              <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-sm text-[var(--color-text-muted)]">
                Current preview session:{" "}
                <span className="text-[var(--color-text)]">{viewer.name}</span>
              </p>
              <StatusBadge variant="accent">{viewer.role}</StatusBadge>
            </div>
          )}

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {roleOrder.map((role, index) => {
              const session = demoSessions[role];

              return (
                <Reveal key={role} delay={index * 0.1}>
                  <div className="flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                          {session.title}
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                          {session.name}
                        </h2>
                      </div>
                      <StatusBadge variant={role === "admin" ? "accent" : "neutral"}>
                        {role}
                      </StatusBadge>
                    </div>

                    <p className="mt-4 text-sm text-[var(--color-text-muted)]">{session.email}</p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {session.permissions.map((permission) => (
                        <StatusBadge key={permission}>
                          {permission.replaceAll("-", " ")}
                        </StatusBadge>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSignIn(role)}
                      className="group mt-10 inline-flex items-center justify-between border border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
                        Continue as {role}
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

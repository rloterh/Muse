"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { moderationSummary, siteSettings } from "@/lib/site/config";
import { canAccessRole, useViewerStore } from "@/stores/viewer-store";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";

export function AuthMenu({ className }: { className?: string }) {
  const router = useRouter();
  const viewer = useViewerStore((state) => state.viewer);
  const setViewer = useViewerStore((state) => state.setViewer);
  const hasHydrated = useViewerStore((state) => state.hasHydrated);
  const accountMenuOpen = useViewerStore((state) => state.accountMenuOpen);
  const setAccountMenuOpen = useViewerStore((state) => state.setAccountMenuOpen);
  const menuRef = useRef<HTMLDivElement>(null);
  const [signingOut, setSigningOut] = useState(false);

  const summary = useMemo(() => moderationSummary(siteSettings.moderationQueue), []);

  useEffect(() => {
    if (!accountMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen, setAccountMenuOpen]);

  if (!hasHydrated) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="inline-flex min-h-10 min-w-[132px] items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
          Loading session
        </div>
      </div>
    );
  }

  if (!viewer) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Sign in
        </Link>
      </div>
    );
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      setViewer(null);
      setAccountMenuOpen(false);
      router.push("/auth");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
        className="inline-flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 py-2 text-left backdrop-blur transition-colors hover:border-[var(--color-accent)]/30"
        aria-expanded={accountMenuOpen}
        aria-controls="auth-menu-panel"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            {viewer.role}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{viewer.name}</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-text-dim)] transition-transform",
            accountMenuOpen && "rotate-180"
          )}
        />
      </button>

      {accountMenuOpen && (
        <div
          id="auth-menu-panel"
          className="absolute right-0 top-[calc(100%+12px)] z-[60] w-[320px] border border-[var(--color-border)] bg-[var(--color-bg)]/95 p-5 shadow-[0_32px_80px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
            <div>
              <p className="font-display text-xl font-bold tracking-tight">{viewer.name}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {viewer.title}
                {viewer.company ? ` | ${viewer.company}` : ""}
              </p>
              <p className="mt-2 text-xs text-[var(--color-text-dim)]">{viewer.email}</p>
            </div>
            <StatusBadge variant={viewer.role === "admin" ? "accent" : "neutral"}>
              {viewer.role}
            </StatusBadge>
          </div>

          <div className="mt-4 space-y-3">
            <Link
              href="/auth"
              className="flex items-center justify-between border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
              onClick={() => setAccountMenuOpen(false)}
            >
              Account access
              <StatusBadge variant="accent">Secure</StatusBadge>
            </Link>

            {canAccessRole(viewer, "editor") && (
              <Link
                href="/admin"
                className="flex items-center justify-between border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                onClick={() => setAccountMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                  Moderation center
                </span>
                <span className="text-xs text-[var(--color-text-dim)]">
                  {summary.urgent} urgent / {summary.total} total
                </span>
              </Link>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-text-dim)]">
              {siteSettings.brandName} secure session
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              {signingOut ? "Signing out" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

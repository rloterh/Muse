"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { viewerRoleDetails } from "@/lib/auth/roles";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { useViewerStore } from "@/stores/viewer-store";
import type { ViewerRole, ViewerSession } from "@/types";

const roleOrder: Exclude<ViewerRole, "guest">[] = ["client", "editor", "admin"];
const authConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const reasonCopy: Record<string, string> = {
  "insufficient-role":
    "Your account is signed in, but it does not have permission to open the moderation center.",
  "not-configured":
    "Supabase auth is not configured in this environment yet. Add the public Supabase env vars to enable sign-in.",
  "password-updated":
    "Your password has been updated. Sign in with the new credentials to continue.",
  "auth-confirm-failed":
    "The invite or recovery link could not be validated. Request a fresh one and try again.",
};

interface AuthPageClientProps {
  redirectTo?: string;
  reason?: string;
}

export function AuthPageClient({ redirectTo, reason }: AuthPageClientProps) {
  const router = useRouter();
  const viewer = useViewerStore((state) => state.viewer);
  const hasHydrated = useViewerStore((state) => state.hasHydrated);
  const setViewer = useViewerStore((state) => state.setViewer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(reason ? reasonCopy[reason] ?? null : null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!authConfigured) {
      setError(reasonCopy["not-configured"]);
      return;
    }

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, redirectTo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to sign in.");
        setSubmitting(false);
        return;
      }

      setViewer(data.viewer as ViewerSession);
      router.push(data.redirectTo ?? "/work");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  async function handleSignOut() {
    setSubmitting(true);

    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      setViewer(null);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordReset(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResetMessage(null);

    const targetEmail = resetEmail.trim() || email.trim();

    if (!targetEmail) {
      setError("Enter your email address to receive a password reset link.");
      return;
    }

    setResetting(true);

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to send a reset link.");
        setResetting(false);
        return;
      }

      setResetMessage("Recovery email sent. Check your inbox for the secure password link.");
      setResetEmail("");
    } catch {
      setError("Network error. Please try again.");
    }

    setResetting(false);
  }

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Secure account access
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Real authentication for the{" "}
              <span className="italic text-[var(--color-accent)]">operations shell</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
              Supabase-backed sessions now replace the old preview-only auth shell. Sign in with a
              real account to access workspaces, moderation, and account-aware navigation.
            </p>
          </Reveal>

          {hasHydrated && viewer && (
            <div className="mt-10 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Signed in as <span className="text-[var(--color-text)]">{viewer.name}</span>
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                    {viewer.role}
                    {viewer.company ? ` | ${viewer.company}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={viewer.role === "client" ? "/work" : "/admin"}
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                >
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)] disabled:opacity-60"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Reveal>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Sign in
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                      Access your Muse workspace
                    </h2>
                  </div>
                  <StatusBadge variant={authConfigured ? "accent" : "warning"}>
                    {authConfigured ? "Supabase live" : "Setup required"}
                  </StatusBadge>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Use the email and password issued to your account. Your role determines whether
                  you land in the work library or the moderation workspace.
                </p>

                {error && (
                  <div className="mt-8 flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm leading-relaxed text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                  <div>
                    <label
                      htmlFor="auth-email"
                      className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
                    >
                      Email
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
                    >
                      Password
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Your password"
                      className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !authConfigured}
                    className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" />
                    {submitting ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <div className="mt-10 border-t border-[var(--color-border)] pt-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        Password reset
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                        Request a secure recovery link
                      </h3>
                    </div>
                    <StatusBadge>Recovery</StatusBadge>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Existing users can reset their password without admin intervention. Recovery
                    links land on the in-app password setup screen.
                  </p>

                  {resetMessage && (
                    <div className="mt-6 flex items-start gap-3 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <p className="text-sm leading-relaxed text-emerald-200">{resetMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handlePasswordReset} className="mt-6 space-y-6">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
                      >
                        Recovery email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={(event) => setResetEmail(event.target.value)}
                        placeholder="Use your account email"
                        className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resetting || !authConfigured}
                      className="inline-flex items-center gap-3 border border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <KeyRound className="h-4 w-4 text-[var(--color-accent)]" />
                      {resetting ? "Sending reset link..." : "Send reset link"}
                    </button>
                  </form>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4">
                {roleOrder.map((role) => {
                  const details = viewerRoleDetails[role];

                  return (
                    <div
                      key={role}
                      className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                            {details.eyebrow}
                          </p>
                          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                            {details.title}
                          </h3>
                        </div>
                        <StatusBadge variant={role === "admin" ? "accent" : "neutral"}>
                          {role}
                        </StatusBadge>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {details.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {details.permissions.map((permission) => (
                          <StatusBadge key={permission}>
                            {permission.replaceAll("-", " ")}
                          </StatusBadge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

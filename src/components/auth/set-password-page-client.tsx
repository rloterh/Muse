"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { validatePasswordConfirmation } from "@/lib/auth/passwords";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Reveal } from "@/components/ui/reveal";

export function SetPasswordPageClient() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      setHasSession(Boolean(session));
      setCheckingSession(false);
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validatePasswordConfirmation(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Unable to update the password. Please request a fresh link.");
      setSubmitting(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting to your workspace...");
    setSubmitting(false);

    setTimeout(() => {
      router.push("/auth?reason=password-updated");
      router.refresh();
    }, 1200);
  }

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Secure password setup
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Set a new password for your{" "}
              <span className="italic text-[var(--color-accent)]">Muse account</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
              Use the link from your invite or recovery email to arrive here, then set a fresh
              password to continue into the platform.
            </p>
          </Reveal>

          <div className="mt-16 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 lg:p-10">
            {checkingSession ? (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Verifying access
                </p>
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  Checking your secure recovery session.
                </p>
              </div>
            ) : !hasSession ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-sm leading-relaxed text-red-300">
                    This password setup link is missing or has expired. Request a new recovery link
                    or ask an admin to resend your invite.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                >
                  Return to auth
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Recovery session confirmed. Set a password with at least 12 characters.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm leading-relaxed text-red-300">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="flex items-start gap-3 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-relaxed text-emerald-200">{message}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
                  >
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Use a strong password"
                    className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat the password"
                    className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LockKeyhole className="h-4 w-4" />
                  {submitting ? "Updating password..." : "Set password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

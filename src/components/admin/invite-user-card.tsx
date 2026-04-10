"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const roleOptions = [
  { value: "client", label: "Client" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
] as const;

export function InviteUserCard() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    title: "",
    company: "Muse",
    role: "editor",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.email.trim() || !form.fullName.trim() || !form.title.trim()) {
      setError("Email, full name, and title are required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to send the invite.");
        setSubmitting(false);
        return;
      }

      setSuccess(data.message ?? "Invite sent.");
      setForm({
        email: "",
        fullName: "",
        title: "",
        company: "Muse",
        role: "editor",
      });
    } catch {
      setError("Network error. Please try again.");
    }

    setSubmitting(false);
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
            Onboarding
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Invite a new account
          </h2>
        </div>
        <StatusBadge variant="accent">Admin only</StatusBadge>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        Send an invite or password setup email without relying on local seed scripts. Existing
        accounts receive a fresh setup link, and new accounts are invited into the correct role.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm leading-relaxed text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-start gap-3 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
          <p className="text-sm leading-relaxed text-emerald-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label
            htmlFor="invite-email"
            className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
          >
            Email
          </label>
          <input
            id="invite-email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="new.user@company.com"
            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="invite-full-name"
            className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
          >
            Full name
          </label>
          <input
            id="invite-full-name"
            type="text"
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            placeholder="Alex Morgan"
            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="invite-title"
            className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
          >
            Title
          </label>
          <input
            id="invite-title"
            type="text"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Content Strategist"
            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="invite-company"
            className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
          >
            Company
          </label>
          <input
            id="invite-company"
            type="text"
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
            placeholder="Muse"
            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="invite-role"
            className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]"
          >
            Role
          </label>
          <select
            id="invite-role"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[var(--color-bg)]">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Sending invite..." : "Send invite"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, CheckCircle2, Radar, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { Reveal } from "@/components/ui/reveal";
import {
  budgetRanges,
  projectFocusOptions,
  referralSourceOptions,
  serviceOptions,
  siteSettings,
  timelineOptions,
} from "@/lib/site/config";
import { cn } from "@/lib/utils/cn";
import type { InquiryRouting } from "@/types";

interface InquiryResponse {
  status: string;
  routing: InquiryRouting;
}

const initialForm = {
  name: "",
  email: "",
  company: "",
  website: "",
  region: "",
  budget: "",
  timeline: "",
  projectFocus: "",
  referralSource: "",
  services: [] as string[],
  goals: "",
  message: "",
  consent: false,
  companyField: "",
};

function chipClass(active: boolean) {
  return active
    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]";
}

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<InquiryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const intent = searchParams.get("intent");
    const requestedService = searchParams.get("service");

    if (!intent && !requestedService) return;

    setForm((prev) => {
      const nextServices =
        requestedService && serviceOptions.includes(requestedService)
          ? prev.services.includes(requestedService)
            ? prev.services
            : [...prev.services, requestedService]
          : prev.services;

      return {
        ...prev,
        projectFocus:
          intent === "proposal" && !prev.projectFocus ? "Website redesign" : prev.projectFocus,
        referralSource:
          intent === "proposal" && !prev.referralSource ? "Other" : prev.referralSource,
        goals:
          intent === "proposal" && !prev.goals
            ? "We would like a proposal-oriented response with likely scope, working model, and recommended next step."
            : prev.goals,
        services: nextServices,
      };
    });
  }, [searchParams]);

  function toggleService(service: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!form.consent) {
      setError("Please confirm consent before submitting.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        setSending(false);
        return;
      }

      setInquiryResult(data.inquiry ?? null);
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    }

    setSending(false);
  }

  return (
    <>
      <Navigation />

      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Start a conversation
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Turn a creative brief into a{" "}
              <span className="italic text-[var(--color-accent)]">qualified engagement</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)]">
              This intake is designed to gather enough strategic and operational context for routing,
              discovery planning, and a faster first response.
            </p>
            {searchParams.get("intent") === "proposal" && (
              <div className="mt-8 inline-flex items-center gap-3 border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3 text-sm text-[var(--color-text-muted)]">
                <Radar className="h-4 w-4 text-[var(--color-accent)]" />
                Proposal mode enabled. We&apos;ll route this as a scope-and-next-step inquiry.
              </div>
            )}
          </Reveal>

          <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Reveal>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 lg:p-10"
                  >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[var(--color-accent)]">
                      <Send className="h-6 w-6 text-[var(--color-accent)]" />
                    </div>
                    <h2 className="font-display text-3xl font-bold">Inquiry captured</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                      The brief has been routed for review. We typically respond within one working
                      day with the right next step.
                    </p>

                    {inquiryResult && (
                      <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                            Status
                          </p>
                          <p className="mt-3 text-sm text-[var(--color-text)]">
                            {inquiryResult.status}
                          </p>
                        </div>
                        <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                            Routing team
                          </p>
                          <p className="mt-3 text-sm text-[var(--color-text)]">
                            {inquiryResult.routing.team}
                          </p>
                        </div>
                        <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                            Fit
                          </p>
                          <p className="mt-3 text-sm text-[var(--color-text)]">
                            {inquiryResult.routing.fit}
                          </p>
                        </div>
                      </div>
                    )}

                    {inquiryResult && (
                      <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                          <Radar className="h-4 w-4 text-[var(--color-accent)]" />
                          Recommended next step
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {inquiryResult.routing.nextStep}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setInquiryResult(null);
                        setForm(initialForm);
                      }}
                      className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                    >
                      Start another inquiry
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-10">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-sm text-red-400">{error}</p>
                      </motion.div>
                    )}

                    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:p-8">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" />
                        Contact and business context
                      </div>

                      <div className="mt-8 grid gap-8 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={80}
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            placeholder="Your full name"
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            maxLength={160}
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            placeholder="you@company.com"
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Company
                          </label>
                          <input
                            type="text"
                            maxLength={120}
                            value={form.company}
                            onChange={(event) => setForm({ ...form, company: event.target.value })}
                            placeholder="Your company name"
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Website
                          </label>
                          <input
                            type="url"
                            value={form.website}
                            onChange={(event) => setForm({ ...form, website: event.target.value })}
                            placeholder="https://company.com"
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Region
                          </label>
                          <input
                            type="text"
                            maxLength={120}
                            value={form.region}
                            onChange={(event) => setForm({ ...form, region: event.target.value })}
                            placeholder="City, country"
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>
                        <div className="hidden" aria-hidden="true">
                          <label>
                            Company field
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={form.companyField}
                              onChange={(event) =>
                                setForm({ ...form, companyField: event.target.value })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:p-8">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        <Radar className="h-4 w-4 text-[var(--color-accent)]" />
                        Scope and routing signals
                      </div>

                      <div className="mt-8">
                        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                          Services interested in
                        </label>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {serviceOptions.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => toggleService(service)}
                              className={cn(
                                "border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all",
                                chipClass(form.services.includes(service))
                              )}
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 grid gap-8 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Budget range
                          </label>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {budgetRanges.map((budget) => (
                              <button
                                key={budget}
                                type="button"
                                onClick={() => setForm({ ...form, budget })}
                                className={cn(
                                  "border px-4 py-2 text-xs tracking-wider transition-all",
                                  chipClass(form.budget === budget)
                                )}
                              >
                                {budget}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Timeline
                          </label>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {timelineOptions.map((timeline) => (
                              <button
                                key={timeline}
                                type="button"
                                onClick={() => setForm({ ...form, timeline })}
                                className={cn(
                                  "border px-4 py-2 text-xs tracking-wider transition-all",
                                  chipClass(form.timeline === timeline)
                                )}
                              >
                                {timeline}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-8 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Project focus
                          </label>
                          <select
                            value={form.projectFocus}
                            onChange={(event) =>
                              setForm({ ...form, projectFocus: event.target.value })
                            }
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                          >
                            <option value="">Select focus</option>
                            {projectFocusOptions.map((option) => (
                              <option key={option} value={option} className="bg-[var(--color-bg)]">
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            How did you hear about us?
                          </label>
                          <select
                            value={form.referralSource}
                            onChange={(event) =>
                              setForm({ ...form, referralSource: event.target.value })
                            }
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                          >
                            <option value="">Select source</option>
                            {referralSourceOptions.map((option) => (
                              <option key={option} value={option} className="bg-[var(--color-bg)]">
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:p-8">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" />
                        Project brief
                      </div>

                      <div className="mt-8 space-y-8">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            What does success look like?
                          </label>
                          <textarea
                            rows={4}
                            maxLength={1500}
                            value={form.goals}
                            onChange={(event) => setForm({ ...form, goals: event.target.value })}
                            placeholder="Key outcomes, milestones, or business goals you want this work to unlock."
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            Additional context
                          </label>
                          <textarea
                            rows={5}
                            maxLength={4000}
                            value={form.message}
                            onChange={(event) => setForm({ ...form, message: event.target.value })}
                            placeholder="Stakeholders, constraints, existing platform notes, or any context that will help us prepare for the right first conversation."
                            className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                          />
                        </div>

                        <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          <input
                            type="checkbox"
                            checked={form.consent}
                            onChange={(event) =>
                              setForm({ ...form, consent: event.target.checked })
                            }
                            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                          />
                          <span>
                            I consent to Muse reviewing this inquiry and contacting me about the
                            project request and next steps.
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:opacity-50"
                    >
                      {sending ? "Routing inquiry..." : "Send inquiry"}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="space-y-8 lg:sticky lg:top-32">
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    What happens next
                  </p>
                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">1. Qualification</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        We review service fit, timeline pressure, and strategic complexity.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">2. Routing</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        The inquiry is aligned to the best team owner for discovery and response.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">3. Follow-up</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        You receive a response with the clearest next step, not a generic thank-you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Contact
                  </p>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="mt-4 block text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {siteSettings.contactEmail}
                  </a>
                  <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    {siteSettings.contactPhone}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-dim)]">
                    {siteSettings.offices.join(" | ")}
                  </p>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Best-fit engagements
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      Strategic brand work
                    </span>
                    <span className="border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      High-craft marketing sites
                    </span>
                    <span className="border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      Product and systems design
                    </span>
                    <span className="border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      Motion and immersive storytelling
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

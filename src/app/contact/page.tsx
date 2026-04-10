"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, Send } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { Reveal } from "@/components/ui/reveal";
import { budgetRanges, serviceOptions, siteSettings } from "@/lib/site/config";
import { cn } from "@/lib/utils/cn";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    services: [] as string[],
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              Get in touch
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Let&apos;s create something{" "}
              <span className="italic text-[var(--color-accent)]">remarkable</span>
            </h1>
          </Reveal>

          <div className="mt-20 grid gap-20 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center"
                  >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[var(--color-accent)]">
                      <Send className="h-6 w-6 text-[var(--color-accent)]" />
                    </div>
                    <h2 className="font-display text-3xl font-bold">Message sent</h2>
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setForm({
                          name: "",
                          email: "",
                          company: "",
                          budget: "",
                          services: [],
                          message: "",
                        });
                      }}
                      className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] hover:underline"
                    >
                      Send another
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

                    <div className="grid gap-8 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
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
                          value={form.email}
                          onChange={(event) => setForm({ ...form, email: event.target.value })}
                          placeholder="you@company.com"
                          className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                        Company
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(event) => setForm({ ...form, company: event.target.value })}
                        placeholder="Your company name"
                        className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                      />
                    </div>

                    <div>
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
                              form.services.includes(service)
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                            )}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>

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
                              form.budget === budget
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                            )}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(event) => setForm({ ...form, message: event.target.value })}
                        placeholder="Tell us about your project..."
                        className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send message"}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.2} className="lg:col-span-2">
              <div className="space-y-12 lg:sticky lg:top-32">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="mt-2 block text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Phone
                  </p>
                  <p className="mt-2 text-lg text-[var(--color-text-muted)]">
                    {siteSettings.contactPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Location
                  </p>
                  {siteSettings.offices.map((office, index) => (
                    <p
                      key={office}
                      className={cn(
                        index === 0
                          ? "mt-2 text-lg text-[var(--color-text-muted)]"
                          : "text-sm text-[var(--color-text-dim)]"
                      )}
                    >
                      {index === 0 ? office : `& ${office}`}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Follow us
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {siteSettings.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {social.label}
                      </a>
                    ))}
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowUpRight, AlertCircle } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils/cn";

const budgetRanges = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];
const serviceOptions = ["Brand Strategy", "Visual Identity", "Digital Design", "Web Development", "Motion & 3D", "Product Design"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", services: [] as string[], message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleService(s: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s) ? prev.services.filter((x) => x !== s) : [...prev.services, s],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
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
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Get in touch</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Let&apos;s create something{" "}
              <span className="italic text-[var(--color-accent)]">remarkable</span>
            </h1>
          </Reveal>

          <div className="mt-20 grid gap-20 lg:grid-cols-5">
            {/* Form */}
            <Reveal className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[var(--color-accent)]">
                      <Send className="h-6 w-6 text-[var(--color-accent)]" />
                    </div>
                    <h2 className="font-display text-3xl font-bold">Message sent</h2>
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", budget: "", services: [], message: "" }); }}
                      className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] hover:underline">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-10">
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-sm text-red-400">{error}</p>
                      </motion.div>
                    )}

                    <div className="grid gap-8 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name" className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Email *</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@company.com" className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Company</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Your company name" className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Services interested in</label>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {serviceOptions.map((s) => (
                          <button key={s} type="button" onClick={() => toggleService(s)}
                            className={cn("border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all",
                              form.services.includes(s)
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                            )}>{s}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Budget range</label>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {budgetRanges.map((b) => (
                          <button key={b} type="button" onClick={() => setForm({ ...form, budget: b })}
                            className={cn("border px-4 py-2 text-xs tracking-wider transition-all",
                              form.budget === b
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                            )}>{b}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Message</label>
                      <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your project..." className="mt-3 w-full border-b border-[var(--color-border)] bg-transparent pb-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>

                    <button type="submit" disabled={sending}
                      className="group inline-flex items-center gap-3 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:opacity-50">
                      {sending ? "Sending..." : "Send message"}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>

            {/* Sidebar */}
            <Reveal delay={0.2} className="lg:col-span-2">
              <div className="space-y-12 lg:sticky lg:top-32">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Email</p>
                  <a href="mailto:hello@muse.agency" className="mt-2 block text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]">hello@muse.agency</a>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Phone</p>
                  <p className="mt-2 text-lg text-[var(--color-text-muted)]">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Location</p>
                  <p className="mt-2 text-lg text-[var(--color-text-muted)]">Brooklyn, New York</p>
                  <p className="text-sm text-[var(--color-text-dim)]">& London, UK</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Follow us</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {["Instagram", "Dribbble", "LinkedIn", "Twitter"].map((s) => (
                      <a key={s} href="#" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]">{s}</a>
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

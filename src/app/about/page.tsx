"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";

const team = [
  { name: "Alex Rivera", role: "Founder & Creative Director", initials: "AR" },
  { name: "Maya Chen", role: "Head of Design", initials: "MC" },
  { name: "James Okafor", role: "Lead Developer", initials: "JO" },
  { name: "Sofia Laurent", role: "Strategy Director", initials: "SL" },
  { name: "Kai Tanaka", role: "Motion Designer", initials: "KT" },
  { name: "Zara Patel", role: "Project Manager", initials: "ZP" },
];

const values = [
  { num: "01", title: "Craft over speed", desc: "Every pixel, every interaction, every word is deliberate. We don't ship fast — we ship right." },
  { num: "02", title: "Strategy first", desc: "Beautiful design without purpose is decoration. We start with why before we decide how." },
  { num: "03", title: "Radical honesty", desc: "We tell clients what they need to hear, not what they want. Trust is built on truth." },
  { num: "04", title: "Relentless iteration", desc: "First drafts are starting points. We refine until the work speaks for itself." },
];

const timeline = [
  { year: "2017", event: "Founded in a Brooklyn studio apartment" },
  { year: "2019", event: "First Awwwards Site of the Day" },
  { year: "2020", event: "Expanded to a team of 6" },
  { year: "2022", event: "Opened London satellite office" },
  { year: "2024", event: "CSS Design Awards Agency of the Year" },
  { year: "2025", event: "47 projects delivered, 12 awards" },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="px-8 pb-20 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">About us</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              A small team with{" "}
              <span className="italic text-[var(--color-accent)]">outsized</span>{" "}
              ambition
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              Muse is an independent creative agency specializing in brand strategy,
              digital design, and immersive web experiences. We partner with companies
              who believe design is a competitive advantage — not a cost center.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy image band */}
      <section className="px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="aspect-[21/9] bg-[var(--color-bg-elevated)]">
              <div className="flex h-full items-center justify-center">
                <p className="font-display text-6xl font-bold tracking-tight opacity-5 lg:text-8xl">MUSE</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Our principles</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Values</h2>
          </Reveal>

          <div className="mt-16 space-y-0">
            {values.map((value, i) => (
              <Reveal key={value.num} delay={i * 0.1}>
                <div className="group flex items-start gap-8 border-b border-[var(--color-border)] py-10">
                  <span className="font-display text-xs text-[var(--color-text-dim)]">{value.num}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">{value.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">{value.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-[var(--color-border)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">The people</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Our team</h2>
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-[var(--color-bg-elevated)]">
                    <div className="flex h-full items-center justify-center transition-colors group-hover:bg-[var(--color-bg-surface)]">
                      <span className="font-display text-4xl font-bold text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                        {member.initials}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-base font-bold">{member.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{member.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-[var(--color-border)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Our journey</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Timeline</h2>
          </Reveal>

          <div className="mt-16 space-y-0">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.08}>
                <div className="flex gap-8 border-b border-[var(--color-border)] py-6">
                  <span className="w-16 shrink-0 font-display text-sm font-bold text-[var(--color-accent)]">{item.year}</span>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.event}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

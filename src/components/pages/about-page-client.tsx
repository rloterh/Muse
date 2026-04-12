"use client";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import { SanityImage } from "@/components/ui/sanity-image";
import type { TeamMember } from "@/types";

interface AboutPageClientProps {
  team: TeamMember[];
}

const values = [
  { num: "01", title: "Craft over speed", desc: "Every pixel, every interaction, every word is deliberate. We do not ship fast. We ship right." },
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AboutPageClient({ team }: AboutPageClientProps) {
  return (
    <>
      <Navigation />

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
              who believe design is a competitive advantage and not a cost center.
            </p>
          </Reveal>
        </div>
      </section>

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

      <section className="px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Our principles</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Values</h2>
          </Reveal>

          <div className="mt-16 space-y-0">
            {values.map((value, index) => (
              <Reveal key={value.num} delay={index * 0.1}>
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

      <section className="border-t border-[var(--color-border)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">The people</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Our team</h2>
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {team.map((member) => (
              <StaggerItem key={member._id}>
                <div className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-bg-elevated)]">
                    {member.photo?.asset ? (
                      <SanityImage
                        image={member.photo}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center transition-colors group-hover:bg-[var(--color-bg-surface)]">
                        <span className="font-display text-4xl font-bold text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                          {initials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-base font-bold">{member.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{member.role}</p>
                    {member.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{member.bio}</p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Our journey</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Timeline</h2>
          </Reveal>

          <div className="mt-16 space-y-0">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.08}>
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

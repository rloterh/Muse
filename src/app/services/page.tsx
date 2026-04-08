"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Palette, Code2, Layers, Video, BarChart3, Smartphone } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";

const services = [
  {
    num: "01", title: "Brand Strategy", icon: BarChart3,
    desc: "We uncover what makes your brand unique and build a strategic foundation that guides every creative decision.",
    features: ["Brand positioning", "Competitive analysis", "Audience research", "Messaging framework", "Brand architecture"],
  },
  {
    num: "02", title: "Visual Identity", icon: Palette,
    desc: "Complete identity systems that are distinctive, scalable, and built to last across every touchpoint.",
    features: ["Logo & mark design", "Typography systems", "Color palettes", "Brand guidelines", "Asset libraries"],
  },
  {
    num: "03", title: "Digital Design", icon: Layers,
    desc: "User interfaces and experiences that are intuitive, beautiful, and grounded in real user behavior.",
    features: ["UI/UX design", "Design systems", "Prototyping", "User research", "Accessibility"],
  },
  {
    num: "04", title: "Web Development", icon: Code2,
    desc: "High-performance applications built with modern frameworks, deployed on edge infrastructure.",
    features: ["Next.js / React", "Headless CMS", "E-commerce", "API integrations", "Performance optimization"],
  },
  {
    num: "05", title: "Motion & 3D", icon: Video,
    desc: "Cinematic animations, WebGL experiences, and immersive environments that push the boundaries of the web.",
    features: ["Three.js / WebGL", "GSAP animations", "Video production", "Interactive experiences", "Spatial design"],
  },
  {
    num: "06", title: "Product Design", icon: Smartphone,
    desc: "End-to-end product thinking from concept to launch, for apps and platforms people love to use.",
    features: ["Product strategy", "Interaction design", "Design sprints", "Usability testing", "Launch support"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navigation />

      <section className="px-8 pb-20 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Capabilities</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Everything you need,{" "}
              <span className="italic text-[var(--color-accent)]">nothing</span>{" "}
              you don&apos;t
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              We offer a focused set of services, each executed with depth and precision.
              No fluff, no filler — just the expertise that moves the needle.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 pb-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-0">
            {services.map((service, i) => (
              <Reveal key={service.num} delay={i * 0.08}>
                <div className="group border-b border-[var(--color-border)] py-12 transition-colors hover:border-[var(--color-accent)]/30">
                  <div className="flex items-start gap-8">
                    <span className="mt-1 font-display text-xs text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                      {service.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                            {service.title}
                          </h2>
                          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {service.desc}
                          </p>
                        </div>
                        <service.icon className="mt-2 h-6 w-6 shrink-0 text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]" />
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className="border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-accent)]/20 group-hover:text-[var(--color-text)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">How we work</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Our process</h2>
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {[
              { step: "01", title: "Discover", desc: "Deep research into your brand, audience, and competitive landscape." },
              { step: "02", title: "Define", desc: "Strategic framework and creative direction aligned with business goals." },
              { step: "03", title: "Design", desc: "Iterative design with continuous feedback and collaborative refinement." },
              { step: "04", title: "Deliver", desc: "Production-ready output with documentation and ongoing support." },
            ].map((phase) => (
              <StaggerItem key={phase.step}>
                <div className="border-t border-[var(--color-border)] pt-6">
                  <span className="font-display text-xs font-bold text-[var(--color-accent)]">{phase.step}</span>
                  <h3 className="mt-3 font-display text-xl font-bold">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{phase.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </>
  );
}

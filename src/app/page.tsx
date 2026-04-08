"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, RevealText, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import {
  ParallaxText, HorizontalScroll, Counter, TextSplitReveal, ScrubScale,
} from "@/components/gsap/scroll-animations";

// Lazy load Three.js to avoid SSR issues
const HeroScene = lazy(() =>
  import("@/components/three/hero-scene").then((m) => ({ default: m.HeroScene }))
);

const featuredWork = [
  { title: "Luminary Rebrand", client: "Luminary Health", slug: "luminary", year: 2025, color: "#4A7C6F", category: "Branding" },
  { title: "Prism Dashboard", client: "Prism Analytics", slug: "prism", year: 2025, color: "#6366F1", category: "Product Design" },
  { title: "Vanta Launch", client: "Vanta Security", slug: "vanta", year: 2024, color: "#C8956C", category: "Web Development" },
  { title: "Echo Spatial", client: "Echo Audio", slug: "echo", year: 2024, color: "#DC2626", category: "3D / WebGL" },
  { title: "Meridian OS", client: "Meridian Labs", slug: "meridian", year: 2024, color: "#0EA5E9", category: "Product Design" },
];

const services = [
  { num: "01", title: "Brand Strategy", desc: "Positioning, identity systems, and brand architecture that create lasting impressions." },
  { num: "02", title: "Digital Design", desc: "Interfaces, experiences, and visual systems crafted with obsessive attention to detail." },
  { num: "03", title: "Development", desc: "High-performance web applications built with modern frameworks and best practices." },
  { num: "04", title: "Motion & 3D", desc: "Cinematic animations, WebGL experiences, and immersive digital environments." },
];

export default function HomePage() {
  return (
    <>
      <Navigation />

      {/* ============================================ */}
      {/* HERO — Three.js scene + cinematic text       */}
      {/* ============================================ */}
      <section className="relative flex min-h-screen flex-col justify-end px-8 pb-20 pt-32 lg:px-12">
        <Suspense fallback={
          <div className="absolute inset-0">
            <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/5 blur-[200px]" />
          </div>
        }>
          <HeroScene />
        </Suspense>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-xs font-medium uppercase tracking-[0.4em] text-[var(--color-text-dim)]"
          >
            Creative agency
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-6 max-w-5xl font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[120px]"
          >
            We craft digital
            <br />
            experiences that{" "}
            <span className="italic text-[var(--color-accent)]">move</span>
            <br />
            people
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="mt-10 flex items-end justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
              Strategy, design, and technology for brands that refuse to blend in.
            </p>
            <Link href="/work" className="group hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] md:flex">
              View our work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 24, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-4 w-[1px] bg-[var(--color-text-dim)]" />
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* MARQUEE — scrolling text band                */}
      {/* ============================================ */}
      <Marquee
        text="Strategy Design Development Motion 3D WebGL Branding"
        speed={35}
        className="border-y border-[var(--color-border)] py-5 font-display text-xl font-bold uppercase tracking-[0.2em] text-[var(--color-text-dim)]/30"
      />

      {/* ============================================ */}
      {/* HORIZONTAL SCROLL — featured work reel       */}
      {/* ============================================ */}
      <section className="py-32">
        <div className="px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Selected work</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight lg:text-5xl">Featured projects</h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 pl-8 lg:pl-12">
          <HorizontalScroll>
            {featuredWork.map((project, i) => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="group block w-[70vw] shrink-0 sm:w-[45vw] lg:w-[35vw]">
                <ScrubScale>
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: project.color + "12" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[12rem] font-bold leading-none opacity-[0.04]" style={{ color: project.color }}>
                        {project.title[0]}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[var(--color-bg)] opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-xs text-[var(--color-text-dim)] uppercase tracking-[0.2em]">
                      {project.client} — {project.year}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                      {project.title}
                    </h3>
                  </div>
                </ScrubScale>
              </Link>
            ))}

            {/* View all CTA as last card */}
            <Link href="/work" className="group flex w-[30vw] shrink-0 items-center justify-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-dim)]">See all</p>
                <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-[var(--color-accent)]">
                  Work
                </p>
                <ArrowRight className="mx-auto mt-4 h-5 w-5 text-[var(--color-text-dim)] transition-transform group-hover:translate-x-2 group-hover:text-[var(--color-accent)]" />
              </div>
            </Link>
          </HorizontalScroll>
        </div>
      </section>

      {/* ============================================ */}
      {/* PARALLAX TEXT — about teaser                 */}
      {/* ============================================ */}
      <section className="overflow-hidden px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <ParallaxText speed={0.3}>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Who we are</p>
          </ParallaxText>
          <ParallaxText speed={0.5} className="mt-6">
            <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight lg:text-6xl">
              A small team of strategists, designers, and engineers who believe the best work happens at the{" "}
              <span className="italic text-[var(--color-accent)]">intersection</span> of art and technology.
            </h2>
          </ParallaxText>
          <ParallaxText speed={0.2} className="mt-8">
            <Link href="/about" className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">
              Learn more about us <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </ParallaxText>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICES                                     */}
      {/* ============================================ */}
      <section className="border-t border-[var(--color-border)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">What we do</p>
            <TextSplitReveal text="Services" className="mt-3 font-display text-4xl font-bold tracking-tight lg:text-5xl" />
          </Reveal>

          <div className="mt-16 space-y-0">
            {services.map((service, i) => (
              <Reveal key={service.num} delay={i * 0.1}>
                <div className="group flex items-start gap-8 border-b border-[var(--color-border)] py-10 transition-colors hover:border-[var(--color-accent)]/30">
                  <span className="font-display text-xs text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                    {service.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">{service.desc}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 text-[var(--color-text-dim)] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[var(--color-accent)]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS — animated counters                    */}
      {/* ============================================ */}
      <section className="bg-[var(--color-bg-elevated)] px-8 py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 lg:grid-cols-4">
          {[
            { value: 47, suffix: "", label: "Projects delivered" },
            { value: 12, suffix: "", label: "Industry awards" },
            { value: 8, suffix: "", label: "Years in business" },
            { value: 99, suffix: "%", label: "Client retention" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-5xl font-bold tracking-tight text-[var(--color-accent)] lg:text-6xl"
                />
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* BOTTOM MARQUEE                               */}
      {/* ============================================ */}
      <Marquee
        text="Let's create something extraordinary"
        speed={25}
        separator="  ✦  "
        className="border-y border-[var(--color-border)] py-4 font-display text-sm uppercase tracking-[0.3em] text-[var(--color-text-dim)]/20"
      />

      <Footer />
    </>
  );
}

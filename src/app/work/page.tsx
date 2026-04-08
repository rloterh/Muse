"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";

const projects = [
  { title: "Luminary Rebrand", client: "Luminary Health", slug: "luminary", year: 2025, color: "#4A7C6F", category: "Branding", desc: "Complete visual identity for a wellness platform." },
  { title: "Prism Dashboard", client: "Prism Analytics", slug: "prism", year: 2025, color: "#6366F1", category: "Product", desc: "Data visualization suite for enterprise analytics." },
  { title: "Vanta Launch", client: "Vanta Security", slug: "vanta", year: 2024, color: "#C8956C", category: "Web", desc: "Marketing site and brand launch for cybersecurity startup." },
  { title: "Echo Spatial", client: "Echo Audio", slug: "echo", year: 2024, color: "#DC2626", category: "3D / WebGL", desc: "Immersive audio product experience with spatial sound." },
  { title: "Meridian OS", client: "Meridian Labs", slug: "meridian", year: 2024, color: "#0EA5E9", category: "Product", desc: "Operating system design language and component library." },
  { title: "Terraform Identity", client: "TerraForm Co", slug: "terraform", year: 2023, color: "#8B5CF6", category: "Branding", desc: "Sustainable architecture firm identity and web presence." },
];

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Portfolio</p>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight lg:text-7xl">
              Selected <span className="italic text-[var(--color-accent)]">work</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--color-text-muted)]">
              A curated collection of projects where strategy, design, and technology
              converge to create meaningful impact.
            </p>
          </Reveal>

          <StaggerContainer className="mt-20 grid gap-10 md:grid-cols-2" stagger={0.12}>
            {projects.map((project) => (
              <StaggerItem key={project.slug}>
                <Link href={`/work/${project.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: project.color + "12" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[10rem] font-bold leading-none opacity-[0.06]" style={{ color: project.color }}>
                        {project.title.split(" ")[0][0]}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-dim)]">
                      <span className="uppercase tracking-[0.2em]">{project.client}</span>
                      <span>&middot;</span>
                      <span>{project.year}</span>
                      <span>&middot;</span>
                      <span>{project.category}</span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-3xl">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{project.desc}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <Footer />
    </>
  );
}

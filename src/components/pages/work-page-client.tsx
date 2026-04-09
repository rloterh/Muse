"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import { SanityImage } from "@/components/ui/sanity-image";
import type { CaseStudy } from "@/types";

interface WorkPageClientProps {
  projects: CaseStudy[];
}

export function WorkPageClient({ projects }: WorkPageClientProps) {
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

          {projects.length > 0 ? (
            <StaggerContainer className="mt-20 grid gap-10 md:grid-cols-2" stagger={0.12}>
              {projects.map((project) => (
                <StaggerItem key={project.slug.current}>
                  <Link href={`/work/${project.slug.current}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: `${project.color ?? "#C8956C"}12` }}>
                      {project.coverImage?.asset ? (
                        <SanityImage
                          image={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-[10rem] font-bold leading-none opacity-[0.06]" style={{ color: project.color ?? "#C8956C" }}>
                            {project.title.split(" ")[0][0]}
                          </span>
                        </div>
                      )}
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
                        <span>{project.services?.[0]?.title ?? "Case Study"}</span>
                      </div>
                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-3xl">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{project.excerpt}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="mt-20 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">No case studies published yet.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

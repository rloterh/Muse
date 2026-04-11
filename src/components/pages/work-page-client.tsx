"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { ModerationPanel } from "@/components/admin/moderation-panel";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { SanityImage } from "@/components/ui/sanity-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import type { CaseStudy, ModerationTask } from "@/types";

interface WorkPageClientProps {
  projects: CaseStudy[];
  moderationTasks: ModerationTask[];
}

function statusVariant(status: CaseStudy["status"]) {
  if (status === "review") return "warning";
  if (status === "scheduled") return "accent";
  if (status === "published") return "success";
  return "neutral";
}

function uniqueValues(values: Array<string | undefined>) {
  const filteredValues = values.filter((value): value is string => Boolean(value));
  return [...new Set(filteredValues)].sort((left, right) => left.localeCompare(right));
}

function matchesFilter(current: string | null, value: string | undefined) {
  return !current || current === value;
}

function filterChipClass(active: boolean) {
  return active
    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-text)]"
    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]";
}

export function WorkPageClient({ projects, moderationTasks }: WorkPageClientProps) {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeEngagement, setActiveEngagement] = useState<string | null>(null);

  const sectors = uniqueValues(projects.map((project) => project.sector));
  const engagementTypes = uniqueValues(projects.map((project) => project.engagement));
  const serviceTitles = uniqueValues(projects.flatMap((project) => project.services?.map((service) => service.title) ?? []));

  const filteredProjects = projects.filter((project) => {
    const hasService =
      !activeService ||
      project.services?.some((service) => service.title === activeService);

    return (
      matchesFilter(activeSector, project.sector) &&
      matchesFilter(activeEngagement, project.engagement) &&
      hasService
    );
  });

  const featuredCount = projects.filter((project) => project.featured).length;
  const publishedCount = projects.filter((project) => project.status === "published").length;
  const activeFilterCount = [activeSector, activeService, activeEngagement].filter(Boolean).length;

  function clearFilters() {
    setActiveSector(null);
    setActiveService(null);
    setActiveEngagement(null);
  }

  return (
    <>
      <Navigation />
      <section className="px-8 pb-24 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                  Portfolio
                </p>
                <h1 className="mt-3 font-display text-5xl font-bold tracking-tight lg:text-7xl">
                  Selected <span className="italic text-[var(--color-accent)]">work</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
                  A more strategic view of the portfolio, organized by sector, service, and
                  engagement model so teams can scan the work like a real capability archive.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Case studies
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                    {projects.length}
                  </p>
                </div>
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Featured
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                    {featuredCount}
                  </p>
                </div>
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Published
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                    {publishedCount}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-14 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    <SlidersHorizontal className="h-4 w-4 text-[var(--color-accent)]" />
                    Filter the archive
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Use one or more filters to narrow the portfolio by audience, engagement style,
                    or the type of capability a client is evaluating.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge variant="accent">
                    {filteredProjects.length} visible project{filteredProjects.length === 1 ? "" : "s"}
                  </StatusBadge>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-dim)]">
                    Sector
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => setActiveSector(activeSector === sector ? null : sector)}
                        className={`border px-3 py-2 text-sm transition-colors ${filterChipClass(activeSector === sector)}`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-dim)]">
                    Service
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {serviceTitles.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => setActiveService(activeService === service ? null : service)}
                        className={`border px-3 py-2 text-sm transition-colors ${filterChipClass(activeService === service)}`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-dim)]">
                    Engagement
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {engagementTypes.map((engagement) => (
                      <button
                        key={engagement}
                        type="button"
                        onClick={() =>
                          setActiveEngagement(activeEngagement === engagement ? null : engagement)
                        }
                        className={`border px-3 py-2 text-sm transition-colors ${filterChipClass(activeEngagement === engagement)}`}
                      >
                        {engagement}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {filteredProjects.length > 0 ? (
            <StaggerContainer className="mt-20 grid gap-10 md:grid-cols-2" stagger={0.12}>
              {filteredProjects.map((project) => (
                <StaggerItem key={project.slug.current}>
                  <Link href={`/work/${project.slug.current}`} className="group block">
                    <div
                      className="relative aspect-[4/3] overflow-hidden border border-[var(--color-border)]"
                      style={{ backgroundColor: `${project.color ?? "#C8956C"}12` }}
                    >
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
                          <span
                            className="font-display text-[10rem] font-bold leading-none opacity-[0.06]"
                            style={{ color: project.color ?? "#C8956C" }}
                          >
                            {project.title.split(" ")[0][0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                        <StatusBadge variant={statusVariant(project.status)}>
                          {project.status ?? "preview"}
                        </StatusBadge>
                        {project.featured && <StatusBadge variant="accent">Featured</StatusBadge>}
                      </div>
                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4 text-white/60" />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-dim)]">
                        <span className="uppercase tracking-[0.2em]">{project.client}</span>
                        <span>&middot;</span>
                        <span>{project.year}</span>
                        {project.sector && (
                          <>
                            <span>&middot;</span>
                            <span>{project.sector}</span>
                          </>
                        )}
                        {project.engagement && (
                          <>
                            <span>&middot;</span>
                            <span>{project.engagement}</span>
                          </>
                        )}
                      </div>

                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-3xl">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {project.excerpt}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.services?.map((service) => (
                          <StatusBadge key={`${project.slug.current}-${service._id}`} variant="accent">
                            {service.title}
                          </StatusBadge>
                        ))}
                        {project.deliverables?.slice(0, 2).map((deliverable) => (
                          <StatusBadge key={deliverable}>{deliverable}</StatusBadge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Reveal delay={0.12}>
              <div className="mt-20 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10 text-center">
                <div className="mx-auto flex max-w-xl flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
                    No projects match this exact mix yet
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Try broadening one of the filters to explore adjacent work, sectors, or
                    delivery models from the same portfolio archive.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-8 inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ModerationPanel tasks={moderationTasks} />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ModerationPanel } from "@/components/admin/moderation-panel";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { PortableTextContent } from "@/components/ui/portable-text";
import { Reveal } from "@/components/ui/reveal";
import { SanityGallery, SanityImage } from "@/components/ui/sanity-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { fallbackCaseStudies } from "@/lib/content/fallback-data";
import { resolveCaseStudies, resolveCaseStudyBySlug } from "@/lib/content/resolvers";
import { siteSettings } from "@/lib/site/config";
import { caseStudyMeta } from "@/lib/seo/metadata";
import type { ProjectFact } from "@/types";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

interface SectionLink {
  id: string;
  label: string;
}

function statusVariant(status: string | undefined) {
  if (status === "review") return "warning";
  if (status === "scheduled") return "accent";
  if (status === "published") return "success";
  return "neutral";
}

function buildOverviewFacts(project: Awaited<ReturnType<typeof resolveCaseStudyBySlug>>): ProjectFact[] {
  if (!project) {
    return [];
  }

  if (project.projectFacts?.length) {
    return project.projectFacts;
  }

  return [
    project.timeline
      ? {
          label: "Timeline",
          value: project.timeline,
          detail: "Delivery window from strategic alignment through launch.",
        }
      : null,
    project.teamSize
      ? {
          label: "Team",
          value: project.teamSize,
          detail: "Senior operators embedded across strategy, design, and engineering.",
        }
      : null,
    project.scope
      ? {
          label: "Scope",
          value: project.scope,
          detail: "Cross-functional program designed for narrative clarity and delivery confidence.",
        }
      : null,
    project.engagement
      ? {
          label: "Engagement",
          value: project.engagement,
        }
      : null,
  ].filter((item): item is ProjectFact => Boolean(item));
}

export async function generateStaticParams() {
  const projects = await resolveCaseStudies();
  return projects.map((project) => ({ slug: project.slug.current }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveCaseStudyBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return caseStudyMeta(project.title, project.client, project.excerpt, project.color);
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    resolveCaseStudyBySlug(slug),
    resolveCaseStudies(),
  ]);

  if (!project) {
    notFound();
  }

  const color = project.color ?? "#C8956C";
  const projectServices = project.services ?? [];
  const overviewFacts = buildOverviewFacts(project);
  const contentSections = [
    {
      id: "challenge",
      label: "The challenge",
      value: project.challenge,
      fallback:
        "The client needed a system that felt unmistakably premium while still helping internal teams publish, scale, and measure the work with confidence.",
    },
    {
      id: "approach",
      label: "Our approach",
      value: project.approach,
      fallback:
        "We used a strategy-first process that aligned brand narrative, motion language, and engineering architecture before expanding into implementation.",
    },
  ];

  const sectionLinks: SectionLink[] = [
    { id: "overview", label: "Overview" },
    ...contentSections.map((section) => ({ id: section.id, label: section.label })),
    ...(project.outcomes?.length ? [{ id: "outcomes", label: "Outcomes" }] : []),
    ...(project.milestones?.length ? [{ id: "process", label: "Process" }] : []),
    ...(project.gallery?.length ? [{ id: "gallery", label: "Gallery" }] : []),
    { id: "results", label: "Results" },
    ...(project.testimonial ? [{ id: "testimonial", label: "Testimonial" }] : []),
    ...(projectServices.length ? [{ id: "services", label: "Service stack" }] : []),
  ];

  const currentIndex = allProjects.findIndex((item) => item.slug.current === slug);
  const fallbackNextProject =
    currentIndex >= 0
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : fallbackCaseStudies[0];
  const nextProject = project.nextProject ?? fallbackNextProject;

  return (
    <>
      <Navigation />

      <section className="px-8 pb-20 pt-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              All projects
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-dim)]">
              <StatusBadge variant={statusVariant(project.status)}>
                {project.status ?? "preview"}
              </StatusBadge>
              {project.featured && <StatusBadge variant="accent">Featured</StatusBadge>}
              <span className="uppercase tracking-[0.2em]">{project.client}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
              <span>{project.year}</span>
              {project.sector && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
                  <span>{project.sector}</span>
                </>
              )}
              {project.engagement && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
                  <span>{project.engagement}</span>
                </>
              )}
              {project.timeline && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
                  <span>{project.timeline}</span>
                </>
              )}
            </div>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-bold tracking-tight lg:text-8xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              {project.excerpt}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-2">
              {project.deliverables?.map((deliverable) => (
                <StatusBadge key={deliverable}>{deliverable}</StatusBadge>
              ))}
              {project.scope && <StatusBadge variant="accent">{project.scope}</StatusBadge>}
            </div>
          </Reveal>

          {project.links?.length ? (
            <Reveal delay={0.22}>
              <div className="mt-10 flex flex-wrap gap-3">
                {project.links.map((resource) => (
                  <Link
                    key={resource.label}
                    href={resource.href}
                    className="inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
                  >
                    {resource.label}
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <div className="px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {project.coverImage?.asset ? (
            <div className="relative aspect-[16/9] overflow-hidden border border-[var(--color-border)]">
              <SanityImage image={project.coverImage} alt={project.title} fill priority sizes="100vw" />
            </div>
          ) : (
            <div
              className="aspect-[16/9] overflow-hidden border border-[var(--color-border)]"
              style={{ backgroundColor: `${color}12` }}
            >
              <div className="flex h-full items-center justify-center">
                <span
                  className="font-display text-[200px] font-bold opacity-[0.04]"
                  style={{ color }}
                >
                  {project.title[0]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModerationPanel
        title="Publishing review"
        description="Role-aware affordances now live alongside storytelling routes so editors and admins can review quality without leaving the frontend experience."
        tasks={siteSettings.moderationQueue.filter((task) => task.kind !== "inquiry")}
      />

      <section className="px-8 py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Navigate case study
              </p>
              <nav className="mt-6">
                <ul className="space-y-3">
                  {sectionLinks.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {overviewFacts.length > 0 && (
              <div id="overview" className="mt-6 border border-[var(--color-border)] p-6 scroll-mt-32">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Project overview
                </p>
                <div className="mt-6 space-y-5">
                  {overviewFacts.map((fact) => (
                    <div key={`${fact.label}-${fact.value}`} className="border-t border-[var(--color-border)] pt-4 first:border-t-0 first:pt-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
                        {fact.value}
                      </p>
                      {fact.detail && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {fact.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="space-y-20">
            {contentSections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <Reveal delay={index * 0.08}>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>
                      {section.label}
                    </p>
                    {section.value ? (
                      <PortableTextContent value={section.value} className="mt-6" />
                    ) : (
                      <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                        {section.fallback}
                      </p>
                    )}
                  </div>
                </Reveal>
              </section>
            ))}

            {(project.outcomes?.length ?? 0) > 0 && (
              <section id="outcomes" className="scroll-mt-32">
                <Reveal>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Outcomes
                    </p>
                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      {project.outcomes?.map((outcome, index) => (
                        <div key={`${outcome.label}-${index}`} className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                            {outcome.label}
                          </p>
                          <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[var(--color-accent)]">
                            {outcome.value}
                          </p>
                          {outcome.context && (
                            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {outcome.context}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {(project.milestones?.length ?? 0) > 0 && (
              <section id="process" className="scroll-mt-32">
                <Reveal>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Process timeline
                    </p>
                    <div className="mt-8 space-y-5">
                      {project.milestones?.map((milestone, index) => (
                        <div key={`${milestone.phase}-${index}`} className="grid gap-4 border border-[var(--color-border)] p-6 md:grid-cols-[140px_minmax(0,1fr)]">
                          <div>
                            <StatusBadge variant="accent">{milestone.phase}</StatusBadge>
                          </div>
                          <div>
                            <h2 className="font-display text-2xl font-bold tracking-tight">
                              {milestone.title}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {milestone.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {project.gallery && project.gallery.length > 0 ? (
              <section id="gallery" className="scroll-mt-32">
                <Reveal>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Gallery
                    </p>
                    <div className="mt-8">
                      <SanityGallery images={project.gallery} columns={2} />
                    </div>
                  </div>
                </Reveal>
              </section>
            ) : null}

            <section id="results" className="scroll-mt-32">
              <Reveal>
                <div className="border-t border-[var(--color-border)] pt-6">
                  <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>
                    Results
                  </p>
                  {project.results ? (
                    <PortableTextContent value={project.results} className="mt-6" />
                  ) : (
                    <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                      The engagement aligned narrative, interface quality, and delivery discipline
                      into a launch-ready system the client could extend with confidence.
                    </p>
                  )}
                </div>
              </Reveal>
            </section>

            {project.testimonial && (
              <section id="testimonial" className="scroll-mt-32">
                <Reveal>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Client perspective
                    </p>
                    <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
                      <p className="font-display text-2xl font-medium leading-relaxed italic lg:text-3xl">
                        &ldquo;{project.testimonial.quote}&rdquo;
                      </p>
                      <div className="mt-6">
                        <p className="text-sm font-medium">{project.testimonial.author}</p>
                        <p className="text-xs text-[var(--color-text-dim)]">
                          {project.testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {projectServices.length > 0 && (
              <section id="services" className="scroll-mt-32">
                <Reveal>
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                      Service stack
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {projectServices.map((service) => (
                        <StatusBadge key={service._id}>{service.title}</StatusBadge>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}
          </div>
        </div>
      </section>

      {nextProject && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Link href={`/work/${nextProject.slug?.current}`} className="group flex items-center justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                  Next project
                </p>
                <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0 text-[var(--color-text-dim)] transition-all group-hover:translate-x-2 group-hover:text-[var(--color-accent)]" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

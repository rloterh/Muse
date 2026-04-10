import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

function statusVariant(status: string | undefined) {
  if (status === "review") return "warning";
  if (status === "scheduled") return "accent";
  if (status === "published") return "success";
  return "neutral";
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
  const contentSections = [
    {
      label: "The challenge",
      value: project.challenge,
      fallback:
        "The client needed a system that felt unmistakably premium while still helping internal teams publish, scale, and measure the work with confidence.",
    },
    {
      label: "Our approach",
      value: project.approach,
      fallback:
        "We used a strategy-first process that aligned brand narrative, motion language, and engineering architecture before expanding into implementation.",
    },
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
            </div>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-bold tracking-tight lg:text-8xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              {project.excerpt}
            </p>
          </Reveal>

          {(project.deliverables?.length ?? 0) > 0 && (
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap gap-2">
                {project.deliverables?.map((deliverable) => (
                  <StatusBadge key={deliverable}>{deliverable}</StatusBadge>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <div className="px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {project.coverImage?.asset ? (
            <div className="relative aspect-[16/9] overflow-hidden">
              <SanityImage
                image={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="100vw"
              />
            </div>
          ) : (
            <div
              className="aspect-[16/9] overflow-hidden"
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
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            {contentSections.map((section, index) => (
              <Reveal key={section.label} delay={index * 0.1}>
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
            ))}
          </div>
        </div>
      </section>

      {(project.outcomes?.length ?? 0) > 0 && (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {project.outcomes?.map((outcome, index) => (
              <Reveal key={`${outcome.label}-${index}`} delay={index * 0.08}>
                <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
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
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {project.gallery && project.gallery.length > 0 ? (
        <section className="px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SanityGallery images={project.gallery} columns={2} />
          </div>
        </section>
      ) : null}

      <section className="px-8 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>
              Results
            </p>
            {project.results ? (
              <PortableTextContent value={project.results} className="mt-6 text-left" />
            ) : (
              <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                The engagement aligned narrative, interface quality, and delivery discipline into a
                launch-ready system the client could extend with confidence.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {project.testimonial && (
        <section className="border-t border-[var(--color-border)] px-8 py-24 lg:px-12">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-display text-2xl font-medium leading-relaxed italic lg:text-3xl">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="text-sm font-medium">{project.testimonial.author}</p>
                <p className="text-xs text-[var(--color-text-dim)]">{project.testimonial.role}</p>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {projectServices.length > 0 && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Service stack
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {projectServices.map((service) => (
                  <StatusBadge key={service._id}>{service.title}</StatusBadge>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {nextProject && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/work/${nextProject.slug?.current}`}
              className="group flex items-center justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                  Next project
                </p>
                <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-[var(--color-text-dim)] transition-all group-hover:translate-x-2 group-hover:text-[var(--color-accent)]" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SanityImage, SanityGallery } from "@/components/ui/sanity-image";
import { CaseStudySkeleton } from "@/components/ui/skeleton";
import { fetchSanity, CASE_STUDY_QUERY } from "@/lib/sanity/client";
import type { CaseStudy } from "@/types";

// Static fallback data for demo (used when Sanity is not configured)
const STATIC_PROJECTS: Record<string, Partial<CaseStudy>> = {
  luminary: {
    title: "Luminary Rebrand", client: "Luminary Health", year: 2025, color: "#4A7C6F",
    excerpt: "A complete visual transformation for a wellness platform, establishing a new standard in health-tech design.",
    testimonial: { quote: "Muse didn't just redesign our brand — they helped us understand who we really are.", author: "Dr. Sarah Chen", role: "CEO, Luminary Health" },
  },
  prism: {
    title: "Prism Dashboard", client: "Prism Analytics", year: 2025, color: "#6366F1",
    excerpt: "A data visualization suite that makes complex analytics feel intuitive, built for enterprise-scale decision making.",
    testimonial: { quote: "The dashboard transformed how our entire organization interacts with data.", author: "Marcus Webb", role: "CTO, Prism Analytics" },
  },
  vanta: {
    title: "Vanta Launch", client: "Vanta Security", year: 2024, color: "#C8956C",
    excerpt: "Marketing site and brand launch for a cybersecurity startup that needed to communicate trust without sacrificing boldness.",
  },
  echo: {
    title: "Echo Spatial", client: "Echo Audio", year: 2024, color: "#DC2626",
    excerpt: "An immersive WebGL audio product experience with spatial sound visualization that pushes browser capabilities.",
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingSanity, setUsingSanity] = useState(false);

  useEffect(() => {
    async function load() {
      // Try Sanity first
      try {
        if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          const data = await fetchSanity<CaseStudy | null>(CASE_STUDY_QUERY, { slug });
          if (data) {
            setProject(data);
            setUsingSanity(true);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Fall back to static data
      const staticData = STATIC_PROJECTS[slug];
      if (staticData) {
        setProject({
          _id: slug,
          title: staticData.title ?? slug,
          slug: { current: slug },
          client: staticData.client ?? "",
          excerpt: staticData.excerpt ?? "",
          year: staticData.year ?? 2024,
          color: staticData.color ?? "#C8956C",
          testimonial: staticData.testimonial,
        } as CaseStudy);
      }
      setLoading(false);
    }

    if (slug) load();
  }, [slug]);

  if (loading) return <><Navigation /><CaseStudySkeleton /></>;

  if (!project) {
    return (
      <>
        <Navigation />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold">Project not found</h1>
            <Link href="/work" className="mt-4 inline-block text-sm text-[var(--color-accent)] hover:underline">Back to work</Link>
          </div>
        </div>
      </>
    );
  }

  const color = project.color ?? "#C8956C";
  const hasRichContent = usingSanity && (project.challenge || project.approach || project.results);
  const projectServices = project.services ?? [];

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="px-8 pb-20 pt-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/work" className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />All projects
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-dim)]">
              <span className="uppercase tracking-[0.2em]">{project.client}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
              <span>{project.year}</span>
              {projectServices.length > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
                  <span>{projectServices.map((s) => s.title).join(", ")}</span>
                </>
              )}
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight lg:text-8xl">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">{project.excerpt}</p>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {project.coverImage?.asset ? (
            <div className="relative aspect-[16/9] overflow-hidden">
              <SanityImage image={project.coverImage} alt={project.title} fill priority sizes="100vw" />
            </div>
          ) : (
            <div className="aspect-[16/9] overflow-hidden" style={{ backgroundColor: color + "12" }}>
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-[200px] font-bold opacity-[0.04]" style={{ color }}>{project.title[0]}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content sections */}
      <section className="px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {hasRichContent ? (
            /* Sanity portable text content */
            <div className="grid gap-32 lg:grid-cols-2 lg:gap-20">
              {project.challenge && (
                <Reveal>
                  <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>The challenge</p>
                  <PortableTextContent value={project.challenge} />
                </Reveal>
              )}
              {project.approach && (
                <Reveal delay={0.15}>
                  <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>Our approach</p>
                  <PortableTextContent value={project.approach} />
                </Reveal>
              )}
            </div>
          ) : (
            /* Static placeholder content */
            <div className="grid gap-32 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>The challenge</p>
                <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                  The client needed a solution that would stand out in a crowded market while remaining intuitive and accessible to their diverse user base.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>Our approach</p>
                <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                  We took a research-first approach, conducting extensive user testing and competitive analysis before moving into design and development.
                </p>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 ? (
        <section className="px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SanityGallery images={project.gallery} columns={2} />
          </div>
        </section>
      ) : (
        <section className="px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="aspect-[4/3]" style={{ backgroundColor: color + "08" }}>
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-dim)]">
                    Gallery image {i}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      <section className="px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color }}>Results</p>
            {hasRichContent && project.results ? (
              <PortableTextContent value={project.results} className="mt-6 text-left" />
            ) : (
              <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
                The project exceeded all KPIs, delivering measurable impact across every metric that mattered to the client.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
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

      {/* Next project */}
      {project.nextProject && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Link href={`/work/${project.nextProject.slug?.current}`} className="group flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">Next project</p>
                <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                  {project.nextProject.title}
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

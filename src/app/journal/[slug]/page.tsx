import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { PortableTextContent } from "@/components/ui/portable-text";
import { Reveal } from "@/components/ui/reveal";
import { SanityImage } from "@/components/ui/sanity-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { resolveCaseStudies, resolveJournalPostBySlug, resolveJournalPosts } from "@/lib/content/resolvers";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await resolveJournalPosts();
  return posts.map((post) => ({ slug: post.slug.current }));
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolveJournalPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: `${post.title} | Muse Journal`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params;
  const [post, allPosts, caseStudies] = await Promise.all([
    resolveJournalPostBySlug(slug),
    resolveJournalPosts(),
    resolveCaseStudies(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts
    .filter((candidate) => candidate.slug.current !== slug)
    .filter((candidate) => candidate.category === post.category || candidate.featured)
    .slice(0, 2);

  const relatedCaseStudies = caseStudies.filter((study) =>
    post.relatedCaseStudies?.includes(study.slug.current)
  );

  return (
    <>
      <Navigation />
      <section className="px-8 pb-16 pt-32 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/journal"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Back to journal
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-dim)]">
              <StatusBadge variant="accent">{post.category}</StatusBadge>
              {post.featured && <StatusBadge>Featured</StatusBadge>}
              <span>{post.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-text-dim)]" />
              <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight lg:text-7xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              {post.excerpt}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            {post.coverImage?.asset ? (
              <SanityImage image={post.coverImage} alt={post.title} fill priority sizes="100vw" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,149,108,0.24),_transparent_58%)]" />
            )}
          </div>
        </div>
      </section>

      <section className="px-8 py-20 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <PortableTextContent value={post.body} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            {relatedCaseStudies.length > 0 && (
              <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  Related case studies
                </p>
                <div className="mt-6 space-y-5">
                  {relatedCaseStudies.map((study) => (
                    <Link key={study._id} href={`/work/${study.slug.current}`} className="block">
                      <p className="font-display text-2xl font-bold tracking-tight transition-colors hover:text-[var(--color-accent)]">
                        {study.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {study.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Continue reading
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    href={`/journal/${relatedPost.slug.current}`}
                    className="group border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-accent)]/30"
                  >
                    <StatusBadge variant="accent">{relatedPost.category}</StatusBadge>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                      {relatedPost.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {relatedCaseStudies.length > 0 && (
        <section className="border-t border-[var(--color-border)] px-8 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <Link href={`/work/${relatedCaseStudies[0].slug.current}`} className="group flex items-center justify-between gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                    Back into the work
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                    {relatedCaseStudies[0].title}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 shrink-0 text-[var(--color-text-dim)] transition-all group-hover:translate-x-2 group-hover:text-[var(--color-accent)]" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

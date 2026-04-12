"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, NotebookPen } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { SanityImage } from "@/components/ui/sanity-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import type { JournalPost } from "@/types";

interface JournalPageClientProps {
  posts: JournalPost[];
}

function categoryChipClass(active: boolean) {
  return active
    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-text)]"
    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]";
}

export function JournalPageClient({ posts }: JournalPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = [...new Set(posts.map((post) => post.category))].sort((left, right) =>
    left.localeCompare(right)
  );
  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    <>
      <Navigation />
      <section className="px-8 pb-24 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                  Journal
                </p>
                <h1 className="mt-3 font-display text-5xl font-bold tracking-tight lg:text-7xl">
                  Studio notes, systems thinking, and{" "}
                  <span className="italic text-[var(--color-accent)]">working ideas</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
                  Editorial writing on strategy, product craft, motion systems, and the operating
                  patterns behind the work we ship.
                </p>
              </div>

              <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                  <NotebookPen className="h-4 w-4 text-[var(--color-accent)]" />
                  Editorial archive
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Filter the journal by category to jump between strategic thinking, systems work,
                  and operational notes.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`border px-3 py-2 text-sm transition-colors ${categoryChipClass(activeCategory === category)}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {filteredPosts.length > 0 ? (
            <StaggerContainer className="mt-20 grid gap-10 lg:grid-cols-3" stagger={0.1}>
              {filteredPosts.map((post) => (
                <StaggerItem key={post.slug.current}>
                  <Link href={`/journal/${post.slug.current}`} className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-surface)]">
                      {post.coverImage?.asset ? (
                        <SanityImage
                          image={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,149,108,0.24),_transparent_58%)]" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-dim)]">
                        <StatusBadge variant="accent">{post.category}</StatusBadge>
                        {post.featured && <StatusBadge>Featured</StatusBadge>}
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                        {post.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {post.excerpt}
                      </p>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text)]">
                        Read article
                        <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="mt-20 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                No journal posts match this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

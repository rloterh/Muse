"use client";

import Link from "next/link";
import { ArrowRight, RefreshCcw } from "lucide-react";

interface RouteStateFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function RouteStateFrame({ eyebrow, title, description, children }: RouteStateFrameProps) {
  return (
    <section className="px-8 pb-24 pt-40 lg:px-12">
      <div className="mx-auto max-w-5xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 lg:p-12">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

interface LoadingStateProps {
  eyebrow: string;
  title: string;
  description: string;
  cardCount?: number;
}

export function LoadingState({
  eyebrow,
  title,
  description,
  cardCount = 3,
}: LoadingStateProps) {
  return (
    <RouteStateFrame eyebrow={eyebrow} title={title} description={description}>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={`${eyebrow}-skeleton-${index}`}
            className="border border-[var(--color-border)] bg-[var(--color-bg)] p-5"
          >
            <div className="content-skeleton aspect-[4/3] w-full" />
            <div className="mt-5 h-3 w-24 content-skeleton" />
            <div className="mt-4 h-8 w-3/4 content-skeleton" />
            <div className="mt-4 h-3 w-full content-skeleton" />
            <div className="mt-2 h-3 w-5/6 content-skeleton" />
          </div>
        ))}
      </div>
    </RouteStateFrame>
  );
}

interface ErrorStateProps {
  eyebrow: string;
  title: string;
  description: string;
  onRetry?: () => void;
  linkHref?: string;
  linkLabel?: string;
}

export function ErrorState({
  eyebrow,
  title,
  description,
  onRetry,
  linkHref = "/",
  linkLabel = "Return home",
}: ErrorStateProps) {
  return (
    <RouteStateFrame eyebrow={eyebrow} title={title} description={description}>
      <div className="mt-10 flex flex-wrap gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
          >
            <RefreshCcw className="h-4 w-4 text-[var(--color-accent)]" />
            Try again
          </button>
        )}
        <Link
          href={linkHref}
          className="inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 text-[var(--color-accent)]" />
        </Link>
      </div>
    </RouteStateFrame>
  );
}

interface NotFoundStateProps {
  eyebrow: string;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
}

export function NotFoundState({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
}: NotFoundStateProps) {
  return (
    <RouteStateFrame eyebrow={eyebrow} title={title} description={description}>
      <div className="mt-10">
        <Link
          href={linkHref}
          className="inline-flex items-center gap-2 border border-[var(--color-border)] px-5 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text)]"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 text-[var(--color-accent)]" />
        </Link>
      </div>
    </RouteStateFrame>
  );
}

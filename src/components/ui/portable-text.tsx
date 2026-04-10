"use client";

import { PortableText as SanityPortableText, type PortableTextComponents } from "@portabletext/react";
import { SanityImage } from "./sanity-image";
import type { PortableTextBlock } from "@/types";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-display text-3xl font-bold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-display text-xl font-bold tracking-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-[1.8] text-[var(--color-text-muted)]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[var(--color-accent)] py-1 pl-6 font-display text-xl italic leading-relaxed text-[var(--color-text)]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-4 space-y-2 text-base leading-[1.8] text-[var(--color-text-muted)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-4 list-decimal space-y-2 text-base leading-[1.8] text-[var(--color-text-muted)]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:bg-[var(--color-accent)]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-[var(--color-text)]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-[var(--color-accent)] underline decoration-[var(--color-accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-[var(--color-bg-surface)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-accent)]">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <SanityImage
          image={value}
          alt={value.alt ?? ""}
          width={1200}
          height={675}
          className="w-full"
        />
        {value.caption && (
          <figcaption className="mt-3 text-center text-xs text-[var(--color-text-dim)]">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    callout: ({ value }) => (
      <div className="my-8 border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-6">
        <p className="text-sm leading-relaxed text-[var(--color-text)]">{value.text}</p>
      </div>
    ),
    code: ({ value }) => (
      <pre className="my-8 overflow-x-auto bg-[var(--color-bg-surface)] p-6">
        <code className="font-mono text-sm text-[var(--color-text-muted)]">{value.code}</code>
      </pre>
    ),
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableTextContent({ value, className }: PortableTextProps) {
  if (!value) return null;
  return (
    <div className={className}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}

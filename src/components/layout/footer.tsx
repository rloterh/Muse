"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteSettings } from "@/lib/site/config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="px-8 py-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-auto max-w-5xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
            Ready to create something extraordinary?
          </p>
          <h2 className="mt-6 font-display text-5xl font-bold leading-none tracking-tight lg:text-7xl">
            Let&apos;s work <span className="italic text-[var(--color-accent)]">together</span>
          </h2>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-2 border border-[var(--color-text)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      <div className="border-t border-[var(--color-border)] px-8 py-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            {siteSettings.brandName}
          </Link>

          <nav className="flex items-center gap-8">
            {siteSettings.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-[var(--color-text-dim)]">
            &copy; {new Date().getFullYear()} {siteSettings.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}

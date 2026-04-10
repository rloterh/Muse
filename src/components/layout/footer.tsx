"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ConversionPanel } from "@/components/marketing/conversion-panel";
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
          className="mx-auto max-w-6xl"
        >
          <ConversionPanel
            eyebrow="Ready to move?"
            title="Request a proposal or review the capability deck"
            description="Use the inquiry flow when you are ready to scope a live opportunity, or download the deck for internal sharing and stakeholder alignment."
            primaryHref="/contact?intent=proposal"
            primaryLabel="Request proposal"
            note="Senior-led engagements across strategy, design, product, and launch delivery"
            location="footer"
          />
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

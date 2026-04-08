"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "Work", href: "/work", num: "01" },
  { label: "About", href: "/about", num: "02" },
  { label: "Services", href: "/services", num: "03" },
  { label: "Contact", href: "/contact", num: "04" },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Header bar */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-8 mix-blend-difference lg:px-12">
        <Link href="/" className="relative z-50" onClick={() => setIsOpen(false)}>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            MUSE
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex items-center gap-3"
          aria-label="Toggle menu"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-white">
            {isOpen ? "Close" : "Menu"}
          </span>
          <div className="flex h-6 w-8 flex-col items-end justify-center gap-1.5">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 4, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
              className="block h-[1.5px] bg-white"
              style={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -4, width: "100%" } : { rotate: 0, y: 0, width: "75%" }}
              className="block h-[1.5px] bg-white"
              style={{ width: isOpen ? "100%" : "75%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </button>
      </header>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 flex bg-[var(--color-bg)]"
          >
            {/* Left side — nav links */}
            <div className="flex flex-1 flex-col justify-center px-12 lg:px-24">
              <nav className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-baseline gap-4"
                    >
                      <span className="text-xs font-body text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                        {link.num}
                      </span>
                      <span
                        className={cn(
                          "font-display text-6xl font-bold leading-none tracking-tight transition-colors duration-300 lg:text-8xl",
                          pathname === link.href
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Right side — info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden w-80 flex-col justify-end p-12 lg:flex"
            >
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Get in touch
                  </p>
                  <a
                    href="mailto:hello@muse.agency"
                    className="mt-2 block font-body text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    hello@muse.agency
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Follow us
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="font-body text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-dim)]">
                    &copy; {new Date().getFullYear()} Muse Creative Agency
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

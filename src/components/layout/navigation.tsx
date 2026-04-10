"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AuthMenu } from "@/components/layout/auth-menu";
import { siteSettings } from "@/lib/site/config";
import { canAccessRole, useViewerStore } from "@/stores/viewer-store";
import { cn } from "@/lib/utils/cn";

export function Navigation() {
  const pathname = usePathname();
  const viewer = useViewerStore((state) => state.viewer);
  const isOpen = useViewerStore((state) => state.menuOpen);
  const setMenuOpen = useViewerStore((state) => state.setMenuOpen);
  const closeOverlays = useViewerStore((state) => state.closeOverlays);

  const overlayLinks = canAccessRole(viewer, "editor")
    ? [...siteSettings.navLinks, { label: "Admin", href: "/admin", num: "05" }]
    : siteSettings.navLinks;

  useEffect(() => {
    closeOverlays();
  }, [pathname, closeOverlays]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeOverlays();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOverlays]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 mix-blend-difference lg:px-12">
        <Link href="/" className="relative z-50" onClick={closeOverlays}>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            {siteSettings.brandName.toUpperCase()}
          </span>
        </Link>

        <div className="relative z-50 flex items-center gap-3">
          <nav className="hidden items-center gap-6 xl:flex">
            {siteSettings.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.24em] text-white/75 transition-colors hover:text-white",
                  pathname === link.href && "text-[var(--color-accent)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <AuthMenu className="hidden md:block" />

          <button
            type="button"
            onClick={() => setMenuOpen(!isOpen)}
            className="relative flex items-center gap-3"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="site-menu-overlay"
          >
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white">
              {isOpen ? "Close" : "Menu"}
            </span>
            <div className="flex h-6 w-8 flex-col items-end justify-center gap-1.5">
              <motion.span
                animate={
                  isOpen ? { rotate: 45, y: 4, width: "100%" } : { rotate: 0, y: 0, width: "100%" }
                }
                className="block h-[1.5px] bg-white"
                style={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                animate={
                  isOpen ? { rotate: -45, y: -4, width: "100%" } : { rotate: 0, y: 0, width: "75%" }
                }
                className="block h-[1.5px] bg-white"
                style={{ width: isOpen ? "100%" : "75%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="site-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 flex bg-[var(--color-bg)]"
          >
            <div className="flex flex-1 flex-col justify-center px-12 lg:px-24">
              <nav className="space-y-2">
                {overlayLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeOverlays}
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
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="mt-2 block font-body text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Follow us
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {siteSettings.socials.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                    Account
                  </p>
                  <div className="mt-3 space-y-2">
                    {viewer ? (
                      <>
                        <p className="font-body text-sm text-[var(--color-text-muted)]">
                          {viewer.name} | {viewer.role}
                        </p>
                        <Link
                          href="/auth"
                          onClick={closeOverlays}
                          className="block text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                        >
                          Manage account access
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/auth"
                        onClick={closeOverlays}
                        className="block text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        Open secure sign in
                      </Link>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-dim)]">
                    &copy; {new Date().getFullYear()} {siteSettings.brandName} Creative Agency
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

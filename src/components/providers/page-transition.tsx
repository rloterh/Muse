"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 18, filter: "blur(10px)" }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        exit={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: -12, filter: "blur(8px)" }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

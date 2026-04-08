"use client";

import type { ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Preloader } from "@/components/ui/preloader";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useSmoothScroll();

  return (
    <>
      <Preloader />
      <CustomCursor />
      {children}
    </>
  );
}

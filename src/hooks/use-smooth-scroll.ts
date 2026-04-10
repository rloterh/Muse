"use client";

import { useEffect } from "react";

type LenisInstance = {
  raf: (time: number) => void;
  on: (event: "scroll", callback: () => void) => void;
  destroy: () => void;
};

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: LenisInstance | undefined;

    async function init() {
      const Lenis = (await import("@studio-freight/lenis")).default;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        lenis?.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch {
        // GSAP not yet loaded - that's fine.
      }
    }

    if (!window.matchMedia("(pointer: coarse)").matches) {
      void init();
    }

    return () => {
      lenis?.destroy();
    };
  }, []);
}

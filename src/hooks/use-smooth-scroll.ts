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
    let frameId = 0;
    let removeGsapTicker: (() => void) | undefined;

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
        frameId = requestAnimationFrame(raf);
      }

      frameId = requestAnimationFrame(raf);

      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        const ticker = (time: number) => lenis?.raf(time * 1000);

        lenis?.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        removeGsapTicker = () => {
          gsap.ticker.remove(ticker);
        };
      } catch {
        // GSAP not yet loaded - that's fine.
      }
    }

    if (
      !window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      void init();
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      removeGsapTicker?.();
      lenis?.destroy();
    };
  }, []);
}

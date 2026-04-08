"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: any;

    async function init() {
      const Lenis = (await import("@studio-freight/lenis")).default;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Sync with GSAP ScrollTrigger if loaded
      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch {
        // GSAP not yet loaded — that's fine
      }
    }

    // Only enable on desktop
    if (!window.matchMedia("(pointer: coarse)").matches) {
      init();
    }

    return () => {
      lenis?.destroy();
    };
  }, []);
}

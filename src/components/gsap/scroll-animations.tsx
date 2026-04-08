"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// GSAP LAZY LOADER
// We load GSAP dynamically to avoid SSR issues
// ============================================

async function loadGSAP() {
  const gsap = (await import("gsap")).default;
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

// ============================================
// PARALLAX TEXT — moves at different speed on scroll
// ============================================

interface ParallaxTextProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxText({ children, speed = 0.5, className }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      ctx = gsap.context(() => {
        gsap.to(ref.current, {
          yPercent: speed * -50,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx?.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ============================================
// HORIZONTAL SCROLL — pins container, scrolls children horizontally
// ============================================

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      const track = trackRef.current!;
      const scrollWidth = track.scrollWidth - window.innerWidth;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${scrollWidth}`,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="flex gap-8 will-change-transform">
        {children}
      </div>
    </div>
  );
}

// ============================================
// NUMBER COUNTER — animates from 0 to target on scroll
// ============================================

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ target, suffix = "", duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      const obj = { value: 0 };

      ctx = gsap.context(() => {
        gsap.to(obj, {
          value: target,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.round(obj.value) + suffix;
            }
          },
        });
      });
    });

    return () => ctx?.revert();
  }, [target, suffix, duration]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}

// ============================================
// TEXT SPLIT REVEAL — each character animates in from below
// ============================================

interface TextRevealProps {
  text: string;
  className?: string;
  stagger?: number;
}

export function TextSplitReveal({ text, className, stagger = 0.03 }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      const chars = containerRef.current!.querySelectorAll(".split-char");

      ctx = gsap.context(() => {
        gsap.from(chars, {
          yPercent: 120,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => ctx?.revert();
  }, [text, stagger]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      {text.split("").map((char, i) => (
        <span key={i} className="split-char inline-block" style={{ display: char === " " ? "inline" : "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

// ============================================
// SCRUB SCALE — element scales on scroll progress
// ============================================

interface ScrubScaleProps {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}

export function ScrubScale({ children, className, from = 0.85, to = 1 }: ScrubScaleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(ref.current, { scale: from, opacity: 0.6 }, {
          scale: to,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx?.revert();
  }, [from, to]);

  return <div ref={ref} className={cn("will-change-transform", className)}>{children}</div>;
}

// ============================================
// LINE DRAW — SVG line draws in on scroll
// ============================================

export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let ctx: any;

    loadGSAP().then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(ref.current, {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return <div ref={ref} className={cn("h-full w-[1px] bg-[var(--color-accent)]", className)} />;
}

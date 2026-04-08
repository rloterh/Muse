"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseEnter() { setIsHidden(false); }
    function onMouseLeave() { setIsHidden(true); }

    // Track hoverable elements
    function addHoverListeners() {
      const elements = document.querySelectorAll("a, button, [role='button'], input, textarea, select, .magnetic");
      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    }

    // Animation loop
    let raf: number;
    function animate() {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      }

      raf = requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    animate();
    addHoverListeners();

    // Re-check for new elements periodically
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  // Don't render on mobile/touch
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Dot (follows mouse exactly) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          ...(isHovering ? { width: 0, height: 0 } : {}),
          ...(isHidden ? { opacity: 0 } : { opacity: 1 }),
        }}
      />

      {/* Ring (follows with delay, scales on hover) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997] mix-blend-difference"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.5)",
          transition: "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.3s, opacity 0.3s",
          ...(isHovering ? {
            width: 64,
            height: 64,
            borderColor: "rgba(200,149,108,0.6)",
            marginLeft: -12,
            marginTop: -12,
          } : {}),
          ...(isHidden ? { opacity: 0 } : { opacity: 1 }),
        }}
      />

      {/* Hide default cursor */}
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}

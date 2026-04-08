"use client";

import { cn } from "@/lib/utils/cn";

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  separator?: string;
}

export function Marquee({ text, speed = 30, className, separator = " — " }: MarqueeProps) {
  const repeatedText = Array(6).fill(text + separator).join("");

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{repeatedText}</span>
      </div>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{repeatedText}</span>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}

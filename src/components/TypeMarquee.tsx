"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollVelocityFactor } from "../lib/useScrollVelocityFactor";

/** Disciplines, set at poster scale and run as a ticker. */
const WORDS = [
  "Positioning",
  "Personal branding",
  "Long-form",
  "Short-form",
  "Visuals",
  "Production",
];

const BASE_SPEED = 0.055; // px per ms at rest

function Row({
  direction,
  outlined,
  velocity,
  reduce,
}: {
  direction: 1 | -1;
  outlined?: boolean;
  velocity: React.RefObject<number>;
  reduce: boolean | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - last, 64);
      last = now;
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        offset.current -= BASE_SPEED * dt * velocity.current * direction;
        if (half > 0) {
          // Keep the offset inside one copy of the content in both directions.
          if (-offset.current >= half) offset.current += half;
          if (offset.current > 0) offset.current -= half;
        }
        track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, reduce, velocity]);

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.9] text-[clamp(2.6rem,7.5vw,7rem)] px-6"
              style={
                outlined
                  ? {
                      color: "transparent",
                      WebkitTextStroke: "1px var(--text)",
                      opacity: 0.35,
                    }
                  : undefined
              }
            >
              {w}
            </span>
            <span
              aria-hidden
              className="shrink-0 rounded-full bg-(--accent) w-2.5 h-2.5 md:w-3.5 md:h-3.5"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * A poster-scale ticker: one solid row, one outlined row running the other way.
 * Both react to scroll speed, so the band tightens when the page moves.
 */
export default function TypeMarquee() {
  const reduce = useReducedMotion();
  const velocity = useScrollVelocityFactor();

  return (
    <section
      aria-label="What we do"
      className="py-16 md:py-24 border-b border-(--border) overflow-hidden select-none"
    >
      <div className="flex items-center gap-3 px-6 md:px-8 mb-8 md:mb-12">
        <span aria-hidden className="w-6 h-px bg-(--accent)" />
        <span className="u-meta text-(--accent)">What we do</span>
        <span aria-hidden className="flex-1 h-px bg-(--hairline)" />
      </div>

      <Row direction={1} velocity={velocity} reduce={reduce} />
      <Row direction={-1} outlined velocity={velocity} reduce={reduce} />
    </section>
  );
}

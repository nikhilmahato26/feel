"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollVelocityFactor } from "../lib/useScrollVelocityFactor";

const SLOTS = Array.from({ length: 9 }, (_, i) => i + 1);
const BASE_SPEED = 0.042; // px per ms at rest

/**
 * Logo wall. Real marks aren't in yet, so each cell is drawn as a reserved
 * slot with its own index — a designed placeholder rather than a dashed box
 * with the word "logo" in it. Swap the inner mark for an <img> per client.
 */
function Slot({ n }: { n: number }) {
  return (
    <div className="group flex items-center gap-3 px-8 shrink-0">
      <span
        aria-hidden
        className="w-7 h-7 rounded-[3px] border border-(--hairline-strong) grid place-items-center transition-colors duration-500 group-hover:border-(--accent)"
      >
        <span className="w-2 h-2 rounded-[1px] bg-(--text-secondary) opacity-40 transition-colors duration-500 group-hover:bg-(--accent) group-hover:opacity-100" />
      </span>
      <span className="u-meta text-(--text-secondary) opacity-85 whitespace-nowrap transition-opacity duration-500 group-hover:opacity-100">
        Client {String(n).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function TrustMarquee() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const velocity = useScrollVelocityFactor();

  // Driven by hand rather than by a CSS animation, so the strip can surge with
  // the scroll and settle again once the page comes to rest.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - last, 64);
      last = now;
      const track = trackRef.current;
      if (track && !paused.current) {
        const half = track.scrollWidth / 2;
        offset.current -= BASE_SPEED * dt * velocity.current;
        if (half > 0 && -offset.current >= half) offset.current += half;
        track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, velocity]);

  return (
    <section
      aria-label="Clients"
      className="relative bg-(--bg-alt) border-b border-(--border) overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="flex items-center">
        <span className="u-meta shrink-0 text-(--text-secondary) pl-6 md:pl-8 pr-6 py-6 border-r border-(--border) hidden sm:block">
          Clients
        </span>

        <div
          className="relative flex-1 overflow-hidden py-6"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex w-max items-center will-change-transform">
            {[...SLOTS, ...SLOTS].map((n, i) => (
              <Slot key={i} n={n} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

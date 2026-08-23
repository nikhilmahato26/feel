"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollVelocityFactor } from "../lib/useScrollVelocityFactor";

/**
 * Logo wall, wrapped onto a carousel.
 *
 * Every mark is drawn as a mask tinted by the page's text colour, not as a
 * full-colour image. The supplied files each carried their own baked-in
 * background — orange, red, mauve, two different blues — and ten saturated
 * tiles would have fought both each other and the single accent this site
 * runs on. One tone also makes the wall read as a set rather than as ten
 * pasted screenshots, and it follows the theme for free.
 *
 * `scale` trims the box height per mark so a tall icon doesn't tower over a
 * wide wordmark: optical balance, since bounding boxes alone don't give it.
 */
interface Client {
  slug: string;
  name: string;
  scale?: number;
}

const CLIENTS: Client[] = [
  { slug: "unacademy", name: "Unacademy" },
  { slug: "mamaearth", name: "Mamaearth" },
  { slug: "unicef", name: "UNICEF", scale: 0.8 },
  { slug: "enable", name: "Enable" },
  { slug: "college-vidya", name: "College Vidya", scale: 0.92 },
  { slug: "smartscale360", name: "SmartScale360" },
  { slug: "fobet-media", name: "Fobet Media", scale: 0.8 },
  { slug: "bailey-group", name: "The Bailey Group", scale: 0.86 },
  // TODO: names unconfirmed — the navy figure mark and the red bolt mark came
  // through without any wordmark. Replace both `name` values once known; they
  // are the alt text a screen reader announces.
  { slug: "client-08", name: "Client", scale: 0.78 },
  { slug: "client-09", name: "Client", scale: 0.78 },
];

const COUNT = CLIENTS.length;
const FACE_W = 188; // px, before perspective
const MARK_W = 140; // px, inside the plate's padding
const MARK_H = 44; // px, at scale 1
const BASE_SPEED = 5.4; // degrees per second at rest

/** Radius that seats COUNT faces of FACE_W edge to edge around the cylinder. */
const RADIUS = Math.round(FACE_W / 2 / Math.tan(Math.PI / COUNT));
const STEP = 360 / COUNT;

export default function ClientOrbit() {
  const reduce = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const angle = useRef(0);
  const paused = useRef(false);
  const velocity = useScrollVelocityFactor();

  // Driven by hand rather than by a CSS animation, so the ring can surge with
  // the scroll and settle again once the page comes to rest.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    // Reduced motion still gets the depth, just held still.
    if (reduce) {
      ring.style.transform = `rotateX(-7deg) rotateY(0deg)`;
      faceRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(0.18 + 0.82 * Math.max(0, Math.cos((i * STEP * Math.PI) / 180)) ** 1.3);
      });
      return;
    }

    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;

      if (!paused.current) {
        angle.current = (angle.current - BASE_SPEED * dt * velocity.current) % 360;
      }

      const ringEl = ringRef.current;
      if (ringEl) ringEl.style.transform = `rotateX(-7deg) rotateY(${angle.current}deg)`;

      // Depth fog: faces turning away recede instead of popping out of view.
      faceRefs.current.forEach((el, i) => {
        if (!el) return;
        const world = ((i * STEP + angle.current) * Math.PI) / 180;
        const facing = Math.max(0, Math.cos(world));
        el.style.opacity = String(0.16 + 0.84 * facing ** 1.3);
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, velocity]);

  return (
    <section
      aria-label="Clients"
      className="relative overflow-hidden border-b border-(--border) bg-(--bg-alt)"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="flex items-center gap-3 px-6 md:px-8 pt-10">
        <span aria-hidden className="w-6 h-px bg-(--accent)" />
        <span className="u-meta text-(--accent)">Trusted by</span>
        <span aria-hidden className="flex-1 h-px bg-(--hairline)" />
        <span className="u-meta text-(--text-secondary) hidden sm:block">
          {String(COUNT).padStart(2, "0")} partners
        </span>
      </div>

      {/* Mask sits outside the perspective element so it can't flatten the
          3D rendering context underneath it. */}
      <div
        className="relative py-14 md:py-16"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent)",
        }}
      >
        <div
          className="relative h-28 select-none"
          style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
        >
          <div
            ref={ringRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(-7deg)" }}
          >
            {CLIENTS.map((c, i) => (
              <div
                key={c.slug}
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: FACE_W,
                  transform: `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex h-24 items-center justify-center rounded-xl border border-(--hairline-strong) bg-(--surface) px-6 shadow-[var(--shadow-sm)]">
                  <span
                    role="img"
                    aria-label={c.name}
                    title={c.name}
                    className="block text-(--text-secondary)"
                    style={{
                      width: MARK_W,
                      height: Math.round(MARK_H * (c.scale ?? 1)),
                      backgroundColor: "currentColor",
                      maskImage: `url(/clients/${c.slug}.png)`,
                      WebkitMaskImage: `url(/clients/${c.slug}.png)`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

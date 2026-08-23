"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollVelocityFactor } from "../lib/useScrollVelocityFactor";

/**
 * Logo wall, wrapped onto a carousel.
 *
 * Two render paths per mark:
 *
 *   coloured: true   the brand tile from public/clients/colour, with `bg`
 *                    painted behind it so the tile has no visible edge
 *   coloured: false  the white silhouette from public/clients, drawn as a mask
 *                    tinted by the page text colour
 *
 * The coloured tiles are the artwork as supplied: several are white marks on a
 * saturated background, so keeping each tile's own colour on the plate is what
 * makes them legible — knocking the background out would leave white on white
 * in the light theme. tools/crop_logos.py trims them to their artwork and
 * reports the `bg` values used here.
 *
 * `scale` only applies to the mask path, where it trims the box height so a
 * tall icon doesn't tower over a wide wordmark. The coloured path uses
 * object-contain instead.
 */
interface Client {
  slug: string;
  name: string;
  scale?: number;
  coloured?: boolean;
  /** Tile background, sampled from the artwork. Required when coloured. */
  bg?: string;
}

const CLIENTS: Client[] = [
  { slug: "unacademy", name: "Unacademy", coloured: true, bg: "#ffffff" },
  { slug: "mamaearth", name: "Mamaearth", coloured: true, bg: "#ffffff" },
  { slug: "unicef", name: "UNICEF", coloured: true, bg: "#01b0f1" },
  { slug: "enable", name: "Enable", coloured: true, bg: "#eff5f5" },
  { slug: "college-vidya", name: "College Vidya", coloured: true, bg: "#1043ea" },
  { slug: "smartscale360", name: "SmartScale360", coloured: true, bg: "#0151fe" },
  { slug: "fobet-media", name: "Fobet Media", coloured: true, bg: "#ac89a9" },
  { slug: "bailey-group", name: "The Bailey Group", coloured: true, bg: "#eb6214" },
  // TODO: names unconfirmed — the navy figure mark and the red bolt mark came
  // through without any wordmark. Replace both `name` values once known; they
  // are the alt text a screen reader announces.
  { slug: "client-08", name: "Client", coloured: true, bg: "#232d62" },
  { slug: "client-09", name: "Client", coloured: true, bg: "#c23933" },
];

/**
 * The wall runs the full width of the page, and a ten-face cylinder is too
 * small an arc to reach both edges — the front of the drum simply isn't that
 * wide. Seating the list twice doubles the radius, which widens the visible arc
 * past the viewport. The two copies sit 180° apart, so a brand's twin is always
 * on the hidden side of the drum.
 */
const FACES = [...CLIENTS, ...CLIENTS];

const COUNT = FACES.length;
const FACE_W = 252; // px, before perspective — with COUNT, this drives RADIUS
const MARK_W = 192; // px, inside the plate's padding
const MARK_H = 58; // px, at scale 1
const BASE_SPEED = 10; // degrees per second at rest

/** Radius that seats COUNT faces of FACE_W edge to edge around the cylinder. */
const RADIUS = Math.round(FACE_W / 2 / Math.tan(Math.PI / COUNT));
const STEP = 360 / COUNT;

/**
 * Perspective has to grow with the radius, or the front faces sit so close to
 * the camera that they balloon: the near-face scale is P / (P - RADIUS).
 */
const PERSPECTIVE = 2800;

/**
 * Tilt is deliberately shallow. It reads as a drum seen slightly from above,
 * but the front face is displaced vertically by RADIUS · sin(tilt) — at this
 * radius even a few degrees drops the plates out of the band.
 */
const TILT = -2.5; // degrees

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
      ring.style.transform = `rotateX(${TILT}deg) rotateY(0deg)`;
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
      if (ringEl) ringEl.style.transform = `rotateX(${TILT}deg) rotateY(${angle.current}deg)`;

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
      {/* Full-bleed: the rule runs to both edges rather than stopping at a
          container gutter, so the band reads as a strip across the page. */}
      <div className="flex items-center gap-3 px-4 pt-10">
        <span aria-hidden className="w-6 h-px bg-(--accent)" />
        <span className="u-meta text-(--accent)">Trusted by</span>
        <span aria-hidden className="flex-1 h-px bg-(--hairline)" />
        <span className="u-meta text-(--text-secondary) hidden sm:block">
          Industry giants
        </span>
      </div>

      {/* Mask sits outside the perspective element so it can't flatten the
          3D rendering context underneath it. */}
      <div
        className="relative py-14 md:py-16"
        style={{
          // Edge to edge: just enough fade to avoid a hard cut at the viewport
          // edge, rather than the wide vignette that held the wall inboard.
          maskImage: "linear-gradient(to right, transparent, #000 2%, #000 98%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 2%, #000 98%, transparent)",
        }}
      >
        <div
          className="relative h-44 select-none"
          style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}
        >
          <div
            ref={ringRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)` }}
          >
            {FACES.map((c, i) => (
              <div
                key={`${c.slug}-${i}`}
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
                <div
                  className={`flex h-24 items-center justify-center overflow-hidden rounded-xl border px-5 shadow-[var(--shadow-sm)] ${
                    c.coloured
                      ? "border-black/5"
                      : "border-(--hairline-strong) bg-(--surface)"
                  }`}
                  style={c.coloured ? { background: c.bg } : undefined}
                >
                  {c.coloured ? (
                    <img
                      src={`/clients/colour/${c.slug}.png`}
                      alt={c.name}
                      title={c.name}
                      loading="lazy"
                      decoding="async"
                      className="block max-h-full w-auto object-contain"
                      style={{ maxWidth: MARK_W }}
                    />
                  ) : (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

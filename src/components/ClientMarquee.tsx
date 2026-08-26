"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Logo wall: square brand tiles running right to left, name underneath.
 *
 * Flat on purpose. The wall used to be a rotating 3D drum, which put half the
 * logos at an angle or facing away — the opposite of what a client wall is for.
 * A brand mark should be shown square-on and legible, so the depth work stays
 * on the hero and this band just reads.
 *
 * Tiles are the artwork exactly as supplied: 1:1, each with its own background
 * colour, since several are white marks that would vanish knocked out.
 */
interface Client {
  slug: string;
  name: string;
}

/**
 * Ordered so no two neighbours share a background. Three of these tiles are
 * white or near-white and three are blue; left in supplied order they paired up
 * and read as one wide tile with two logos floating in it. The sequence below
 * alternates light, blue and coloured, and it holds across the wrap too — the
 * last tile sits next to the first one.
 */
const CLIENTS: Client[] = [
  { slug: "unacademy", name: "Unacademy" }, // white
  { slug: "college-vidya", name: "College Vidya" }, // blue
  { slug: "mamaearth", name: "Mamaearth" }, // white
  { slug: "topaz-consulting", name: "Topaz Consulting Services" }, // navy
  { slug: "enable", name: "Enable" }, // near-white
  { slug: "oechsli", name: "Oechsli" }, // red
  { slug: "unicef", name: "UNICEF" }, // cyan
  { slug: "bailey-group", name: "The Bailey Group" }, // orange
  { slug: "smartscale360", name: "SmartScale360" }, // blue
  { slug: "fobet-media", name: "Fobet Media" }, // mauve
];

/** Travel, in px per second. Constant regardless of how long the track is. */
const SPEED = 40;

export default function ClientMarquee() {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  /**
   * How many times the list is repeated along the track.
   *
   * This is the fix for the strip running out mid-cycle. Ten tiles are about
   * 1120px, so on any screen wider than that a single run can't fill the band:
   * the old CSS animation slid the track by one run and left the right-hand end
   * of the viewport empty until it snapped back. The count is measured instead
   * — enough runs to cover the viewport, plus one spare to feed in from the
   * right — so there is always content beyond both edges.
   */
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    function measure() {
      const run = track!.scrollWidth / copies;
      if (!run) return;
      const needed = Math.max(2, Math.ceil(viewport!.clientWidth / run) + 1);
      // Converges immediately: `run` is independent of the current count.
      if (needed !== copies) setCopies(needed);
    }

    measure();
    // Re-measures on resize and at the breakpoint where the tiles change size.
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [copies]);

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();
    let offset = 0;

    function tick(now: number) {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;

      if (!paused.current) {
        // Wrapping by exactly one run is what makes the loop invisible: the
        // content repeats on that period, so the jump lands on an identical
        // frame. Read per tick, so a resize can't desynchronise it.
        const run = track!.scrollWidth / copies;
        offset -= SPEED * dt;
        if (run && -offset >= run) offset += run;
        track!.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [copies, reduce]);

  const track = Array.from({ length: copies }, () => CLIENTS).flat();

  return (
    <section
      aria-label="Clients"
      className="relative overflow-hidden border-b border-(--border) bg-(--bg-alt)"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="flex items-center gap-3 px-6 pt-7 md:px-8">
        <span aria-hidden className="h-px w-6 bg-(--accent)" />
        <span className="u-meta text-(--accent)">Trusted by</span>
        <span aria-hidden className="h-px flex-1 bg-(--hairline)" />
        <span className="u-meta hidden text-(--text-secondary) sm:block">Industry giants</span>
      </div>

      <div
        ref={viewportRef}
        className="relative py-7 md:py-8"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        {/* Each item's width includes its trailing gap, so the tile itself is
            72px on mobile and 80px from md up, and one run is an exact multiple
            of the item box — no half-gap left over at the wrap. */}
        <ul
          ref={trackRef}
          className="flex w-max items-start will-change-transform"
        >
          {track.map((c, i) => (
            <li key={`${c.slug}-${i}`} className="w-24 shrink-0 pr-6 md:w-28 md:pr-8">
              <div className="aspect-square overflow-hidden rounded-xl border border-(--hairline-strong) bg-(--surface) shadow-[var(--shadow-sm)]">
                <img
                  src={`/clients/tile/${c.slug}.jpg`}
                  // Empty alt: the name sits right underneath as real text, so
                  // labelling the image too would announce every client twice.
                  alt=""
                  // The first run is on screen immediately; lazy-loading it
                  // leaves visible gaps as the strip starts moving.
                  loading={i < CLIENTS.length ? "eager" : "lazy"}
                  decoding="async"
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2.5 text-center text-[0.6875rem] font-medium leading-tight text-(--text-secondary)">
                {c.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

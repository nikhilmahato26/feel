"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";
import { LOGO_RATIO, logoMaskStyle } from "../lib/brand";
import { SOCIALS } from "../lib/socials";

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer parallax on the plate. Written to motion values rather than state,
  // so moving the cursor across the hero never triggers a render.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), spring);
  const markZ = useSpring(useTransform(py, [-0.5, 0.5], [26, 6]), spring);

  const handleMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    [px, py, reduce],
  );

  const handleLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  // Scroll-linked depth: the plate sinks, the argument lifts, the whole opening
  // softens as it leaves.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const markY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 44]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -50]);
  const fade = useTransform(scrollYProgress, [0, 0.9], reduce ? [1, 1] : [1, 0.32]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="border-b border-(--border)"
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[86vh]">
        {/* ---- Left plate: the mark, reversed out of the accent ---- */}
        <div
          className="relative min-h-72 w-full overflow-hidden lg:min-h-0 lg:w-[41%]"
          style={{ background: "linear-gradient(160deg, var(--color-accent), var(--color-accent-2))" }}
        >
          {/* Depth inside the plate: a drifting floor and a slow bloom, both
              held well under the mark so they read as air, not as pattern. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
            style={{ perspective: "520px", perspectiveOrigin: "50% 0%", y: plateY }}
          >
            <div
              className={reduce ? "" : "grid-drift"}
              style={{
                position: "absolute",
                inset: "0 -25%",
                transform: "rotateX(72deg)",
                transformOrigin: "50% 100%",
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                maskImage: "linear-gradient(to top, #000 5%, transparent 80%)",
                WebkitMaskImage: "linear-gradient(to top, #000 5%, transparent 80%)",
              }}
            />
          </motion.div>

          <motion.div
            aria-hidden
            style={{ y: plateY, background: "radial-gradient(circle, #fff, transparent 66%)" }}
            className="orb-float pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full opacity-[0.16]"
          />

          {/* The mark. Tilts with the pointer and lifts toward the reader; the
              preloader hands its own copy off to this exact element. */}
          <div
            className="relative z-10 flex h-full items-center justify-center px-8 py-20 lg:py-24"
            style={{ perspective: "1100px" }}
          >
            <motion.div
              style={{ transformStyle: "preserve-3d", rotateX, rotateY, y: markY }}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-84"
            >
              {/* Filled with currentColor rather than the variable directly, so
                  the element's computed `color` is white too — that's the value
                  the preloader reads to know what colour to land in. */}
              <motion.span
                data-hero-logo
                role="img"
                aria-label="Feelz Films"
                className="block w-full text-(--hero-text)"
                style={{
                  aspectRatio: LOGO_RATIO,
                  ...logoMaskStyle("currentColor"),
                  z: markZ,
                }}
              />
            </motion.div>
          </div>

          {/* Caption, in a drawn rectangle rather than floated on its own. */}
          <div className="absolute bottom-8 left-6 z-10 hidden max-w-76 items-stretch text-(--hero-text) opacity-80 lg:flex">
            <span className="u-meta flex items-center border border-(--hero-text)/50 px-2 py-2">FF</span>
            <span className="u-meta max-w-64 border-y border-r border-(--hero-text)/50 px-3 py-2 leading-[1.5]">
              Marketing partner for founders and executives
            </span>
          </div>

          {/* Dissolve the plate into the page rather than cutting it hard
              against the headline: sideways on the split, downward once it
              stacks above the copy. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-28 lg:block lg:w-36"
            style={{ background: "linear-gradient(to right, transparent, var(--bg))" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 lg:hidden"
            style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
          />
        </div>

        {/* ---- Right: the argument ---- */}
        <motion.div
          style={{ y: copyY, opacity: fade }}
          className="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-16"
        >
          <motion.div {...rise(0.05)} className="mb-7 flex items-center gap-3">
            <span aria-hidden className="h-px w-6 bg-(--accent)" />
            <span className="u-meta text-(--accent)">Content · Personal branding · Marketing</span>
          </motion.div>

          <h1 className="u-display text-[clamp(2.5rem,1.7rem+3.1vw,4.75rem)] leading-[0.97] max-w-[15ch]">
            <TextReveal text="Your expertise deserves to be seen." delay={0.2} trigger="mount" />
          </h1>

          <motion.p
            {...rise(0.6)}
            className="mt-7 max-w-[46ch] text-base leading-relaxed text-(--text-secondary) md:text-lg"
          >
            We turn founder and executive expertise into content that builds authority, trust and
            inbound opportunity.
          </motion.p>

          <motion.div {...rise(0.78)} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="mailto:connect@feelzfilms.com?subject=Book%20a%20call"
              variant="primary"
              className="gap-2 rounded-full pl-7 pr-5"
            >
              Book a call
              <span className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-(--accent-text) text-(--accent)">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M1 7H13M13 7L7 1M13 7L7 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </MagneticButton>
            <MagneticButton to="/portfolio" variant="secondary" className="rounded-full">
              See our work
            </MagneticButton>
          </motion.div>

          {/* ---- The accounts, as rolling prisms: the platform on the front
                  face, the handle on the accent face behind it. ---- */}
          <motion.div {...rise(0.92)} className="mt-14 border-t border-(--hairline) pt-8">
            <div className="flex items-center gap-3">
              <span className="u-meta text-(--accent)">Follow along</span>
              <span aria-hidden className="h-px max-w-20 flex-1 bg-(--hairline)" />
            </div>

            <ul className="mt-5 flex flex-wrap items-center gap-3">
              {SOCIALS.map(({ Icon, label, handle, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${label} — ${handle}`}
                    className="prism cursor-hover-target block w-40"
                    style={{ ["--prism-h" as string]: "3.25rem" }}
                  >
                    {/* Both faces are decorative: the link's aria-label is the
                        accessible name, so neither is announced twice. */}
                    <span className="prism-body">
                      <span
                        aria-hidden
                        className="prism-face prism-front border border-(--hairline-strong) bg-(--bg) text-(--text)"
                      >
                        <Icon size={20} weight="fill" className="text-(--accent)" />
                        <span className="text-sm font-semibold">{label}</span>
                      </span>

                      <span
                        aria-hidden
                        className="prism-face prism-back bg-(--accent) text-(--accent-text) shadow-[0_18px_34px_-18px_rgba(42,86,232,0.85)]"
                      >
                        <span className="u-meta">{handle}</span>
                        <ArrowUpRight size={15} weight="bold" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

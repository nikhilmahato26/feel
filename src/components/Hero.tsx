"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

/**
 * Social presence. Handles are placeholders until the real accounts are
 * confirmed — update the four hrefs here and nowhere else.
 */
const SOCIALS = [
  { Icon: InstagramLogo, label: "Instagram", href: "https://instagram.com/feelzfilms" },
  { Icon: LinkedinLogo, label: "LinkedIn", href: "https://linkedin.com/company/feelzfilms" },
  { Icon: YoutubeLogo, label: "YouTube", href: "https://youtube.com/@feelzfilms" },
];

interface Panel {
  label: string;
  rows: string[];
  /** Placement inside the 3D stage, in px, before the responsive scale. */
  x: number;
  y: number;
  z: number;
  ry: number;
  w: number;
  accent?: boolean;
  /** Seconds for one float cycle — varied so panels never bob in lockstep. */
  float: number;
}

/**
 * The offer stack, arranged as depth rather than as a list. Deliberately no
 * figures on these panels: invented metrics would read as client results.
 */
const PANELS: Panel[] = [
  {
    label: "Content engine",
    rows: ["Positioning", "Production", "Distribution"],
    x: 0,
    y: 8,
    z: 130,
    ry: -6,
    w: 254,
    accent: true,
    float: 7.5,
  },
  { label: "Short-form", rows: ["Hooks", "Cutdowns"], x: -168, y: -128, z: 30, ry: 16, w: 168, float: 9 },
  { label: "Long-form", rows: ["YouTube", "Podcast"], x: 176, y: -74, z: 60, ry: -18, w: 168, float: 8.2 },
  { label: "Demand", rows: ["Inbound", "Pipeline"], x: -104, y: 168, z: 78, ry: 10, w: 176, float: 10 },
];

function StagePanel({ panel, reduce }: { panel: Panel; reduce: boolean | null }) {
  const { label, rows, x, y, z, ry, w, accent, float } = panel;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        // Placement only. The float lives on the child so the two transforms
        // never fight over the same property.
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(2deg)`,
        transformStyle: "preserve-3d",
        width: w,
      }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -11, 0] }}
        transition={{ duration: float, repeat: Infinity, ease: "easeInOut" }}
        className={`rounded-xl border p-4 ${
          accent
            ? "border-transparent text-(--hero-text)"
            : "border-(--hairline-strong) bg-(--surface)/85 backdrop-blur-md"
        }`}
        style={{
          boxShadow: accent ? "0 30px 60px -24px rgba(42,86,232,0.6)" : "var(--shadow-md)",
          background: accent
            ? "linear-gradient(150deg, var(--color-accent), var(--color-accent-2))"
            : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={`u-meta ${accent ? "" : "text-(--text-secondary)"}`}>{label}</span>
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${accent ? "bg-(--hero-text)" : "bg-(--accent)"}`}
          />
        </div>

        <ul className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <li key={r} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={`h-px flex-none ${accent ? "bg-(--hero-text)/70" : "bg-(--accent)"}`}
                style={{ width: 14 + i * 8 }}
              />
              <span
                className={`text-[0.8125rem] font-medium ${accent ? "" : "text-(--text-secondary)"}`}
              >
                {r}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer parallax. Written to motion values rather than state so moving the
  // cursor across the hero never triggers a render.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-15, 15]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring);

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

  // Scroll-linked depth: the stage sinks away, the copy lifts, the whole
  // opening softens as it leaves.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageZ = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -220]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -54]);
  const fade = useTransform(scrollYProgress, [0, 0.9], reduce ? [1, 1] : [1, 0.3]);

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
      className="relative overflow-hidden border-b border-(--border)"
    >
      {/* ---- Depth field: accent bloom, then a floor receding to a horizon ---- */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[38rem] w-[38rem] rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 62%)" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 md:h-80"
        style={{ perspective: "520px", perspectiveOrigin: "50% 0%" }}
      >
        <div
          className={reduce ? "" : "grid-drift"}
          style={{
            position: "absolute",
            inset: "0 -25%",
            transform: "rotateX(72deg)",
            transformOrigin: "50% 100%",
            backgroundImage:
              "linear-gradient(to right, var(--hairline-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--hairline-strong) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(to top, #000 5%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to top, #000 5%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative max-w-285 mx-auto grid items-center gap-4 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] min-h-[86vh] py-20 md:py-24">
        {/* ---- The argument ---- */}
        <motion.div style={{ y: copyY, opacity: fade }} className="relative z-10">
          <motion.div {...rise(0.05)} className="flex items-center gap-3 mb-7">
            <span aria-hidden className="w-6 h-px bg-(--accent)" />
            <span className="u-meta text-(--accent)">Marketing · Content · Growth</span>
          </motion.div>

          <h1 className="u-display text-[clamp(2.5rem,1.7rem+3.1vw,4.5rem)] leading-[0.98] max-w-[17ch]">
            <TextReveal text="Marketing that makes your expertise impossible to ignore." delay={0.2} trigger="mount" />
          </h1>

          <motion.p
            {...rise(0.6)}
            className="mt-7 text-base md:text-lg text-(--text-secondary) max-w-[48ch] leading-relaxed"
          >
            We run the content engine behind founders and executives: positioning, production and
            distribution as one system, built to turn attention into pipeline.
          </motion.p>

          <motion.div {...rise(0.78)} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="mailto:connect@feelzfilms.com?subject=Book%20a%20call"
              variant="primary"
              className="gap-2 rounded-full pl-7 pr-5"
            >
              Book a call
              <span className="w-7 h-7 rounded-full bg-(--accent-text) text-(--accent) flex items-center justify-center ml-2">
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

          {/* ---- Social presence, sitting on its own rule ---- */}
          <motion.div {...rise(0.92)} className="mt-12 flex items-center gap-5 flex-wrap">
            <span className="u-meta text-(--text-secondary) flex items-center gap-3">
              Follow
              <span aria-hidden className="h-px w-6 bg-(--hairline-strong)" />
            </span>
            <ul className="flex items-center gap-2.5">
              {SOCIALS.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    title={label}
                    className="cursor-hover-target group flex items-center gap-2 rounded-full border border-(--border) px-3.5 py-2.5 text-(--text-secondary) transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent)"
                  >
                    <Icon size={17} />
                    <span className="u-meta hidden sm:inline">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ---- The stage ---- */}
        <motion.div
          {...rise(0.35)}
          aria-hidden
          className="relative h-[24rem] sm:h-[28rem] lg:h-[32rem]"
          style={{ perspective: "1150px" }}
        >
          <motion.div
            className="absolute inset-0 scale-[0.62] sm:scale-[0.78] lg:scale-100"
            style={{ transformStyle: "preserve-3d", rotateX, rotateY, z: stageZ }}
          >
            {PANELS.map((p) => (
              <StagePanel key={p.label} panel={p} reduce={reduce} />
            ))}

            {/* Ground shadow, anchoring the stack to the floor. */}
            <span
              className="absolute top-1/2 left-1/2 h-24 w-72 -translate-x-1/2 rounded-[50%] opacity-40 blur-2xl"
              style={{
                transform: "translate(-50%, -50%) translate3d(0, 210px, 0) rotateX(76deg)",
                background: "radial-gradient(ellipse, var(--color-accent), transparent 70%)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";
import AcademyLeader from "./AcademyLeader";

/** Thin L-shaped registration marks, the kind that sit outside a print trim. */
function CropMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute w-4 h-4 opacity-40 ${className}`}>
      <span className="absolute inset-x-0 top-0 h-px bg-(--hero-text)" />
      <span className="absolute inset-y-0 left-0 w-px bg-(--hero-text)" />
    </span>
  );
}

/** Perforations down the plate edge, advancing like film through a gate. */
function Sprockets({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`absolute top-0 bottom-0 w-4 overflow-hidden hidden md:block ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {/* 40 holes = two identical runs of 20, so the -50% loop is seamless. */}
      <div className="film-advance flex flex-col gap-3">
        {Array.from({ length: 40 }, (_, i) => (
          <span key={i} className="shrink-0 h-4 rounded-[2px] bg-(--hero-text) opacity-20" />
        ))}
      </div>
    </div>
  );
}

const META = [
  { k: "Est.", v: "New Delhi" },
  { k: "Serving", v: "US · UK · CA · AU · UAE · IN" },
  { k: "Practice", v: "Strategy → Production → Distribution" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // The plate opens on a countdown leader, then cuts to the wordmark. Reduced
  // motion skips straight to the brand.
  const [rolling, setRolling] = useState(!reduce);
  const [take, setTake] = useState(0);
  const finish = useCallback(() => setRolling(false), []);
  const replay = useCallback(() => {
    if (reduce) return;
    setTake((t) => t + 1);
    setRolling(true);
  }, [reduce]);

  // Scroll-linked parallax: the plate sinks, the argument lifts, and the whole
  // opening softens as it leaves. Small offsets — enough to feel, not to notice.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const markY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 44]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -46]);
  const fade = useTransform(scrollYProgress, [0, 0.85], reduce ? [1, 1] : [1, 0.35]);
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section ref={sectionRef} className="border-b border-(--border)">
      <div className="flex flex-col md:flex-row min-h-130">
        {/* Left plate: the wordmark, framed like artwork rather than floated. */}
        <div
          className="relative w-full md:w-[38%] min-h-56 overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(160deg, var(--hero-panel), var(--hero-panel-2))" }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              y: plateY,
              backgroundImage:
                "linear-gradient(to right, var(--hero-text) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-text) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <motion.div
            aria-hidden
            style={{
              y: plateY,
              background: "radial-gradient(circle, var(--orb), transparent 66%)",
            }}
            className="orb-float absolute -top-24 -left-20 w-96 h-96 rounded-full opacity-[0.13]"
          />

          <Sprockets side="left" />

          <CropMark className="top-6 left-6" />
          <CropMark className="top-6 right-6 rotate-90" />
          <CropMark className="bottom-6 right-6 rotate-180" />
          <CropMark className="bottom-6 left-6 -rotate-90" />

          {/* Dissolve the plate into the page rather than cutting it hard
              against the headline. Horizontal on the split layout, vertical
              once the plate stacks above the copy. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-28 lg:w-36 hidden md:block"
            style={{ background: "linear-gradient(to right, transparent, var(--bg))" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 md:hidden"
            style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
          />

          {/* Roll it again. */}
          <button
            type="button"
            onClick={replay}
            aria-label="Replay the countdown"
            className="cursor-hover-target group absolute top-5 left-12 z-30 u-meta text-(--hero-text) opacity-0 hover:opacity-90 focus-visible:opacity-90 transition-opacity duration-300 md:opacity-40"
          >
            Replay
          </button>

          {/* Caption box — micro copy held in a drawn rectangle. */}
          <div className="absolute bottom-16 left-6 max-w-[19rem] hidden md:flex items-stretch text-(--hero-text) opacity-70">
            <span className="u-meta flex items-center border border-(--hero-text)/50 px-2 py-2">FF</span>
            <span className="u-meta border-y border-r border-(--hero-text)/50 px-3 py-2 leading-[1.5] max-w-64">
              Content partner for founders and executives — strategy, production, distribution
            </span>
          </div>

          <AnimatePresence mode="wait">
            {rolling ? (
              <motion.div
                key={`leader-${take}`}
                className="absolute inset-0 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AcademyLeader onDone={finish} />
              </motion.div>
            ) : (
              /* Shutter flash on the cut. */
              <motion.span
                key={`flash-${take}`}
                aria-hidden
                className="absolute inset-0 z-20 pointer-events-none bg-(--hero-text)"
                initial={reduce ? { opacity: 0 } : { opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>

          <motion.div
            key={`brand-${take}`}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: rolling ? 0 : 1, scale: rolling ? 0.96 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: markY }}
            className="relative z-10 text-center text-(--hero-text) px-6"
          >
            <div className="font-display font-extrabold text-3xl md:text-[2.6rem] leading-[1.02] tracking-[-0.02em]">
              FEELZ
              <br />
              FILMS
            </div>
            <div aria-hidden className="mx-auto mt-5 h-px w-12 bg-(--hero-text) opacity-45" />
            <div className="mt-6 flex justify-center">
              <span className="u-meta inline-block rounded-[50%] border border-(--hero-text) px-6 py-3 opacity-90 -rotate-6">
                Since day one
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right plate: the argument. */}
        <motion.div
          style={{ y: copyY, opacity: fade }}
          className="flex-1 flex flex-col justify-center px-6 py-16 md:px-16 md:py-20"
        >
          <motion.div {...rise(0.45)} className="flex items-center gap-3 mb-7">
            <span aria-hidden className="w-6 h-px bg-(--accent)" />
            <span className="u-meta text-(--accent)">Content · Personal branding · Video</span>
          </motion.div>

          <h1 className="u-display text-[clamp(2.6rem,1.9rem+3.2vw,4.75rem)] leading-[0.97] max-w-[15ch]">
            <TextReveal text="Your expertise deserves to be seen." delay={0.6} trigger="mount" />
          </h1>

          <motion.p
            {...rise(1.0)}
            className="mt-7 text-base md:text-lg text-(--text-secondary) max-w-[46ch] leading-relaxed"
          >
            We turn founder and executive expertise into content that builds authority, trust and
            inbound opportunity.
          </motion.p>

          <motion.div {...rise(1.2)} className="mt-10 flex flex-wrap items-center gap-4">
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
            <MagneticButton href="#portfolio" variant="secondary" className="rounded-full">
              See our work
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Specimen rail — the detail that reads as art direction rather than decoration. */}
      <motion.dl
        {...rise(1.4)}
        className="grid grid-cols-1 sm:grid-cols-3 border-t border-(--border) divide-y sm:divide-y-0 sm:divide-x divide-(--border)"
      >
        {META.map((m) => (
          <div key={m.k} className="px-6 md:px-8 py-5 flex flex-col gap-1.5">
            <dt className="u-meta text-(--text-secondary)">{m.k}</dt>
            <dd className="text-sm font-medium">{m.v}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}

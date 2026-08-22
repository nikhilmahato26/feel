"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import SectionHeader from "./SectionHeader";
import YouTubeFrame from "./YouTubeFrame";
import Tilt3D from "./Tilt3D";

interface Chapter {
  k: string;
  title: string;
  description: string;
  /**
   * YouTube ID for this chapter. Empty until the films are published — the
   * frame stays reserved and switches to a real player the moment one lands.
   */
  youtubeId?: string;
}

const chapters: Chapter[] = [
  {
    k: "01",
    title: "Your Expertise Deserves to Be Seen",
    description:
      "Your expertise, experience and ideas are valuable. But if they aren't being seen, they aren't building the trust, credibility and opportunities they could.",
    youtubeId: "",
  },
  {
    k: "02",
    title: "What Do We Actually Do?",
    description:
      "We turn what you know into content that gets noticed, builds authority and keeps your brand relevant.",
    youtubeId: "",
  },
  {
    k: "03",
    title: "The Result",
    description:
      "One team taking your content from strategy to screen to distribution, built to create visibility, credibility and business opportunities.",
    youtubeId: "",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // The rule fills as you travel through the chapters rather than firing once
  // on entry, so the sequence reads as something you are moving along.
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const scaleX = useTransform(fill, (v) => (reduce ? 1 : v));

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-(--bg-alt) border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <SectionHeader
          index="02"
          label="How it works"
          title="Who we are? What we solve? What you get?"
          lede="Three short films, in order. Watch them back to back and you have the whole picture."
          align="center"
          className="mb-16 md:mb-20"
        />

        {/* Process rule: fills with scroll, with a tick above each chapter. */}
        <div className="relative mb-px" aria-hidden>
          <div className="h-px w-full bg-(--hairline)" />
          <motion.div
            className="absolute inset-y-0 left-0 h-px w-full bg-(--accent) origin-left"
            style={{ scaleX }}
          />
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 md:divide-x divide-(--hairline)">
          {chapters.map((c, i) => (
            <motion.article
              key={c.k}
              initial={
                reduce ? false : { opacity: 0, y: 34, rotateY: -14, transformPerspective: 1100 }
              }
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              // Staggered by index so the three always resolve 01 → 02 → 03,
              // however far down the page you enter them.
              transition={{ duration: 0.8, delay: 0.15 + i * 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="group relative pt-10 pb-10 md:px-8 md:first:pl-0 md:last:pr-0 border-b border-(--hairline) md:border-b-0"
            >
              {/* Tick sitting on the rule above this column. */}
              <span
                aria-hidden
                className="absolute -top-px left-0 md:left-8 md:group-first:left-0 h-3 w-px bg-(--accent) -translate-y-full"
              />

              <Tilt3D className="mb-7" glare={false}>
                <YouTubeFrame
                  id={c.youtubeId}
                  index={c.k}
                  title={c.title}
                  className="aspect-video"
                />
              </Tilt3D>

              <div className="flex items-baseline gap-4">
                <span className="u-index text-(--accent)">{c.k}</span>
                <span className="u-meta text-(--text-secondary)">Video {c.k}</span>
              </div>

              <h3 className="font-display font-semibold text-xl md:text-2xl tracking-[-0.02em] mt-5 mb-3">
                {c.title}
              </h3>

              <p className="text-sm md:text-base leading-relaxed text-(--text-secondary) max-w-[38ch]">
                {c.description}
              </p>

              <span
                aria-hidden
                className="mt-7 block h-px w-8 bg-(--accent) origin-left transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[3.5]"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

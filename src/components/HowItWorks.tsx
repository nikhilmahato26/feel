"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import SectionHeader from "./SectionHeader";

interface Step {
  k: string;
  title: string;
  question: string;
  description: string;
}

const steps: Step[] = [
  {
    k: "01",
    title: "Team & approach",
    question: "Who we are",
    description:
      "A dedicated team acting as your content partner rather than a rotating cast of freelancers.",
  },
  {
    k: "02",
    title: "Strategy → production",
    question: "How we work",
    description:
      "From initial concept to full-scale production, planned and executed by one team, internally.",
  },
  {
    k: "03",
    title: "Results & delivery",
    question: "What you get",
    description:
      "Tangible business growth, and a library of assets that keeps working long after delivery.",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // The rule fills as you travel through the steps rather than firing once on
  // entry, so the process reads as something you are moving along.
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const scaleX = useTransform(fill, (v) => (reduce ? 1 : v));

  return (
    <section className="py-24 md:py-32 bg-(--bg-alt) border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <SectionHeader
          index="02"
          label="How it works"
          title="Who we are. How we work. What you get."
          align="center"
          className="mb-16 md:mb-20"
        />

        {/* Process rule: fills with scroll, with a tick above each step. */}
        <div className="relative mb-px" aria-hidden>
          <div className="h-px w-full bg-(--hairline)" />
          <motion.div
            className="absolute inset-y-0 left-0 h-px w-full bg-(--accent) origin-left"
            style={{ scaleX }}
          />
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 md:divide-x divide-(--hairline)">
          {steps.map((s, i) => (
            <motion.article
              key={s.k}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative pt-10 pb-10 md:px-8 md:first:pl-0 md:last:pr-0 border-b border-(--hairline) md:border-b-0"
            >
              {/* Tick sitting on the rule above this column. */}
              <span
                aria-hidden
                className="absolute -top-px left-0 md:left-8 md:group-first:left-0 h-3 w-px bg-(--accent) -translate-y-full"
              />

              <div className="flex items-baseline gap-4">
                <span className="u-index text-(--accent)">{s.k}</span>
                <span className="u-meta text-(--text-secondary) opacity-70">{s.question}</span>
              </div>

              <h3 className="font-display font-semibold text-xl md:text-2xl tracking-[-0.02em] mt-5 mb-3">
                {s.title}
              </h3>

              <p className="text-sm md:text-base leading-relaxed text-(--text-secondary) max-w-[38ch]">
                {s.description}
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

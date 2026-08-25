"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import Counter from "./Counter";
import ScrollStage from "./ScrollStage";

const stats: Array<{
  n: string;
  count?: { to: number; pad?: number; decimals?: number; suffix?: string };
  l: string;
}> = [
  { n: "6800+", count: { to: 6800, suffix: "+" }, l: "Videos created" },
  { n: "240+", count: { to: 240, suffix: "+" }, l: "Clients served" },
  { n: "56.8M+", count: { to: 56.8, decimals: 1, suffix: "M+" }, l: "Views" },
];

export default function About() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // The two columns travel at different rates, so the argument and the figures
  // sit on separate planes rather than on one flat sheet.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [26, -26]);
  const statsY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-14 md:py-24 border-b border-(--border)"
    >
      {/* A pane of accent light behind the figures, set far back. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-0 h-[26rem] w-[26rem] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 65%)" }}
      />

      <ScrollStage amount={0.6}>
      <div className="relative max-w-285 mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-12 gap-x-12 gap-y-14">
          <motion.div style={{ y: copyY }} className="md:col-span-7">
            <SectionHeader
              index="01"
              label="About"
              title="Not a production house. The marketing team behind your name."
            />

            <Reveal delay={0.1}>
              <p className="mt-8 text-base md:text-lg leading-relaxed text-(--text-secondary) max-w-[54ch]">
                We don't start with,{" "}
                <em className="not-italic text-(--text) font-medium">
                  &ldquo;How do we make this video?&rdquo;
                </em>{" "}
                We start with,{" "}
                <em className="not-italic text-(--text) font-medium">
                  &ldquo;How does this content move the business forward?&rdquo;
                </em>
              </p>

              <p className="mt-6 text-base md:text-lg leading-relaxed text-(--text-secondary) max-w-[54ch]">
                That mindset shapes our entire approach, from strategy and production to editing and
                distribution, all handled by one team with one vision, instead of five disconnected
                freelancers.
              </p>
            </Reveal>
          </motion.div>

          <motion.div style={{ y: statsY }} className="md:col-span-5 md:pt-2">
            <RevealGroup className="depth-scene" stagger={0.08}>
              {stats.map((s, i) => (
                <RevealItem key={s.l}>
                  <div className="depth-cell group relative grid grid-cols-[auto_1fr] gap-x-5 items-baseline bg-(--bg) px-4 -mx-4 py-6 border-t border-(--hairline) last:border-b">
                    <span className="u-index text-(--text-secondary) opacity-50 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em] tabular-nums transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        {s.count ? (
                          <Counter
                            to={s.count.to}
                            pad={s.count.pad}
                            decimals={s.count.decimals}
                            suffix={s.count.suffix}
                          />
                        ) : (
                          s.n
                        )}
                      </div>
                      <div className="u-meta mt-3 text-(--accent)">{s.l}</div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </motion.div>
        </div>
      </div>
      </ScrollStage>
    </section>
  );
}

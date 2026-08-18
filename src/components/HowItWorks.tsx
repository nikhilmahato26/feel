"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { label: "Who we are", title: "Team & approach" },
  { label: "How we work", title: "Strategy → production → delivery" },
  { label: "What we deliver", title: "Results, in clients' words" },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(".connector-path");
      const glows = gsap.utils.toArray<HTMLElement>(".step-node-glow");

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(glows, { opacity: 0, scale: 0.75 });
      gsap.set(".step-node-glow[data-first]", { opacity: 1, scale: 1.1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      paths.forEach((path, i) => {
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, i);
        if (glows[i + 1]) {
          tl.to(glows[i + 1], { opacity: 1, scale: 1.1, ease: "power2.out", duration: 0.4 }, i + 0.65);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-(--bg-alt)">
      <div className="max-w-300 mx-auto px-6 md:px-8">
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="text-xs tracking-[0.15em] font-bold text-(--accent) uppercase mb-4">How it works</p>
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.5rem+2vw,3rem)] tracking-tight text-(--text) text-balance">
            Who we are. How we work. What you get.
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="contents md:flex md:items-start md:flex-1 relative">
              <div className="flex flex-col items-center w-full max-w-[340px] mx-auto z-10 group">
                <div className="w-full glass-card bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-gray-100 shadow-sm transition-transform duration-500 group-hover:-translate-y-1 relative overflow-hidden">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-(--accent) text-white flex items-center justify-center mb-4 shadow-(--shadow-md) transition-transform duration-500 group-hover:scale-110">
                    <Play size={24} weight="fill" />
                  </div>
                  <h3 className="relative z-10 font-semibold text-gray-600 text-sm md:text-base">{step.label}</h3>
                </div>
                <p className="mt-6 font-bold text-gray-900 text-sm md:text-base text-center">{step.title}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:block flex-[0.6] h-10 shrink-0 mt-[4.5rem] relative -mx-8 z-0">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                      <filter id={`line-glow-${i}`} x="-50%" y="-200%" width="200%" height="500%">
                        <feGaussianBlur stdDeviation="1.4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path d="M0,5 L100,5" stroke="var(--border)" strokeWidth="1.5" fill="none" />
                    <path
                      className="connector-path"
                      d="M0,5 L100,5"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      fill="none"
                      filter={`url(#line-glow-${i})`}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

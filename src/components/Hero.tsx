"use client";

import { motion, useReducedMotion } from "motion/react";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="flex flex-col md:flex-row min-h-130">
      <div
        className="relative w-full md:w-[38%] min-h-50 overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, var(--hero-panel), var(--hero-panel-2))" }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, x: -24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <div className="orb-float absolute rounded-full bg-(--orb) opacity-10 w-55 h-55 -top-12 -left-12" />
          <div
            className="orb-float absolute rounded-full bg-(--orb) opacity-10 w-35 h-35 -bottom-6 -right-6"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="orb-float absolute rounded-full bg-(--orb) opacity-10 w-20 h-20 bottom-10 left-10"
            style={{ animationDelay: "4s" }}
          />
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, x: -24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center font-display font-extrabold text-3xl md:text-4xl leading-[1.05] text-(--hero-text)"
        >
          FEELZ
          <br />
          FILMS
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-14 md:px-16 md:py-16">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.14em] uppercase text-(--accent) font-semibold mb-5"
        >
Content, personal branding, video
        </motion.p>

        <h1 className="font-display font-extrabold text-[clamp(2.6rem,1.9rem+3.2vw,4.75rem)] leading-[0.98] tracking-[-0.03em] max-w-[16ch]">
          <TextReveal text="Your expertise deserves to be seen." delay={0.7} trigger="mount" />
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 text-base md:text-lg text-(--text-secondary) max-w-[46ch] leading-relaxed"
        >
          We turn founder and executive expertise into content that builds authority, trust and inbound opportunity.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <MagneticButton href="mailto:connect@feelzfilms.com?subject=Book%20a%20call" variant="primary" className="gap-2 rounded-[2rem] pl-7 pr-5">
            Book a call
            <span className="w-7 h-7 rounded-full bg-(--accent-text) text-(--accent) flex items-center justify-center ml-2">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </MagneticButton>
          <MagneticButton href="#portfolio" variant="secondary" className="rounded-[2rem]">
            See our work
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

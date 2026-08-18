"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className = "", delay = 0, y = 28 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function RevealGroup({ children, className = "", stagger = 0.1 }: RevealGroupProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={
        reduce
          ? undefined
          : {
              hidden: {},
              show: { transition: { staggerChildren: stagger } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", y = 24 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

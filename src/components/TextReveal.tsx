"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: "mount" | "inView";
}

export default function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  trigger = "inView",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    const Comp = Tag as ElementType;
    return <Comp className={className}>{text}</Comp>;
  }

  const Comp = Tag as ElementType;
  const viewportProps =
    trigger === "inView" ? { whileInView: "shown", viewport: { once: true, amount: 0.4 } } : { animate: "shown" };

  return (
    <Comp className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top mr-[0.28em]">
          <motion.span
            className="inline-block"
            initial="hidden"
            variants={{
              hidden: { y: "115%", opacity: 0 },
              shown: { y: "0%", opacity: 1 },
            }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.035,
              ease: [0.16, 1, 0.3, 1],
            }}
            {...viewportProps}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}

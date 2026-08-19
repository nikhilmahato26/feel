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
  const Comp = Tag as ElementType;

  if (reduce) {
    return <Comp className={className}>{text}</Comp>;
  }

  // The trigger lives on this wrapper rather than on the words themselves:
  // each word is translated fully outside an overflow-hidden mask, so an
  // observer attached to the word would see it as clipped and never fire.
  const triggerProps =
    trigger === "inView"
      ? { whileInView: "shown" as const, viewport: { once: true, amount: 0.2 } }
      : { animate: "shown" as const };

  return (
    <Comp className={className}>
      <motion.span initial="hidden" {...triggerProps} className="inline">
        {words.map((word, i) => (
          // The literal space between mask spans keeps real word breaks in the
          // DOM, so the headline stays selectable, copyable and readable aloud.
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.1em] align-top">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "115%", opacity: 0 },
                  shown: { y: "0%", opacity: 1 },
                }}
                transition={{
                  duration: 0.75,
                  delay: delay + i * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Comp>
  );
}

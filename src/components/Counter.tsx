"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CounterProps {
  to: number;
  /** Zero-pad the result to this many digits, e.g. pad={2} renders 6 as "06". */
  pad?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Tallies up to its value the first time it enters view. */
export default function Counter({ to, pad = 0, suffix = "", duration = 1.4, className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {String(value).padStart(pad, "0")}
      {suffix}
    </span>
  );
}

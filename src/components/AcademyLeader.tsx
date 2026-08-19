"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AcademyLeaderProps {
  onDone: () => void;
  /** Seconds each number holds. One sweep of the wiper per count. */
  perCount?: number;
  from?: number;
}

/** Evenly spaced ticks around the dial, long ones on the quarters. */
const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

/**
 * The countdown leader spliced onto the head of a film reel: concentric rings,
 * a crosshair, a wiper sweeping once per second, and the number counting down.
 * Runs once, then hands the plate over to the wordmark.
 */
export default function AcademyLeader({ onDone, perCount = 0.62, from = 3 }: AcademyLeaderProps) {
  const [n, setN] = useState(from);

  useEffect(() => {
    if (n <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setN((v) => v - 1), perCount * 1000);
    return () => clearTimeout(t);
  }, [n, perCount, onDone]);

  return (
    <div className="absolute inset-0 grid place-items-center text-(--hero-text)">
      <svg viewBox="0 0 200 200" className="w-[min(78%,20rem)] h-auto" aria-hidden>
        {/* Crosshair running the full frame */}
        <g stroke="currentColor" strokeWidth="0.75" opacity="0.35">
          <line x1="100" y1="0" x2="100" y2="200" />
          <line x1="0" y1="100" x2="200" y2="100" />
        </g>

        {/* Dial */}
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="92" opacity="0.55" />
          <circle cx="100" cy="100" r="66" opacity="0.3" />
          <circle cx="100" cy="100" r="40" opacity="0.2" />
        </g>

        <g stroke="currentColor" strokeWidth="1" opacity="0.45">
          {TICKS.map((deg) => {
            const isQuarter = deg % 90 === 0;
            const r1 = isQuarter ? 78 : 85;
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={100 + Math.cos(rad) * r1}
                y1={100 + Math.sin(rad) * r1}
                x2={100 + Math.cos(rad) * 92}
                y2={100 + Math.sin(rad) * 92}
              />
            );
          })}
        </g>

        {/* The count */}
        <AnimatePresence mode="popLayout">
          <motion.text
            key={n}
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display"
            style={{ fontWeight: 800, fontSize: 92, letterSpacing: "-0.04em" }}
            fill="currentColor"
            initial={{ opacity: 0, scale: 1.35 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {n}
          </motion.text>
        </AnimatePresence>
      </svg>
    </div>
  );
}

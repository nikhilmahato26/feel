"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/* ---------------------------------------------------------------
   One depth model, shared by every section.

   Content arrives tipped slightly forward from below, settles dead
   flat while you read it, then sinks back as it leaves. Because every
   section uses these same numbers and the same travel windows, the
   outgoing block and the incoming one are always at mirrored angles
   at the moment they cross — which is what makes the hand-off read as
   one continuous space rather than a series of separate effects.

   Deliberately applied to each section's content, not to the section
   itself: transforming the full-bleed blocks would open hairline gaps
   between their backgrounds at every boundary.
   --------------------------------------------------------------- */

/** Degrees of tip on the way in and on the way out. */
const TILT_IN = 7;
const TILT_OUT = -5.5;
/** Vertical travel, px. */
const RISE = 54;
const SINK = -38;
/** How far back it sits at each end, px. */
const DEPTH_IN = -90;
const DEPTH_OUT = -80;

interface ScrollStageProps {
  children: ReactNode;
  className?: string;
  /**
   * Scales the whole effect. 1 is the house setting; lower it for blocks that
   * already carry their own motion so the two don't compound.
   */
  amount?: number;
  /** Perspective on the stage. Shorter is more dramatic. */
  perspective?: number;
}

export default function ScrollStage({
  children,
  className = "",
  amount = 1,
  perspective = 1500,
}: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Two fixed windows, each a slice of viewport height rather than a fraction
  // of the section — so a short block and a tall one move at the same rate.
  const { scrollYProgress: entering } = useScroll({
    target: ref,
    offset: ["start end", "start 55%"],
  });
  const { scrollYProgress: leaving } = useScroll({
    target: ref,
    offset: ["end 45%", "end start"],
  });

  // Fold both into one axis: -1 waiting below, 0 settled, +1 gone above.
  // The windows can never overlap, so only one is ever mid-travel.
  //
  // Both values are read on every pass, never short-circuited: this form of
  // useTransform works out its dependencies from the values the function
  // touches, so a branch that skips one would silently stop tracking it.
  const t = useTransform(() => {
    const arriving = entering.get();
    const departing = leaving.get();
    return departing > 0 ? departing : arriving - 1;
  });

  const k = reduce ? 0 : amount;
  const rotateX = useTransform(t, [-1, 0, 1], [TILT_IN * k, 0, TILT_OUT * k]);
  const y = useTransform(t, [-1, 0, 1], [RISE * k, 0, SINK * k]);
  const z = useTransform(t, [-1, 0, 1], [DEPTH_IN * k, 0, DEPTH_OUT * k]);
  const opacity = useTransform(t, [-1, -0.55, 0, 0.55, 1], reduce ? [1, 1, 1, 1, 1] : [0.35, 0.92, 1, 0.96, 0.55]);

  // Keep the ref attached either way, so useScroll always has a real target.
  if (reduce)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );

  return (
    <div ref={ref} className={className} style={{ perspective: `${perspective}px` }}>
      {/* Intentionally no preserve-3d: the section should tip as one flat
          sheet. Nested effects (tilt cards, the lifting service boxes) carry
          their own perspective, so they keep working inside it. */}
      <motion.div style={{ rotateX, y, z, opacity }}>{children}</motion.div>
    </div>
  );
}

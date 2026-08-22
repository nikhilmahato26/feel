"use client";

import { useCallback } from "react";
import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the edges of the element. */
  max?: number;
  /** How far the content lifts toward the viewer while pointed at, in px. */
  lift?: number;
  /** Sheen that tracks the pointer. Off for content that already has an overlay. */
  glare?: boolean;
}

/**
 * Pointer-driven 3D tilt. The rotation is written to motion values rather than
 * state, so tracking the cursor across a card never triggers a render, and it
 * collapses to a plain wrapper when reduced motion is requested.
 */
export default function Tilt3D({
  children,
  className = "",
  max = 9,
  lift = 26,
  glare = true,
}: Tilt3DProps) {
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const active = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const z = useSpring(useTransform(active, [0, 1], [0, lift]), spring);

  const glareOpacity = useSpring(useTransform(active, [0, 1], [0, 0.14]), spring);
  const glareBg = useTransform(
    [px, py],
    ([gx, gy]: number[]) =>
      `radial-gradient(220px circle at ${(gx + 0.5) * 100}% ${(gy + 0.5) * 100}%, #fff, transparent 70%)`,
  );

  const handleMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
      active.set(1);
    },
    [active, px, py, reduce],
  );

  const handleLeave = useCallback(() => {
    px.set(0);
    py.set(0);
    active.set(0);
  }, [active, px, py]);

  // Every hook above runs unconditionally; only the output changes.
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={{ perspective: "900px" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", rotateX, rotateY, z }}
      >
        {children}

        {glare ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{ opacity: glareOpacity, background: glareBg }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { useFinePointer } from "../lib/useFinePointer";

interface VideoCardProps {
  label: string;
  /** Two-digit slot index shown in the frame's top-left corner. */
  index: string;
  className?: string;
  featured?: boolean;
}

/**
 * A reserved video frame. Until real footage lands, the slot is drawn as a
 * proper film frame — indexed, with slate metadata — rather than a grey box.
 * Drop a <video>/poster <img> behind the overlay to fill it.
 *
 * On a fine pointer the play affordance detaches and trails the cursor inside
 * the frame; on touch it stays centred where a thumb expects it.
 */
export default function VideoCard({ label, index, className = "", featured = false }: VideoCardProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isFine = useFinePointer();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const follow = isFine && !reduce;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    if (!follow || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  function handleEnter(e: MouseEvent<HTMLButtonElement>) {
    // Seed the position before showing, so the badge doesn't fly in from 0,0.
    if (follow && ref.current) {
      const r = ref.current.getBoundingClientRect();
      x.jump(e.clientX - r.left);
      y.jump(e.clientY - r.top);
    }
    setHovered(true);
  }

  const size = featured ? 64 : 46;

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="none"
      aria-label={`Play ${label}`}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      className={`group relative w-full overflow-hidden rounded-lg border border-(--hairline-strong) bg-(--surface-sunken) text-left transition-[border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-(--accent) focus-visible:border-(--accent) ${className}`}
    >
      {/* Frame fill — the surface a poster image would replace. */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.55] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--hairline) 0 1px, transparent 1px 9px)",
        }}
      />

      {/* Slate metadata */}
      <span className="absolute top-3 left-3 u-index text-(--text-secondary) opacity-55">{index}</span>
      <span className="absolute top-3 right-3 u-meta text-(--text-secondary) opacity-40 tabular-nums">
        --:--
      </span>

      <span className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 py-8 text-center">
        {/* Static affordance — hidden once the trailing badge takes over. */}
        <span
          className={`grid place-items-center rounded-full border border-(--accent) text-(--accent) transition-opacity duration-300 ${
            featured ? "w-14 h-14" : "w-10 h-10"
          } ${follow && hovered ? "opacity-0" : "opacity-100"}`}
        >
          <Play size={featured ? 18 : 13} weight="fill" />
        </span>
        <span className="u-meta text-(--text-secondary) opacity-80">{label}</span>
      </span>

      {follow ? (
        <motion.span
          aria-hidden
          // top-0 left-0 anchors the transform to the frame's corner: the x/y
          // motion values are pointer offsets measured from exactly there.
          className="pointer-events-none absolute top-0 left-0 z-20 grid place-items-center rounded-full bg-(--accent) text-(--accent-text)"
          style={{
            x: springX,
            y: springY,
            width: size,
            height: size,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.4 }}
          initial={false}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="u-meta text-[0.5625rem]">Play</span>
        </motion.span>
      ) : null}

      {/* Accent hairline that wipes across the bottom on hover. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-(--accent) origin-left scale-x-0 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </button>
  );
}

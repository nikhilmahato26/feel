"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "../lib/useFinePointer";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverted";
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-(--accent) text-(--accent-text) shadow-[0_8px_24px_-10px_rgba(42,86,232,0.55)] hover:shadow-[0_16px_40px_-12px_rgba(42,86,232,0.65)]",
  secondary:
    "border border-(--border) text-(--text) hover:border-(--accent) hover:bg-(--accent-soft) hover:text-(--accent)",
  inverted:
    "bg-(--accent-text) text-(--accent) hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)]",
};

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: MagneticButtonProps) {
  const isFine = useFinePointer();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 250, damping: 20, mass: 0.5 });

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    if (!isFine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`cursor-hover-target inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-[15px] font-semibold whitespace-nowrap transition-[box-shadow,background-color,border-color,color] duration-300 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}

"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import { useFinePointer } from "../lib/useFinePointer";

/** Router-aware variant, so internal buttons don't reload the document. */
const MotionLink = motion.create(Link);

interface MagneticButtonProps {
  /** External or protocol link (mailto:, https:). Use `to` for in-app routes. */
  href?: string;
  /** In-app route path, e.g. "/portfolio". Takes precedence over `href`. */
  to?: string;
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
  to,
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

  const shared = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { x: springX, y: springY },
    whileTap: { scale: 0.96 },
    className: `cursor-hover-target inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-[15px] font-semibold whitespace-nowrap transition-[box-shadow,background-color,border-color,color] duration-300 ${variantClasses[variant]} ${className}`,
  } as const;

  if (to) {
    return (
      <MotionLink to={to} {...shared}>
        {children}
      </MotionLink>
    );
  }

  // A link off the site opens in its own tab, so a half-filled booking form
  // never costs someone the page they were reading. mailto: and in-page
  // anchors stay where they are — handing those to a new tab leaves a blank
  // one behind.
  const offSite = href?.startsWith("http");

  return (
    <motion.a
      href={href}
      {...(offSite ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...shared}
    >
      {children}
    </motion.a>
  );
}

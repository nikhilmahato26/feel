"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useFinePointer } from "../lib/useFinePointer";

export default function CustomCursor() {
  const isFine = useFinePointer();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringXRaw = useMotionValue(0);
  const ringYRaw = useMotionValue(0);
  const ringX = useSpring(ringXRaw, { stiffness: 300, damping: 30, mass: 0.6 });
  const ringY = useSpring(ringYRaw, { stiffness: 300, damping: 30, mass: 0.6 });

  const enabled = isFine && !reduce;
  const rootRef = useRef(document.documentElement);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    root.classList.add("has-fine-pointer");

    function handleMove(e: PointerEvent) {
      setActive(true);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringXRaw.set(e.clientX);
      ringYRaw.set(e.clientY);
    }

    window.addEventListener("pointermove", handleMove);

    const interactive = document.querySelectorAll("a, button, .cursor-hover-target");
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      root.classList.remove("has-fine-pointer", "cursor-active");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    rootRef.current.classList.toggle("cursor-active", active);
  }, [active]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          background: "var(--accent)",
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderStyle: "solid",
          borderWidth: 1.5,
        }}
        animate={{
          width: hovering ? 54 : 32,
          height: hovering ? 54 : 32,
          backgroundColor: hovering ? "var(--accent-soft)" : "rgba(0,0,0,0)",
          borderColor: hovering ? "rgba(0,0,0,0)" : "var(--accent)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        initial={false}
      />
    </>
  );
}

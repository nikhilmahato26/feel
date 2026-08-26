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

    // Delegated rather than bound to a snapshot of the DOM: elements that
    // arrive later (the lazily loaded map, conditional badges) are covered too.
    // Opting out with data-cursor="none" lets a component run its own hover
    // affordance without the ring fighting it.
    function isTarget(node: EventTarget | null) {
      if (!(node instanceof Element)) return false;
      const hit = node.closest("a, button, .cursor-hover-target");
      return !!hit && !hit.closest('[data-cursor="none"]');
    }

    const onOver = (e: PointerEvent) => {
      if (isTarget(e.target)) setHovering(true);
    };
    const onOut = (e: PointerEvent) => {
      if (isTarget(e.target) && !isTarget(e.relatedTarget)) setHovering(false);
    };

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
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
      {/* Both parts are white on purpose: the blend mode in index.css turns
          white into "invert whatever is behind me". A coloured cursor would
          blend to an arbitrary third colour instead. */}
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          background: "#fff",
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
          // 44 rather than the old 54: even inverted, a smaller disc leaves
          // more of the label it's sitting on legible.
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          // Held in white with only alpha moving, so the fade doesn't pass
          // through grey — which under `difference` would read as a dirty
          // flicker rather than a clean fill.
          backgroundColor: hovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
          borderColor: hovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        initial={false}
      />
    </>
  );
}

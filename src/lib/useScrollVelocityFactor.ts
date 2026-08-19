import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Tracks how hard the page is being scrolled and exposes a multiplier that
 * rises with speed then eases back to 1. Returned as a ref rather than state:
 * consumers read it inside their own animation frame, so nothing re-renders.
 */
export function useScrollVelocityFactor(max = 3.5): RefObject<number> {
  const factor = useRef(1);
  const target = useRef(1);
  const lastY = useRef(0);
  const lastT = useRef(0);

  useEffect(() => {
    let raf = 0;

    function onScroll() {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT.current;
      if (dt > 0) {
        const speed = Math.abs(y - lastY.current) / dt; // px per ms
        target.current = Math.min(1 + speed * 1.4, max);
      }
      lastY.current = y;
      lastT.current = now;
    }

    function tick() {
      // Target decays back to rest; the factor chases it.
      target.current += (1 - target.current) * 0.05;
      factor.current += (target.current - factor.current) * 0.1;
      raf = requestAnimationFrame(tick);
    }

    lastY.current = window.scrollY;
    lastT.current = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return factor;
}

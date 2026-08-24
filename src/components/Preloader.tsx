"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { LOGO_RATIO, logoMaskStyle, preloadLogo } from "../lib/brand";
import { lockScroll, unlockScroll } from "../lib/scroller";

/** Panels the screen breaks into when it opens. */
const PANELS = 6;

/** Steep in-out: reads as machinery moving, not as something bouncing. */
const CURTAIN_EASE = [0.72, 0, 0.16, 1] as const;
const SETTLE_EASE = [0.16, 1, 0.3, 1] as const;

/* Choreography, in seconds. The mark's flight has to be the last thing moving:
   the overlay unmounts when it lands, and anything still animating at that
   point would be cut off mid-travel.

     panels   0.00 → 0.95, staggered 0.055 each → last lands at 1.225
     mark     0.30 → 1.25                                              */
const PANEL_TRAVEL = 0.95;
const PANEL_STAGGER = 0.055;
const MARK_DELAY = 0.3;
const MARK_TRAVEL = 0.95;

type Phase = "loading" | "opening" | "landing" | "done";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Waits on the things that actually cause a flash — webfonts, the logo bitmap,
 * window load — with a floor so the sequence can't strobe past on a fast
 * connection and a ceiling so a stalled asset can't hold the page hostage.
 */
function whenReady(minMs: number, maxMs = 4000) {
  const started = performance.now();

  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));

  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();

  const real = Promise.all([loaded, fonts, preloadLogo()]).then(async () => {
    const elapsed = performance.now() - started;
    if (elapsed < minMs) await wait(minMs - elapsed);
  });

  return Promise.race([real, wait(maxMs).then(() => undefined)]);
}

export default function Preloader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [markReady, setMarkReady] = useState(false);
  const markRef = useRef<HTMLDivElement>(null);

  /** Measured transform that carries the mark into the nav's logo slot. */
  const [flight, setFlight] = useState<{ x: number; y: number; scale: number } | null>(null);

  const progress = useMotionValue(0);

  /** Mark colour. White on the accent screen, then whatever it lands into. */
  const fillColour = useMotionValue("#ffffff");

  // Loading is told by the wordmark itself: the mark fills from the baseline up
  // as the real work completes. No bar, no spinner — the logo is the indicator.
  const fill = useTransform(progress, (v) => `inset(${100 - v}% 0% 0% 0%)`);
  const readout = useTransform(progress, (v) => String(Math.round(v)).padStart(2, "0"));

  // A single settle rather than a loop: the mark eases out of a slight
  // perspective onto the picture plane exactly as it finishes filling.
  const rotateX = useTransform(progress, [0, 100], reduce ? [0, 0] : [9, 0]);
  const rotateY = useTransform(progress, [0, 100], reduce ? [0, 0] : [-6, 0]);

  useEffect(() => {
    if (phase !== "loading") unlockScroll();
  }, [phase]);

  // The nav's own logo is suppressed until the flight lands, otherwise two
  // copies of the mark are on screen for the length of the travel. Flagged on
  // the root so the nav needs no wiring; visibility is left alone because the
  // hand-off measures that box to aim at, and a hidden box has no rect.
  useEffect(() => {
    const root = document.documentElement;
    if (phase === "done") {
      delete root.dataset.preloading;
      return;
    }
    root.dataset.preloading = "";
    return () => {
      delete root.dataset.preloading;
    };
  }, [phase]);

  useEffect(() => {
    // A refresh part-way down the page would otherwise be restored behind the
    // curtain, so the reveal would open on the middle of the site.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lockScroll();

    let cancelled = false;

    // A CSS mask paints nothing until its bitmap is decoded — hold the mark
    // back rather than showing an empty box for the first frames.
    preloadLogo().then(() => !cancelled && setMarkReady(true));

    const creep = animate(progress, 88, {
      duration: reduce ? 0.4 : 1.4,
      ease: SETTLE_EASE,
    });

    (async () => {
      await whenReady(reduce ? 300 : 950);
      if (cancelled) return;

      creep.stop();
      await animate(progress, 100, { duration: 0.45, ease: SETTLE_EASE });
      if (cancelled) return;

      // Let the completed mark hold for a beat before anything moves.
      await wait(200);
      if (cancelled) return;

      setPhase("opening");

      if (reduce) {
        await wait(260);
        if (!cancelled) setPhase("done");
        return;
      }

      // Overlap: the panels are already travelling when the mark sets off, so
      // the two moves read as one gesture.
      await wait(MARK_DELAY * 1000);
      if (cancelled) return;

      // Prefer the hero plate's mark: it's white on the accent, exactly like
      // the one on this screen, so the hand-off needs no colour change at all.
      // The nav mark is the fallback (portfolio page, or a missing hero).
      const targetEl =
        document.querySelector("[data-hero-logo]") ?? document.querySelector("[data-nav-logo]");
      const target = targetEl?.getBoundingClientRect();
      const source = markRef.current?.getBoundingClientRect();

      if (targetEl && target && source && target.height > 0) {
        setFlight({
          x: target.left + target.width / 2 - (source.left + source.width / 2),
          y: target.top + target.height / 2 - (source.top + source.height / 2),
          scale: target.height / source.height,
        });
        setPhase("landing");

        // Land in whatever colour the target is drawn in. On the hero plate
        // that's already white, so this is a no-op there and a crossfade to
        // the page's text colour when handing off to the nav.
        const landingColour = getComputedStyle(targetEl).color;
        animate(fillColour, landingColour, {
          duration: MARK_TRAVEL * 0.55,
          delay: MARK_TRAVEL * 0.35,
          ease: "easeInOut",
        });
      } else {
        // Nothing measurable — skip the hand-off rather than guess.
        setPhase("done");
      }
    })();

    return () => {
      cancelled = true;
      creep.stop();
      unlockScroll();
    };
  }, [fillColour, progress, reduce]);

  const opening = phase === "opening" || phase === "landing";
  const panelCount = reduce ? 1 : PANELS;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <div
          // Under the grain and the custom cursor (9998/9999) so both keep
          // running across it.
          className="fixed inset-0 z-9997 overflow-hidden"
          role="progressbar"
          aria-label="Loading Feelz Films"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* The screen itself, broken into panels that lift in sequence. */}
          <div aria-hidden className="absolute inset-0">
            {Array.from({ length: panelCount }, (_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 h-full"
                // Positioned rather than flexed, and a pixel wider than its
                // share: sub-pixel widths otherwise leave hairline seams of
                // the page showing between panels.
                //
                // Each panel carries the full-screen gradient scaled to the
                // panel count and offset to its own slice, so the six of them
                // reconstruct one continuous wash instead of repeating it.
                style={{
                  left: `${(i / panelCount) * 100}%`,
                  width: `calc(${100 / panelCount}% + 1px)`,
                  backgroundImage:
                    "linear-gradient(160deg, var(--color-accent), var(--color-accent-2))",
                  backgroundSize: `${panelCount * 100}% 100%`,
                  backgroundPosition:
                    panelCount > 1 ? `${(i / (panelCount - 1)) * 100}% 0` : "center",
                }}
                initial={false}
                animate={opening ? (reduce ? { opacity: 0 } : { y: "-101%" }) : {}}
                transition={{
                  duration: reduce ? 0.3 : PANEL_TRAVEL,
                  delay: reduce ? 0 : i * PANEL_STAGGER,
                  ease: CURTAIN_EASE,
                }}
              />
            ))}
          </div>

          {/* Counter, held in the corner at label scale. */}
          <motion.div
            aria-hidden
            className="absolute bottom-8 right-6 md:bottom-10 md:right-10"
            initial={false}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.span className="u-index tabular-nums text-white/70">{readout}</motion.span>
          </motion.div>

          {/* The mark. Sits above the panels, so it stays put as they lift and
              then carries itself into the nav. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              ref={markRef}
              className="relative w-[min(62vw,24rem)]"
              style={{ aspectRatio: LOGO_RATIO }}
              initial={false}
              animate={
                phase === "landing" && flight
                  ? { x: flight.x, y: flight.y, scale: flight.scale, opacity: 1 }
                  : { x: 0, y: 0, scale: 1, opacity: markReady ? 1 : 0 }
              }
              transition={
                phase === "landing"
                  ? { duration: MARK_TRAVEL, ease: CURTAIN_EASE }
                  : { duration: 0.5, ease: SETTLE_EASE }
              }
              onAnimationComplete={() => {
                if (phase === "landing") setPhase("done");
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
              >
                {/* Unfilled mark, sitting just off the accent behind it. */}
                <span
                  className="absolute inset-0"
                  style={logoMaskStyle("rgba(255,255,255,0.22)")}
                />
                {/* Filled mark, clipped to the progress line. Its colour is a
                    motion value so it can land in the target's own colour. */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    ...logoMaskStyle("#ffffff"),
                    backgroundColor: fillColour,
                    clipPath: fill,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

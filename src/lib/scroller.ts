import type Lenis from "lenis";

/**
 * Lenis owns the scroll position while it's running, so programmatic scrolling
 * has to go through it — a native scrollIntoView gets overridden on the next
 * frame of its loop. SmoothScroll registers the instance here; navigation code
 * calls scrollToTarget and gets the native path automatically when Lenis is
 * absent (reduced motion, or before it mounts).
 */
let instance: Lenis | null = null;

/** Cleared height of the sticky nav, so anchored headings aren't tucked under it. */
const NAV_OFFSET = 76;

export function registerScroller(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Held still behind the preloader. Lenis keeps its own animation loop, so
 * overflow alone won't stop it — it has to be told to stand down as well.
 */
export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  instance?.start();
}

export function scrollToTarget(target: string | number, immediate = false) {
  if (instance) {
    instance.scrollTo(target, {
      offset: typeof target === "string" ? -NAV_OFFSET : 0,
      immediate,
    });
    return;
  }

  const behavior: ScrollBehavior = immediate ? "instant" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }

  const el = document.querySelector(target);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior });
}

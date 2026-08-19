import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/**
 * One store, shared by every caller. The previous version kept state locally,
 * so a second component calling useTheme() (the world map does) got its own
 * copy that never saw the toggle and stayed on "light" forever.
 */
let current: Theme = "light";
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): Theme {
  return current;
}

export function setTheme(next: Theme) {
  if (next === current) return;
  current = next;
  if (typeof document !== "undefined") {
    document.body.setAttribute("data-theme", next);
  }
  listeners.forEach((fn) => fn());
}

if (typeof document !== "undefined" && document.body) {
  document.body.setAttribute("data-theme", current);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "light" ? "dark" : "light");
  }, []);
  return { theme, toggle };
}

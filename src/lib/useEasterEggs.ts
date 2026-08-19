import { useEffect } from "react";

/**
 * Two quiet extras:
 *  - "T" toggles the theme from anywhere (skipped while typing).
 *  - A signature in the console for whoever opens devtools.
 */
export function useEasterEggs(onToggleTheme: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.key.toLowerCase() === "t") onToggleTheme();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggleTheme]);

  useEffect(() => {
    console.log(
      "%cFEELZ FILMS%c\nYour expertise deserves to be seen.\n\nPress T to flip the lights.\nHiring or collaborating? connect@feelzfilms.com",
      "font: 700 22px/1.1 system-ui; color:#2A56E8; letter-spacing:-0.02em",
      "font: 12px/1.6 ui-monospace, monospace; color:#8a91a3",
    );
  }, []);
}

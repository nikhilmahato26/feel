import { LOGO_RATIO, LOGO_SRC, logoMaskStyle } from "../lib/brand";

/**
 * The brand lockup, in one place. Filled with `currentColor`, so the mark reads
 * black on the light page, white on the dark one, and picks up the accent on
 * hover like any other text. Set LOGO_SRC to "" to fall back to type.
 */

interface WordmarkProps {
  /** nav is the compact lockup; footer is the larger one. */
  size?: "nav" | "footer";
  /**
   * Accessible name. Omit when an ancestor already names it — a labelled link
   * wrapping a labelled image gets announced twice.
   */
  label?: string;
  className?: string;
}

export default function Wordmark({ size = "nav", label, className = "" }: WordmarkProps) {
  const isNav = size === "nav";
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true };

  if (LOGO_SRC) {
    return (
      <span
        {...a11y}
        className={`block ${isNav ? "h-9" : "h-14"} ${className}`}
        style={{ aspectRatio: LOGO_RATIO, ...logoMaskStyle("currentColor") }}
      />
    );
  }

  return (
    <span {...a11y} className={`font-display text-lg font-bold tracking-tight ${className}`}>
      {isNav ? (
        <>
          Feelz <span className="text-(--accent)">Films</span>
        </>
      ) : (
        <>
          FEELZ <span className="text-(--accent)">FILMS</span>
        </>
      )}
    </span>
  );
}

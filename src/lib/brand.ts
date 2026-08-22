import type { CSSProperties } from "react";

/** Logo file in /public. Empty string falls back to the type lockup. */
export const LOGO_SRC = "/logo.png";

/** Intrinsic ratio of the artwork (1314 × 875), so no box ever distorts it. */
export const LOGO_RATIO = "1314 / 875";

/**
 * The logo is single-colour art on transparency, so everywhere it appears it's
 * drawn as a mask over a fill rather than as an <img>. One file then serves both
 * themes and can be tinted per use — the preloader extrudes it by stacking this
 * same mask in depth with a different fill on each layer.
 */
export function logoMaskStyle(fill: string): CSSProperties {
  return {
    backgroundColor: fill,
    maskImage: `url(${LOGO_SRC})`,
    WebkitMaskImage: `url(${LOGO_SRC})`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  };
}

/** Resolves once the logo bitmap is decoded, so the mask can't render empty. */
export function preloadLogo(): Promise<void> {
  if (!LOGO_SRC) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = LOGO_SRC;
  });
}

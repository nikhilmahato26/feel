import { Reveal } from "./Reveal";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

function CropMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute w-4 h-4 opacity-40 ${className}`}>
      <span className="absolute inset-x-0 top-0 h-px bg-(--hero-text)" />
      <span className="absolute inset-y-0 left-0 w-px bg-(--hero-text)" />
    </span>
  );
}

/**
 * Bookend to the hero: the same accent plate, the same crop marks, closing the
 * page on the colour it opened with.
 */
export default function FinalCta() {
  return (
    <section className="py-24 md:py-32 border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <Reveal y={36}>
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-16 md:px-16 md:py-24 text-(--hero-text)"
            style={{ background: "linear-gradient(160deg, var(--color-accent), var(--color-accent-2))" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
            <CropMark className="top-6 left-6" />
            <CropMark className="top-6 right-6 rotate-90" />
            <CropMark className="bottom-6 right-6 rotate-180" />
            <CropMark className="bottom-6 left-6 -rotate-90" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <span aria-hidden className="w-6 h-px bg-current opacity-60" />
                <span className="u-meta opacity-75">Next step</span>
              </div>

              <h2 className="u-display text-[clamp(1.9rem,1.5rem+2vw,3rem)] leading-[1.05] max-w-[20ch]">
                <TextReveal text="Book a 20-minute call. Leave with a content plan either way." />
              </h2>

              <p className="mt-6 text-base md:text-lg opacity-85 max-w-[46ch] leading-relaxed">
                No obligation. If we're not a fit, you'll still walk away knowing exactly what to fix first.
              </p>

              <div className="mt-10">
                <MagneticButton
                  href="mailto:connect@feelzfilms.com?subject=Book%20a%20call"
                  variant="inverted"
                  className="rounded-full"
                >
                  Book a call
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";
import Tilt3D from "./Tilt3D";
import ScrollStage from "./ScrollStage";
import { BOOKING_URL } from "../lib/contact";

function CornerTick({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute w-4 h-4 opacity-40 ${className}`}>
      <span className="absolute inset-x-0 top-0 h-px bg-(--hero-text)" />
      <span className="absolute inset-y-0 left-0 w-px bg-(--hero-text)" />
    </span>
  );
}

/**
 * Bookend to the hero: the same accent, the same grid, closing the page on the
 * colour it opened with.
 */
export default function FinalCta() {
  return (
    <section className="py-14 md:py-24 border-b border-(--border)">
      <ScrollStage amount={0.75}>
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <Reveal y={36}>
          {/* Shallow angles only: the plate carries body copy, and copy on a
              steeply rotated plane goes soft. */}
          <Tilt3D max={4} lift={18} glare={false}>
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-16 md:px-16 md:py-24 text-(--hero-text)"
            style={{
              background: "linear-gradient(160deg, var(--color-accent), var(--color-accent-2))",
              boxShadow: "0 50px 90px -50px rgba(42,86,232,0.75)",
            }}
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
            <CornerTick className="top-6 left-6" />
            <CornerTick className="top-6 right-6 rotate-90" />
            <CornerTick className="bottom-6 right-6 rotate-180" />
            <CornerTick className="bottom-6 left-6 -rotate-90" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <span aria-hidden className="w-6 h-px bg-current opacity-60" />
                <span className="u-meta opacity-75">Next step</span>
              </div>

              <h2 className="u-display text-[clamp(1.9rem,1.5rem+2vw,3rem)] leading-[1.05] max-w-[20ch]">
                <TextReveal text="Book a 20-minute call. Leave with a marketing plan either way." />
              </h2>

              <p className="mt-6 text-base md:text-lg opacity-85 max-w-[46ch] leading-relaxed">
                No obligation. If we're not a fit, you'll still walk away knowing exactly what to fix first.
              </p>

              <div className="mt-10">
                <MagneticButton href={BOOKING_URL} variant="inverted" className="rounded-full">
                  Book a call
                </MagneticButton>
              </div>
            </div>
          </div>
          </Tilt3D>
        </Reveal>
      </div>
      </ScrollStage>
    </section>
  );
}

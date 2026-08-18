import { Reveal } from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <Reveal y={36}>
          <div className="text-center rounded-[2.5rem] px-8 py-16 md:px-16 md:py-24 glass-panel relative overflow-hidden">
            <h2 className="font-display font-bold text-[clamp(1.9rem,1.5rem+2vw,2.75rem)] leading-tight tracking-[-0.02em] max-w-[22ch] mx-auto text-balance">
              Book a 20-minute call. Leave with a content plan either way.
            </h2>
            <p className="mt-4 text-base md:text-lg opacity-85 max-w-[46ch] mx-auto">
              No obligation. If we're not a fit, you'll still walk away knowing exactly what to fix first.
            </p>
            <div className="mt-8 flex justify-center">
              <MagneticButton href="mailto:connect@feelzfilms.com?subject=Book%20a%20call" variant="inverted">
                Book a call
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

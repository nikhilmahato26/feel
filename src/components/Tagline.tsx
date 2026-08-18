import { Reveal } from "./Reveal";

export default function Tagline() {
  return (
    <div className="py-16 md:py-24 text-center">
      <Reveal className="max-w-3xl mx-auto px-6">
        <p className="font-display font-medium text-[clamp(1.4rem,1.1rem+1.4vw,2.5rem)] leading-snug tracking-[-0.01em] text-balance">
          You can't get the last ten years back. You can get the next ten right.
        </p>
      </Reveal>
    </div>
  );
}

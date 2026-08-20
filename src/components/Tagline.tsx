import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import TextReveal from "./TextReveal";

export default function Tagline() {
  return (
    <section className="py-24 md:py-32 border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-3 mb-9">
            <span aria-hidden className="w-6 h-px bg-(--accent)" />
            <span className="u-meta text-(--accent)">Why it matters</span>
            <span aria-hidden className="w-6 h-px bg-(--accent)" />
          </div>

          <blockquote>
            <p className="u-display font-medium text-[clamp(1.5rem,1rem+2vw,2.75rem)] leading-[1.15] max-w-[26ch] mx-auto">
              <TextReveal text="You can't get the last ten years back. You can get the next ten right." />
            </p>
          </blockquote>
        </Reveal>

        {/* Segmented rail — the page's own measure, drawn as four bars. */}
        <RevealGroup
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          stagger={0.09}
        >
          {["Strategy", "Production", "Editing", "Distribution"].map((label) => (
            <RevealItem key={label}>
              <div className="group">
                <div className="h-2 rounded-full border border-(--hairline-strong) overflow-hidden">
                  <span
                    aria-hidden
                    className="block h-full w-full origin-left scale-x-0 bg-(--accent) transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                </div>
                <span className="u-meta mt-3 block text-(--text-secondary) opacity-85 transition-opacity duration-300 group-hover:opacity-100">
                  {label}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

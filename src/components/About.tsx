import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { DotPattern } from "@/components/ui/dot-pattern";

const stats = [
  { n: "[Year]", l: "Founded" },
  { n: "20+", l: "Core team" },
  { n: "New Delhi", l: "Headquarters" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <DotPattern className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] opacity-30" />
      <div className="max-w-285 mx-auto px-6 md:px-8 flex flex-col md:flex-row gap-12 items-start relative z-10">
        <Reveal className="md:flex-[1.4] min-w-0">
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.3rem+2vw,3rem)] leading-[1.1] tracking-[-0.02em] text-balance mb-6 max-w-[18ch]">
            We're not a video production company. We're a content partner.
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed mb-4 max-w-[52ch]">
            [Replace with your founding story: one or two sentences on why Feelz Films started and what problem you saw.]
          </p>
          <p className="text-(--text-secondary) text-base md:text-lg leading-relaxed max-w-[52ch]">
            We don't ask "how do we make this video?" We ask "how does this content help the business grow?" That
            distinction defines everything about how we work: strategy, production, editing and distribution,
            handled by one team instead of five freelancers.
          </p>
        </Reveal>

        <RevealGroup className="md:flex-1 min-w-0 flex flex-col gap-6 w-full md:w-auto">
          {stats.map((s) => (
            <RevealItem key={s.l}>
              <div className="border-l-2 border-(--accent) pl-4 transition-transform duration-300 hover:translate-x-1.5">
                <div className="font-display font-bold text-2xl md:text-3xl tabular-nums">{s.n}</div>
                <div className="text-sm text-(--text-secondary) mt-1">{s.l}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

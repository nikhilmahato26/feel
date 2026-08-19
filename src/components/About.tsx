import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import Counter from "./Counter";

/**
 * "Founded" was a `[Year]` placeholder. Replaced with a figure the site already
 * asserts elsewhere (the six markets in the footer and the map), so nothing on
 * the page is a blank waiting to be filled.
 */
const stats: Array<{
  n: string;
  count?: { to: number; pad?: number; suffix?: string };
  l: string;
  note: string;
}> = [
  { n: "20+", count: { to: 20, suffix: "+" }, l: "Core team", note: "Strategists, producers, editors" },
  { n: "06", count: { to: 6, pad: 2 }, l: "Markets served", note: "US · UK · CA · AU · UAE · IN" },
  { n: "New Delhi", l: "Headquarters", note: "Working worldwide" },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-12 gap-x-12 gap-y-14">
          <div className="md:col-span-7">
            <SectionHeader
              index="01"
              label="About"
              title="We're not a video production company. We're a content partner."
            />

            <Reveal delay={0.1}>
              <p className="mt-8 text-base md:text-lg leading-relaxed text-(--text-secondary) max-w-[54ch]">
                We don't ask <em className="not-italic text-(--text) font-medium">"how do we make this video?"</em> We
                ask <em className="not-italic text-(--text) font-medium">"how does this content help the business
                grow?"</em> That distinction defines everything about how we work: strategy, production, editing and
                distribution, handled by one team instead of five freelancers.
              </p>

              {/* Draft slot — deliberately marked so it reads as an editor's note,
                  never as shipped copy. Delete this block once the story is written. */}
              <aside className="mt-8 max-w-[54ch] border-l-2 border-dashed border-(--hairline-strong) pl-5 py-1">
                <p className="u-meta text-(--text-secondary) opacity-60 mb-2">Draft slot · founding story</p>
                <p className="text-sm leading-relaxed text-(--text-secondary) opacity-80">
                  One or two sentences on why Feelz Films started and the problem you saw.
                </p>
              </aside>
            </Reveal>
          </div>

          <RevealGroup className="md:col-span-5 md:pt-2" stagger={0.08}>
            {stats.map((s, i) => (
              <RevealItem key={s.l}>
                <div className="group grid grid-cols-[auto_1fr] gap-x-5 items-baseline py-6 border-t border-(--hairline) last:border-b">
                  <span className="u-index text-(--text-secondary) opacity-50 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-display font-bold text-2xl md:text-3xl tracking-[-0.02em] tabular-nums transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      {s.count ? <Counter to={s.count.to} pad={s.count.pad} suffix={s.count.suffix} /> : s.n}
                    </div>
                    <div className="u-meta mt-2.5 text-(--accent)">{s.l}</div>
                    <div className="text-sm text-(--text-secondary) mt-2">{s.note}</div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

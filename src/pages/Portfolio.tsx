import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import VideoCard from "../components/VideoCard";
import Tilt3D from "../components/Tilt3D";
import ScrollStage from "../components/ScrollStage";
import FinalCta from "../components/FinalCta";

/**
 * Route-level work page. The real case studies land later, so every frame here
 * is a reserved slot with its own category — swap each entry for a case study
 * (poster, client, result) as it comes in.
 */
const SLOTS = [
  { k: "01", category: "Founder brand", featured: true },
  { k: "02", category: "Short-form" },
  { k: "03", category: "Long-form" },
  { k: "04", category: "Launch campaign" },
  { k: "05", category: "Brand film" },
  { k: "06", category: "Podcast" },
];

export default function Portfolio() {
  return (
    <main>
      {/* Page head, carrying the same accent bloom as the home hero. */}
      <section className="relative overflow-hidden border-b border-(--border)">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-48 -right-24 h-[34rem] w-[34rem] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 62%)" }}
        />

        <div className="relative max-w-285 mx-auto px-6 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="w-6 h-px bg-(--accent)" />
              <span className="u-meta text-(--accent)">Work</span>
            </div>

            <h1 className="u-display mt-7 text-[clamp(2.3rem,1.7rem+2.6vw,4rem)] max-w-[18ch]">
              <TextReveal text="The work, and what it moved." trigger="mount" delay={0.15} />
            </h1>

            <p className="mt-7 text-base md:text-lg text-(--text-secondary) max-w-[52ch] leading-relaxed">
              Campaigns, founder brands and content systems we've built. Each entry covers the
              position we set, what we published, and what changed for the business.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Reserved grid. */}
      <section className="py-16 md:py-24 border-b border-(--border)">
        <ScrollStage>
        <div className="max-w-285 mx-auto px-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <span className="u-meta text-(--text-secondary)">
              {String(SLOTS.length).padStart(2, "0")} projects
            </span>
            <span className="u-meta text-(--text-secondary)">Case studies in progress</span>
          </div>

          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {SLOTS.map((s) => (
              <RevealItem key={s.k} className={s.featured ? "sm:col-span-2" : ""}>
                <figure className="h-full">
                  <Tilt3D glare={false}>
                    <VideoCard
                      index={s.k}
                      label={s.category}
                      className={s.featured ? "aspect-[16/8]" : "aspect-video"}
                      featured={s.featured}
                    />
                  </Tilt3D>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{s.category}</span>
                    <span className="u-meta text-(--text-secondary)">Client TBC</span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        </ScrollStage>
      </section>

      <FinalCta />
    </main>
  );
}

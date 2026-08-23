import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import YouTubeFrame from "../components/YouTubeFrame";
import Tilt3D from "../components/Tilt3D";
import ScrollStage from "../components/ScrollStage";
import FinalCta from "../components/FinalCta";

/**
 * Route-level work page — a gallery, deliberately light on words. Each entry is
 * a published film; the client name doubles as the caption and as the label a
 * screen reader announces on the play button.
 *
 * `id` is the YouTube video ID. Frames are click-to-play facades (see
 * YouTubeFrame), so nine posters cost nine images rather than nine players.
 */
interface Film {
  id: string;
  client: string;
}

const LONG_FORM: Film[] = [
  { id: "8knPNcme2uw", client: "Oechsli" },
  { id: "33FqKxLjB8Y", client: "Enable Solutions" },
  { id: "8byDZiFUao4", client: "Daniel Iles" },
  { id: "g6NBHR2p7Dc", client: "CRM Advisors" },
  { id: "LT7A8WgFFNg", client: "Topaz Consulting" },
  { id: "FG2F2QIXstc", client: "Wall Street" },
  { id: "0nBAjE71S9I", client: "Stephnie ABT" },
];

const SHORT_FORM: Film[] = [
  { id: "zxfdR1Xq0jA", client: "Genwin Kashish" },
  { id: "iuB33GXZONw", client: "LoVasco" },
];

function slot(i: number) {
  return String(i + 1).padStart(2, "0");
}

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

        <div className="relative max-w-285 mx-auto px-6 md:px-8 pt-20 pb-14 md:pt-28 md:pb-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="w-6 h-px bg-(--accent)" />
              <span className="u-meta text-(--accent)">Work</span>
            </div>

            <h1 className="u-display mt-7 text-[clamp(2.3rem,1.7rem+2.6vw,4rem)] max-w-[18ch]">
              <TextReveal text="The work, and what it moved." trigger="mount" delay={0.15} />
            </h1>

            <p className="mt-6 text-base md:text-lg text-(--text-secondary) max-w-[44ch] leading-relaxed">
              Selected films. Press play.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Long-form gallery. First film leads at double width. */}
      <section className="py-14 md:py-20 border-b border-(--border)">
        <ScrollStage>
          <div className="max-w-285 mx-auto px-6 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <span className="u-meta text-(--accent)">Long-form</span>
              <span className="u-meta text-(--text-secondary)">
                {String(LONG_FORM.length).padStart(2, "0")} films
              </span>
            </div>

            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {LONG_FORM.map((f, i) => (
                <RevealItem key={f.id}>
                  <figure className="h-full">
                    <Tilt3D glare={false}>
                      <YouTubeFrame
                        id={f.id}
                        title={f.client}
                        index={slot(i)}
                        className="aspect-video"
                      />
                    </Tilt3D>
                    <figcaption className="mt-3 text-sm font-medium">{f.client}</figcaption>
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </ScrollStage>
      </section>

      {/* Shorts, kept at 9:16 and held to a narrow column so they don't tower. */}
      <section className="py-14 md:py-20 border-b border-(--border)">
        <ScrollStage>
          <div className="max-w-285 mx-auto px-6 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <span className="u-meta text-(--accent)">Short-form</span>
              <span className="u-meta text-(--text-secondary)">
                {String(SHORT_FORM.length).padStart(2, "0")} verticals
              </span>
            </div>

            <RevealGroup className="grid grid-cols-2 gap-4 max-w-lg" stagger={0.07}>
              {SHORT_FORM.map((f, i) => (
                <RevealItem key={f.id}>
                  <figure>
                    <Tilt3D glare={false}>
                      <YouTubeFrame
                        id={f.id}
                        title={f.client}
                        index={slot(LONG_FORM.length + i)}
                        className="aspect-[9/16]"
                      />
                    </Tilt3D>
                    <figcaption className="mt-3 text-sm font-medium">{f.client}</figcaption>
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

"use client";

import { useEffect, useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import YouTubeFrame from "../components/YouTubeFrame";
import Tilt3D from "../components/Tilt3D";
import ScrollStage from "../components/ScrollStage";
import FinalCta from "../components/FinalCta";
import { scrollToTarget } from "../lib/scroller";

/**
 * Route-level work page — a gallery, deliberately light on words. Each entry is
 * a published film; the client name doubles as the caption and as the label a
 * screen reader announces on the play button.
 *
 * `id` is the YouTube video ID. Frames are click-to-play facades (see
 * YouTubeFrame), so nine posters cost nine images rather than nine players.
 * Entries without an `id` render as reserved frames, which is how the sections
 * that have no films yet hold their shape.
 */
interface Film {
  id?: string;
  client: string;
}

interface Gallery {
  /** Anchor target for the jump buttons. */
  id: string;
  label: string;
  /** Plural noun for the count in the section rule. */
  unit: string;
  films: Film[];
  /** Aspect of each frame, and the grid the frames sit in. */
  aspect: string;
  grid: string;
}

const GALLERIES: Gallery[] = [
  {
    id: "long-form",
    label: "Long form video & podcast",
    unit: "films",
    aspect: "aspect-video",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    films: [
      { id: "8knPNcme2uw", client: "Oechsli" },
      { id: "33FqKxLjB8Y", client: "Enable Solutions" },
      { id: "8byDZiFUao4", client: "Daniel Iles" },
      { id: "g6NBHR2p7Dc", client: "CRM Advisors" },
      { id: "LT7A8WgFFNg", client: "Topaz Consulting" },
      { id: "FG2F2QIXstc", client: "Wall Street" },
      { id: "0nBAjE71S9I", client: "Stephnie ABT" },
    ],
  },
  {
    id: "short-form",
    label: "Short form videos",
    unit: "verticals",
    aspect: "aspect-[9/16]",
    // Held to a narrow column so the verticals don't tower over the page.
    grid: "grid grid-cols-2 gap-4 max-w-lg",
    films: [
      { id: "zxfdR1Xq0jA", client: "Genwin Kashish" },
      { id: "iuB33GXZONw", client: "LoVasco" },
    ],
  },
  {
    id: "before-after",
    label: "Before and after",
    unit: "reserved",
    aspect: "aspect-video",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    // TODO: send the before/after pairs and they drop straight in here.
    films: [{ client: "Coming soon" }, { client: "Coming soon" }, { client: "Coming soon" }],
  },
  {
    id: "docu-films",
    label: "Docu films",
    unit: "reserved",
    aspect: "aspect-video",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    // TODO: send the documentary IDs and they drop straight in here.
    films: [{ client: "Coming soon" }, { client: "Coming soon" }, { client: "Coming soon" }],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Marks the jump button whose gallery currently owns the middle of the screen. */
function useActiveGallery() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = GALLERIES.map((g) => document.getElementById(g.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}

export default function Portfolio() {
  // Frame indices run continuously across the galleries, so no two frames on
  // the page carry the same slot number.
  let slot = 0;

  const active = useActiveGallery();

  return (
    <main>
      {/* Page head, carrying the same accent bloom as the home hero. */}
      <section className="relative overflow-hidden border-b border-(--border)">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-48 -right-24 h-[34rem] w-[34rem] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 62%)" }}
        />

        <div className="relative max-w-285 mx-auto px-6 md:px-8 pt-14 pb-8 md:pt-24 md:pb-12">
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

            {/* Jump to a gallery. Anchors rather than buttons, so they can be
                opened in a new tab and read as navigation, but the click is
                handled so the scroll goes through Lenis — a native jump gets
                overridden by its loop on the next frame. */}
            <nav aria-label="Jump to a section" className="mt-9">
              <ul className="-mx-1 flex flex-wrap gap-2">
                {GALLERIES.map((g) => {
                  const current = active === g.id;
                  return (
                    <li key={g.id}>
                      <a
                        href={`#${g.id}`}
                        aria-current={current ? "true" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTarget(`#${g.id}`);
                        }}
                        className={`cursor-hover-target u-meta inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-[background-color,border-color,color] duration-300 ${
                          current
                            ? "border-(--accent) bg-(--accent) text-(--accent-text)"
                            : "border-(--hairline-strong) text-(--text-secondary) hover:border-(--accent) hover:text-(--accent)"
                        }`}
                      >
                        {g.label}
                        <span
                          className={current ? "opacity-80" : "text-(--text-secondary) opacity-70"}
                        >
                          {pad(g.films.filter((f) => f.id).length)}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      {GALLERIES.map((g) => {
        const live = g.films.filter((f) => f.id).length;

        return (
          <section
            key={g.id}
            id={g.id}
            // Clears the sticky header when a jump button lands here.
            className="scroll-mt-24 border-b border-(--border) py-10 md:py-16"
          >
            <ScrollStage>
              <div className="max-w-285 mx-auto px-6 md:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                  <span className="u-meta text-(--accent)">{g.label}</span>
                  <span className="u-meta text-(--text-secondary)">
                    {live ? `${pad(live)} ${g.unit}` : "In production"}
                  </span>
                </div>

                <RevealGroup className={g.grid} stagger={0.07}>
                  {g.films.map((f, i) => {
                    slot += 1;
                    return (
                      <RevealItem key={`${g.label}-${f.id ?? i}`}>
                        <figure className="h-full">
                          <Tilt3D glare={false}>
                            <YouTubeFrame
                              id={f.id}
                              title={f.client}
                              index={pad(slot)}
                              className={g.aspect}
                            />
                          </Tilt3D>
                          <figcaption
                            className={`mt-3 text-sm font-medium ${
                              f.id ? "" : "text-(--text-secondary)"
                            }`}
                          >
                            {f.client}
                          </figcaption>
                        </figure>
                      </RevealItem>
                    );
                  })}
                </RevealGroup>
              </div>
            </ScrollStage>
          </section>
        );
      })}

      <FinalCta />
    </main>
  );
}

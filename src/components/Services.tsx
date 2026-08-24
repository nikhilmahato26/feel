"use client";

import {
  ArrowsClockwise,
  Compass,
  DownloadSimple,
  PaintBrush,
  Rocket,
  VideoCamera,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import MagneticButton from "./MagneticButton";
import ScrollStage from "./ScrollStage";

/**
 * TODO: the brochure PDF isn't in the repo yet. Drop it at
 * public/feelz-films-brochure.pdf and set this to that path.
 *
 * Left empty on purpose in the meantime: a single-page app rewrites unknown
 * paths to index.html, so a link to a missing PDF doesn't 404 — it hands the
 * visitor an HTML file named like a brochure. The request falls back to email
 * until the file exists.
 */
const BROCHURE = "";
const BROCHURE_FALLBACK =
  "mailto:connect@feelzfilms.com?subject=Company%20brochure%20%2B%20case%20studies";

interface Service {
  k: string;
  Icon: Icon;
  title: string;
  /** Optional one-liner under the heading. */
  lede?: string;
  items: string[];
}

const services: Service[] = [
  {
    k: "01",
    Icon: Compass,
    title: "Strategy & Audit",
    lede: "Know what to say before you start saying it.",
    items: [
      "Channel Audit",
      "Content Strategy",
      "Content Positioning",
      "Personal Brand Strategy",
      "Content Planning",
    ],
  },
  {
    k: "02",
    Icon: PaintBrush,
    title: "Brand & Digital Presence",
    items: [
      "Personal Branding",
      "Website Brand Kit",
      "Visual Identity",
      "Social Media Branding",
      "Brand Guidelines",
    ],
  },
  {
    k: "03",
    Icon: VideoCamera,
    title: "Content Production",
    items: [
      "Long Form Videos",
      "Short Form Videos",
      "Launch Videos",
      "Podcasts & Interviews",
      "Trailers & Promos",
    ],
  },
  {
    k: "04",
    Icon: ArrowsClockwise,
    title: "Content Repurposing",
    items: [
      "Long Form → Shorts",
      "Reels & Social Cuts",
      "Content Repurposing",
      "Thumbnails",
      "Platform Specific Formats",
    ],
  },
  {
    k: "05",
    Icon: Rocket,
    title: "Distribution & Growth",
    items: [
      "Content Distribution",
      "Social Media Publishing",
      "Platform Optimization",
      "Performance Tracking",
      "Content Growth Strategy",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-(--bg-alt) border-b border-(--border)">
      <ScrollStage>
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <SectionHeader
          index="03"
          label="Services"
          title="One integrated marketing system."
          lede="Five disciplines, one team, one thread running through all of them."
          className="mb-16 md:mb-20"
        />

        <RevealGroup
          className="depth-scene grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {services.map((s) => (
            <RevealItem key={s.k} className="min-w-0">
              {/* Focusable so the list is reachable without a pointer; the
                  reveal keys off :focus-within as well as :hover. */}
              <article
                aria-label={s.title}
                className="depth-cell group relative h-full overflow-hidden rounded-2xl text-(--hero-text)"
                style={{
                  background:
                    "linear-gradient(155deg, var(--color-accent), var(--color-accent-2))",
                }}
              >
                {/* Everything is on show; hovering pushes in on it rather than
                    revealing it. The scale lives on this inner wrapper so the
                    card's own corners stay put and crop the zoom. */}
                <div className="flex h-full min-h-80 flex-col p-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="u-index text-white/75">{s.k}</span>
                    <s.Icon size={22} weight="light" className="text-white/80" />
                  </div>

                  <h3 className="mt-8 font-display text-xl font-bold tracking-[-0.02em] md:text-[1.4rem]">
                    {s.title}
                  </h3>

                  {s.lede ? (
                    <p className="mt-2.5 text-sm leading-relaxed text-white/80">{s.lede}</p>
                  ) : null}

                  <ul className="mt-6 space-y-2.5">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-sm text-white/90">
                        <span aria-hidden className="h-px w-3 flex-none bg-white/60" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealItem>
          ))}

          {/* Sixth cell completes the grid and gives the row somewhere to go. */}
          <RevealItem className="min-w-0">
            <div className="depth-cell flex h-full min-h-80 flex-col justify-between rounded-2xl border border-(--hairline-strong) bg-(--surface) p-7 md:p-8">
              <span className="u-meta text-(--text-secondary)">Take a closer look</span>
              <div>
                <p className="font-display text-xl font-bold tracking-[-0.02em] md:text-[1.4rem]">
                  Get to know our work, approach, and the brands we've helped build.
                </p>
                <div className="mt-7">
                  <MagneticButton
                    href={BROCHURE || BROCHURE_FALLBACK}
                    variant="secondary"
                    className="gap-2 rounded-full"
                  >
                    <DownloadSimple size={17} weight="bold" />
                    Download
                  </MagneticButton>
                </div>
                <p className="u-meta mt-5 text-(--text-secondary)">
                  Company brochure + case studies
                </p>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
      </ScrollStage>
    </section>
  );
}

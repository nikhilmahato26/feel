"use client";

import {
  ArrowsClockwise,
  Compass,
  PaintBrush,
  Rocket,
  VideoCamera,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import MagneticButton from "./MagneticButton";

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
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <SectionHeader
          index="03"
          label="Services"
          title="One integrated marketing system."
          lede="Five disciplines, one team, one thread running through all of them. Hover a box for what sits inside it."
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
                tabIndex={0}
                aria-label={s.title}
                className="depth-cell group relative flex h-full min-h-80 flex-col overflow-hidden rounded-2xl p-7 text-(--hero-text) md:p-8"
                style={{
                  background:
                    "linear-gradient(155deg, var(--color-accent), var(--color-accent-2))",
                }}
              >
                {/* Oversized index filling the lower half, traded for the list
                    on hover so the collapsed box isn't half empty. */}
                <span
                  aria-hidden
                  className="svc-watermark pointer-events-none absolute -bottom-8 -right-2 font-display text-[9rem] font-extrabold leading-none tracking-[-0.05em] text-white/10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-focus-within:opacity-0"
                >
                  {s.k}
                </span>

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="u-index text-white/75">{s.k}</span>
                  <s.Icon size={22} weight="light" className="text-white/80" />
                </div>

                <h3 className="relative z-10 mt-8 font-display text-xl font-bold tracking-[-0.02em] md:text-[1.4rem]">
                  {s.title}
                </h3>

                {s.lede ? (
                  <p className="relative z-10 mt-2.5 text-sm leading-relaxed text-white/80">
                    {s.lede}
                  </p>
                ) : null}

                <ul className="svc-list relative z-10 mt-6 space-y-2.5 opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm text-white/90">
                      <span aria-hidden className="h-px w-3 flex-none bg-white/60" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}

          {/* Sixth cell completes the grid and gives the row somewhere to go. */}
          <RevealItem className="min-w-0">
            <div className="depth-cell flex h-full min-h-80 flex-col justify-between rounded-2xl border border-(--hairline-strong) bg-(--surface) p-7 md:p-8">
              <span className="u-meta text-(--text-secondary)">Not sure where to start</span>
              <div>
                <p className="font-display text-xl font-bold tracking-[-0.02em] md:text-[1.4rem]">
                  Most people need two of these, not five.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-(--text-secondary)">
                  Tell us where you are and we'll tell you which of the five actually moves the
                  needle for you.
                </p>
                <div className="mt-7">
                  <MagneticButton
                    href="mailto:connect@feelzfilms.com?subject=Which%20services%20do%20we%20need"
                    variant="secondary"
                    className="rounded-full"
                  >
                    Ask us
                  </MagneticButton>
                </div>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

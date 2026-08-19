import {
  Compass,
  UserCircle,
  FilmSlate,
  Lightning,
  PaintBrush,
  Rocket,
} from "@phosphor-icons/react";
import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";

const services = [
  { Icon: Compass, title: "Positioning", copy: "Know what you're known for" },
  { Icon: UserCircle, title: "Personal brand", copy: "Founders as recognizable voices" },
  { Icon: FilmSlate, title: "Long-form", copy: "YouTube, podcasts, documentaries" },
  { Icon: Lightning, title: "Short-form", copy: "Clips built to stop the scroll" },
  { Icon: PaintBrush, title: "Visuals", copy: "Thumbnails, motion, brand assets" },
  { Icon: Rocket, title: "Production", copy: "Launches, campaigns, brand films" },
];

/**
 * Wraps a grid cell so a soft accent light tracks the cursor across it. The
 * position is written straight to CSS custom properties rather than to state —
 * pointer moves shouldn't re-render six cells.
 */
function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMove} className={className}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-(--bg-alt) border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <SectionHeader
          index="04"
          label="Services"
          title="One integrated content system."
          lede="Six disciplines, one team, one thread running through all of them."
          className="mb-16 md:mb-20"
        />

        {/* Spec-sheet grid: cells defined by hairlines rather than by cards. */}
        <RevealGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-(--hairline)"
          stagger={0.05}
        >
          {services.map((s, i) => (
            <RevealItem key={s.title} className="min-w-0">
              <Spotlight className="group relative h-full border-b border-r border-(--hairline) p-8 md:p-10 overflow-hidden">
              <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
                <span className="u-index text-(--text-secondary) opacity-50 group-hover:text-(--accent) group-hover:opacity-100 transition-colors duration-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.Icon
                  size={24}
                  weight="light"
                  className="text-(--text-secondary) opacity-70 transition-[color,transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-(--accent) group-hover:opacity-100 group-hover:-translate-y-0.5"
                />
              </div>

              <h3 className="relative z-10 font-display font-semibold text-xl md:text-[1.4rem] tracking-[-0.02em] mb-2.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                {s.title}
              </h3>
              <p className="relative z-10 text-sm md:text-base text-(--text-secondary) leading-relaxed">
                {s.copy}
              </p>
              </Spotlight>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

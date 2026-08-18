import {
  Compass,
  UserCircle,
  FilmSlate,
  Lightning,
  PaintBrush,
  Rocket,
} from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "./Reveal";
import { DotPattern } from "@/components/ui/dot-pattern";

const services = [
  { Icon: Compass, title: "Positioning", copy: "Know what you're known for" },
  { Icon: UserCircle, title: "Personal brand", copy: "Founders as recognizable voices" },
  { Icon: FilmSlate, title: "Long-form", copy: "YouTube, podcasts, documentaries" },
  { Icon: Lightning, title: "Short-form", copy: "Clips built to stop the scroll" },
  { Icon: PaintBrush, title: "Visuals", copy: "Thumbnails, motion, brand assets" },
  { Icon: Rocket, title: "Production", copy: "Launches, campaigns, brand films" },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-(--bg-alt) relative overflow-hidden">
      <DotPattern className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] opacity-40" />
      <div className="max-w-285 mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-14">
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.3rem+2vw,3rem)] tracking-[-0.02em] text-balance">
            One integrated content system.
          </h2>
        </div>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.06}>
          {services.map((s) => (
            <RevealItem key={s.title} className="glass-card rounded-[2rem] p-8 md:p-10 text-left flex flex-col h-full group relative overflow-hidden">
              <div className="relative z-10 w-14 h-14 rounded-full bg-(--accent-soft) text-(--accent) flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                <s.Icon size={28} weight="light" />
              </div>
              <h3 className="relative z-10 text-xl md:text-2xl font-display font-semibold mb-3">{s.title}</h3>
              <p className="relative z-10 text-sm md:text-base text-(--text-secondary) leading-relaxed mb-8 flex-1">{s.copy}</p>
              
              <div className="relative z-10 self-end mt-auto w-10 h-10 rounded-full border border-(--border) flex items-center justify-center transition-all duration-300 group-hover:bg-(--text) group-hover:border-transparent group-hover:text-(--bg)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

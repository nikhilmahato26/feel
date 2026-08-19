import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import VideoCard from "./VideoCard";

export default function Testimonials() {
  return (
    <section id="portfolio" className="py-24 md:py-32 border-b border-(--border)">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-16">
          <SectionHeader
            index="03"
            label="Portfolio"
            title="Hear it from the people we've worked with."
          />
          <span className="u-meta text-(--text-secondary) opacity-60 pb-2">
            Contact sheet · 05 frames
          </span>
        </div>

        <RevealGroup
          className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-3"
          stagger={0.07}
        >
          <RevealItem className="min-w-0">
            <VideoCard index="01" label="Featured client testimonial" featured className="h-80 md:h-full" />
          </RevealItem>
          <RevealItem className="flex flex-col gap-3 min-w-0">
            <VideoCard index="02" label="Testimonial" className="h-36" />
            <VideoCard index="03" label="Testimonial" className="h-36" />
          </RevealItem>
          <RevealItem className="flex flex-col gap-3 min-w-0">
            <VideoCard index="04" label="Testimonial" className="h-36" />
            <VideoCard index="05" label="Testimonial" className="h-36" />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeader from "./SectionHeader";
import VideoCard from "./VideoCard";
import Tilt3D from "./Tilt3D";
import ScrollStage from "./ScrollStage";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-14 md:py-24 border-b border-(--border)">
      <ScrollStage>
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-16">
          <SectionHeader
            index="04"
            label="Testimonials"
            title="Hear it from the people we've worked with."
          />

          <Link
            to="/portfolio"
            className="cursor-hover-target group u-meta flex items-center gap-2 pb-2 text-(--text-secondary) transition-colors duration-300 hover:text-(--accent)"
          >
            See all work
            <ArrowRight
              size={14}
              className="transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        <RevealGroup
          className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-3"
          stagger={0.07}
        >
          <RevealItem className="min-w-0">
            <Tilt3D className="h-80 md:h-full" glare={false} max={6}>
              <VideoCard index="01" label="Featured client story" featured className="h-full" />
            </Tilt3D>
          </RevealItem>
          <RevealItem className="flex flex-col gap-3 min-w-0">
            {["02", "03"].map((i) => (
              <Tilt3D key={i} className="h-36" glare={false} max={8}>
                <VideoCard index={i} label="Testimonial" className="h-full" />
              </Tilt3D>
            ))}
          </RevealItem>
          <RevealItem className="flex flex-col gap-3 min-w-0">
            {["04", "05"].map((i) => (
              <Tilt3D key={i} className="h-36" glare={false} max={8}>
                <VideoCard index={i} label="Testimonial" className="h-full" />
              </Tilt3D>
            ))}
          </RevealItem>
        </RevealGroup>
      </div>
      </ScrollStage>
    </section>
  );
}

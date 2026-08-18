import { RevealGroup, RevealItem } from "./Reveal";
import VideoCard from "./VideoCard";

export default function Testimonials() {
  return (
    <section id="portfolio" className="py-20 md:py-28">
      <div className="max-w-285 mx-auto px-6 md:px-8">
        <div className="max-w-xl mx-auto text-center mb-14">
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.3rem+2vw,3rem)] tracking-[-0.02em] text-balance">
            Hear it from the people we've worked with.
          </h2>
        </div>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-4">
          <RevealItem>
            <VideoCard label="Featured client testimonial" className="h-72 md:h-full" playSize={26} />
          </RevealItem>
          <RevealItem className="flex flex-col gap-4">
            <VideoCard label="Testimonial" className="h-32" playSize={17} />
            <VideoCard label="Testimonial" className="h-32" playSize={17} />
          </RevealItem>
          <RevealItem className="flex flex-col gap-4">
            <VideoCard label="Testimonial" className="h-32" playSize={17} />
            <VideoCard label="Testimonial" className="h-32" playSize={17} />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

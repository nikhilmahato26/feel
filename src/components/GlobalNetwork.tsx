import { WorldMap } from "@/components/ui/map";
import { Reveal } from "./Reveal";

const INDIA = { lat: 28.6139, lng: 77.209, label: "New Delhi (HQ)" };
const US = { lat: 37.0902, lng: -95.7129, label: "United States" };
const UK = { lat: 51.5074, lng: -0.1278, label: "United Kingdom" };
const CANADA = { lat: 56.1304, lng: -106.3468, label: "Canada" };
const AUSTRALIA = { lat: -25.2744, lng: 133.7751, label: "Australia" };
const UAE = { lat: 23.4241, lng: 53.8478, label: "UAE" };

export default function GlobalNetwork() {
  return (
    <section className="py-20 md:py-28 bg-(--bg-alt) overflow-hidden border-t border-(--border)">
      <div className="max-w-300 mx-auto px-6 md:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-xs tracking-[0.15em] font-bold text-(--accent) uppercase mb-4">Markets Served</p>
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.5rem+2vw,3rem)] tracking-tight text-(--text) text-balance">
            Global Reach, Local Impact
          </h2>
          <p className="text-sm md:text-base text-(--text-secondary) max-w-2xl mx-auto py-4">
            We operate out of New Delhi but our content strategies reach audiences and clients worldwide.
          </p>
        </Reveal>

        <Reveal y={24} delay={0.2} className="relative w-full max-w-5xl mx-auto">
          <WorldMap
            dots={[
              { start: INDIA, end: US },
              { start: INDIA, end: UK },
              { start: INDIA, end: CANADA },
              { start: INDIA, end: AUSTRALIA },
              { start: INDIA, end: UAE },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}

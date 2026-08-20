"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import SectionHeader from "./SectionHeader";
import Counter from "./Counter";

/**
 * The map drags in a full cartographic projection library — the bulk of the
 * bundle. It lives at the bottom of the page, so it is fetched only once the
 * section is close to the viewport, behind a placeholder of identical size.
 */
const WorldMap = lazy(() =>
  import("@/components/ui/map").then((m) => ({ default: m.WorldMap })),
);

const INDIA = { lat: 28.6139, lng: 77.209, label: "New Delhi (HQ)" };
const US = { lat: 37.0902, lng: -95.7129, label: "United States" };
const UK = { lat: 51.5074, lng: -0.1278, label: "United Kingdom" };
const CANADA = { lat: 56.1304, lng: -106.3468, label: "Canada" };
const AUSTRALIA = { lat: -25.2744, lng: 133.7751, label: "Australia" };
const UAE = { lat: 23.4241, lng: 53.8478, label: "UAE" };

const FRAME =
  "w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] rounded-3xl border border-(--border) bg-(--bg)";

function MapPlaceholder() {
  return (
    <div className={`${FRAME} grid place-items-center`}>
      <span className="u-meta text-(--text-secondary) opacity-45">Loading map</span>
    </div>
  );
}

export default function GlobalNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-(--bg-alt) overflow-hidden border-t border-(--border)">
      <div className="max-w-300 mx-auto px-6 md:px-8">
        <SectionHeader
          index="05"
          label="Markets served"
          title="Global Reach, Local Impact"
          lede="We operate out of New Delhi but our content strategies reach audiences and clients worldwide."
          align="center"
          className="mb-16"
        />

        <Reveal y={24} delay={0.2} className="relative w-full max-w-5xl mx-auto">
          <div ref={ref}>
            {near ? (
              <Suspense fallback={<MapPlaceholder />}>
                <WorldMap
                  dots={[
                    { start: INDIA, end: US },
                    { start: INDIA, end: UK },
                    { start: INDIA, end: CANADA },
                    { start: INDIA, end: AUSTRALIA },
                    { start: INDIA, end: UAE },
                  ]}
                />
              </Suspense>
            ) : (
              <MapPlaceholder />
            )}
          </div>

          {/* Reach figures, set into the open water left of South America.
              Static under the map on small screens, inset once there is room. */}
          <dl className="pointer-events-none mt-8 grid grid-cols-3 gap-6 lg:mt-0 lg:absolute lg:bottom-10 lg:left-10 lg:grid-cols-1 lg:gap-0 lg:w-44">
            <div className="lg:border-b lg:border-(--hairline) lg:pb-4">
              <dt className="u-meta text-(--text-secondary) order-2 mt-2 block lg:mt-2.5">
                Markets served
              </dt>
              <dd className="font-display font-bold text-2xl lg:text-3xl tracking-[-0.02em] tabular-nums">
                <Counter to={6} pad={2} />
              </dd>
            </div>
            <div className="lg:border-b lg:border-(--hairline) lg:py-4">
              <dt className="u-meta text-(--text-secondary) order-2 mt-2 block lg:mt-2.5">
                Continents
              </dt>
              <dd className="font-display font-bold text-2xl lg:text-3xl tracking-[-0.02em] tabular-nums">
                <Counter to={4} pad={2} />
              </dd>
            </div>
            <div className="lg:pt-4">
              <dt className="u-meta text-(--text-secondary) order-2 mt-2 block lg:mt-2.5">
                Studio
              </dt>
              <dd className="font-display font-bold text-xl lg:text-2xl tracking-[-0.02em]">
                New Delhi
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

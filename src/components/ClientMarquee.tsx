/**
 * Logo wall: square brand tiles running right to left, name underneath.
 *
 * Flat on purpose. The wall used to be a rotating 3D drum, which put half the
 * logos at an angle or facing away — the opposite of what a client wall is for.
 * A brand mark should be shown square-on and legible, so the depth work stays
 * on the hero and this band just reads.
 *
 * Tiles are the artwork exactly as supplied: 1:1, each with its own background
 * colour, since several are white marks that would vanish knocked out.
 */
interface Client {
  slug: string;
  name: string;
}

/**
 * Ordered so no two neighbours share a background. Three of these tiles are
 * white or near-white and three are blue; left in supplied order they paired up
 * and read as one wide tile with two logos floating in it. The sequence below
 * alternates light, blue and coloured, and it holds across the loop seam too —
 * the last tile sits next to the first once it wraps.
 */
const CLIENTS: Client[] = [
  { slug: "unacademy", name: "Unacademy" }, // white
  { slug: "college-vidya", name: "College Vidya" }, // blue
  { slug: "mamaearth", name: "Mamaearth" }, // white
  { slug: "topaz-consulting", name: "Topaz Consulting Services" }, // navy
  { slug: "enable", name: "Enable" }, // near-white
  { slug: "oechsli", name: "Oechsli" }, // red
  { slug: "unicef", name: "UNICEF" }, // cyan
  { slug: "bailey-group", name: "The Bailey Group" }, // orange
  { slug: "smartscale360", name: "SmartScale360" }, // blue
  { slug: "fobet-media", name: "Fobet Media" }, // mauve
];

/**
 * Exactly two runs of the list. The keyframe travels -50%, so at the end of a
 * cycle the second run has to sit precisely where the first began.
 *
 * That only holds if every item carries its own trailing gap. With a flex
 * `gap`, the track is 20 items plus 19 gaps, so half of it lands half a gap
 * short of one full run and the strip visibly jumps every cycle — which is the
 * loop "ending". The spacing is padding on each item instead, making the track
 * exactly two identical halves.
 */
const TRACK = [...CLIENTS, ...CLIENTS];

export default function ClientMarquee() {
  return (
    <section
      aria-label="Clients"
      className="relative overflow-hidden border-b border-(--border) bg-(--bg-alt)"
    >
      <div className="flex items-center gap-3 px-6 pt-7 md:px-8">
        <span aria-hidden className="h-px w-6 bg-(--accent)" />
        <span className="u-meta text-(--accent)">Trusted by</span>
        <span aria-hidden className="h-px flex-1 bg-(--hairline)" />
        <span className="u-meta hidden text-(--text-secondary) sm:block">Industry giants</span>
      </div>

      {/* marquee-track is what the CSS uses to pause the run on hover. */}
      <div
        className="marquee-track relative py-7 md:py-8"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        {/* Each item's width includes its trailing gap, so the tile itself is
            72px on mobile and 80px from md up. */}
        <ul className="marquee-left flex w-max items-start">
          {TRACK.map((c, i) => (
            <li key={`${c.slug}-${i}`} className="w-24 shrink-0 pr-6 md:w-28 md:pr-8">
              <div className="aspect-square overflow-hidden rounded-xl border border-(--hairline-strong) bg-(--surface) shadow-[var(--shadow-sm)]">
                <img
                  src={`/clients/tile/${c.slug}.jpg`}
                  // Empty alt: the name sits right underneath as real text, so
                  // labelling the image too would announce every client twice.
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2.5 text-center text-[0.6875rem] font-medium leading-tight text-(--text-secondary)">
                {c.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

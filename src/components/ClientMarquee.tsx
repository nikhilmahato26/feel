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

const CLIENTS: Client[] = [
  { slug: "unacademy", name: "Unacademy" },
  { slug: "mamaearth", name: "Mamaearth" },
  { slug: "unicef", name: "UNICEF" },
  { slug: "enable", name: "Enable" },
  { slug: "college-vidya", name: "College Vidya" },
  { slug: "smartscale360", name: "SmartScale360" },
  { slug: "fobet-media", name: "Fobet Media" },
  { slug: "bailey-group", name: "The Bailey Group" },
  { slug: "topaz-consulting", name: "Topaz Consulting Services" },
  { slug: "oechsli", name: "Oechsli" },
];

/**
 * Exactly two runs of the list: the marquee keyframe travels -50%, so at the
 * end of a cycle the second run sits precisely where the first began and the
 * loop has no seam.
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
        <ul className="marquee-left flex w-max items-start gap-6 md:gap-8">
          {TRACK.map((c, i) => (
            <li key={`${c.slug}-${i}`} className="w-[4.5rem] shrink-0 md:w-20">
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

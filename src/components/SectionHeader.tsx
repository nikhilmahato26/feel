import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  /** Two-digit section index, e.g. "01". Rendered in the mono meta register. */
  index: string;
  label: string;
  title: string;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * The one header treatment used by every section: a mono eyebrow carrying an
 * index and a label, a hairline that runs to the edge of the measure, then the
 * display headline. Consistency here is most of what separates an editorial
 * layout from a stack of centred divs.
 */
export default function SectionHeader({
  index,
  label,
  title,
  lede,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal className={className}>
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="u-index text-(--accent)">{index}</span>
        <span className="u-meta text-(--text-secondary)">{label}</span>
        <span
          aria-hidden
          className={`h-px bg-(--hairline) ${centered ? "w-10" : "flex-1 max-w-40"}`}
        />
      </div>

      <h2
        className={`u-display mt-6 text-[clamp(1.9rem,1.35rem+2.3vw,3.4rem)] ${
          centered ? "mx-auto text-center max-w-[22ch]" : "max-w-[19ch]"
        }`}
      >
        <TextReveal text={title} />
      </h2>

      {lede ? (
        <p
          className={`mt-5 text-base md:text-lg leading-relaxed text-(--text-secondary) max-w-[52ch] ${
            centered ? "mx-auto text-center" : ""
          }`}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}

const PILLS = Array.from({ length: 10 }, (_, i) => i);

function Row({ direction }: { direction: "left" | "right" }) {
  return (
    <div className="overflow-hidden mb-3.5 last:mb-0">
      <div className={`flex gap-10 w-max ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {[...PILLS, ...PILLS].map((_, i) => (
          <span
            key={`${direction}-${i}`}
            className="inline-block whitespace-nowrap text-xs font-semibold text-(--accent) border border-dashed border-(--accent) rounded-md px-4 py-2"
          >
            Client logo
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <div className="marquee-track bg-(--accent-soft) py-6 overflow-hidden">
      <Row direction="left" />
      <Row direction="right" />
    </div>
  );
}

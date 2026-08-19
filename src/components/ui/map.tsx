import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import DottedMap from "dotted-map";
import { useTheme } from "@/lib/useTheme";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  loop?: boolean;
}

export function WorldMap({
  dots = [],
  lineColor = "var(--map-arc)",
  showLabels = true,
  animationDuration = 2,
  loop = true,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const { theme } = useTheme();

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: theme === "dark" ? "#FFFF7F40" : "#00000040",
        shape: "circle",
        backgroundColor: theme === "dark" ? "#0a0a0a" : "#ffffff",
      }),
    [map, theme]
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Calculate animation timing
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2; // Pause for 2 seconds when all paths are drawn
  const fullCycleDuration = totalAnimationTime + pauseTime;

  // Several arcs share one origin, so drawing markers per-arc stacked five
  // copies of the HQ pin, its pulse and its label on top of each other. Collapse
  // to unique locations, then nudge any label that would collide with one
  // already placed (New Delhi and UAE sit close enough to overlap).
  const locations: Array<{ x: number; y: number; label: string; labelY: number; i: number }> = [];
  const seen = new Set<string>();
  const placed: Array<{ x: number; y: number }> = [];

  dots.forEach((dot) => {
    [dot.start, dot.end].forEach((point) => {
      if (!point.label || seen.has(point.label)) return;
      seen.add(point.label);

      const { x, y } = projectPoint(point.lat, point.lng);
      const collides = (candidate: number) =>
        placed.some((b) => Math.abs(b.x - x) < 92 && Math.abs(b.y - candidate) < 27);

      let labelY = y - 35; // above the pin by default
      if (collides(labelY)) labelY = y + 11; // flip below
      if (collides(labelY)) labelY = y - 64; // otherwise stack clear

      placed.push({ x, y: labelY });
      locations.push({ x, y, label: point.label, labelY, i: locations.length });
    });
  });

  return (
    <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] bg-(--bg) rounded-3xl relative font-sans overflow-hidden border border-(--border) shadow-(--shadow-sm)">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none object-cover opacity-60"
        alt="world map"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          // Calculate keyframe times for this specific path
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? {
                        pathLength: [0, 0, 1, 1, 0],
                      }
                    : {
                        pathLength: 1,
                      }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')`,
                  }}
                />
              )}
            </g>
          );
        })}

        {locations.map((loc) => (
          <g key={`loc-${loc.label}`}>
            <motion.g
              onHoverStart={() => setHoveredLocation(loc.label)}
              onHoverEnd={() => setHoveredLocation(null)}
              className="cursor-pointer"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <circle
                cx={loc.x}
                cy={loc.y}
                r="3"
                fill={lineColor}
                filter="url(#glow)"
                className="drop-shadow-lg"
              />
              <circle cx={loc.x} cy={loc.y} r="3" fill={lineColor} opacity="0.5">
                <animate
                  attributeName="r"
                  from="3"
                  to="12"
                  dur="2s"
                  begin={`${loc.i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2s"
                  begin={`${loc.i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </motion.g>

            {showLabels && (
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + loc.i * 0.22, duration: 0.5 }}
                className="pointer-events-none"
              >
                <foreignObject x={loc.x - 50} y={loc.labelY} width="100" height="30" className="block">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-(--card) text-(--text) border border-(--border) shadow-sm whitespace-nowrap">
                      {loc.label}
                    </span>
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </g>
        ))}

      </svg>

      {/* Mobile Tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-(--card) text-(--text) px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm sm:hidden border border-(--border)"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

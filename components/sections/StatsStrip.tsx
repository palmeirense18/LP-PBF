"use client";

import { useEffect, useState } from "react";
import StatCounter, { type Stat } from "@/components/ui/StatCounter";
import { useInViewOnce } from "@/lib/useInViewOnce";

const STATS: Stat[] = [
  {
    id: "tolerance",
    kind: "static",
    display: '±0.0001"',
    label: "Tolerance Achieved",
  },
  {
    id: "years",
    kind: "count",
    from: 0,
    to: 40,
    suffix: "+",
    decimals: 0,
    label: "Years of Operation",
  },
  {
    id: "capacity",
    kind: "static",
    display: "24/7",
    label: "Production Capacity",
  },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Dividers sit between the three items: 1/3 and 2/3 of the strip.
const DIVIDER_POSITIONS = [100 / 3, 200 / 3] as const;

export default function StatsStrip() {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.6);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showLines = reducedMotion ? true : inView;

  const horizLineStyle = (delay: number): React.CSSProperties => ({
    transformOrigin: "50% 50%",
    transform: `scaleX(${showLines ? 1 : 0})`,
    transition: reducedMotion ? "none" : `transform 900ms ${EASE} ${delay}ms`,
  });

  const vertLineStyle = (delay: number): React.CSSProperties => ({
    transformOrigin: "50% 0%",
    transform: `scaleY(${showLines ? 1 : 0})`,
    transition: reducedMotion ? "none" : `transform 900ms ${EASE} ${delay}ms`,
  });

  return (
    <section
      ref={ref}
      aria-label="Company metrics"
      className="relative bg-ink py-20 md:py-28"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 block h-px bg-royal/60"
        style={horizLineStyle(0)}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-royal/60"
        style={horizLineStyle(0)}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10">
        <div className="relative grid grid-cols-1 md:grid-cols-3">
          {/* Mobile: stacked items separated by horizontal hairlines. */}
          {DIVIDER_POSITIONS.map((pos) => (
            <span
              key={`h-${pos}`}
              aria-hidden
              className="pointer-events-none absolute left-0 h-px w-full bg-mediumGray/15 md:hidden"
              style={{ top: `${pos}%` }}
            />
          ))}

          {/* Desktop: three columns separated by Royal Blue vertical dividers. */}
          {DIVIDER_POSITIONS.map((pos) => (
            <span
              key={`v-${pos}`}
              aria-hidden
              className="pointer-events-none absolute top-0 hidden h-full w-px -translate-x-1/2 bg-royal/40 md:block"
              style={{
                left: `${pos}%`,
                ...vertLineStyle(200),
              }}
            />
          ))}

          {STATS.map((stat, i) => (
            <StatCounter
              key={stat.id}
              stat={stat}
              play={inView}
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

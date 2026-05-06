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
  {
    id: "cert",
    kind: "count",
    from: 0,
    to: 9100,
    prefix: "AS",
    decimals: 0,
    formatNoCommas: true,
    label: "Quality Certified",
  },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COLUMN_POSITIONS = [25, 50, 75] as const;

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

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="relative grid grid-cols-2 md:grid-cols-4">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-mediumGray/15 md:hidden"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-mediumGray/15 md:hidden"
          />

          {COLUMN_POSITIONS.map((pos) => (
            <span
              key={pos}
              aria-hidden
              className="pointer-events-none absolute top-0 hidden h-full w-px -translate-x-1/2 bg-mediumGray/15 md:block"
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

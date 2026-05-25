"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WHY_PBF } from "@/lib/why-pbf-data";
import { WHY_PBF_ICONS } from "@/components/ui/icons/WhyPbfIcons";

const EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Sentence-case titles (data file stays Title Case for other consumers; we
// present them lowercased-after-first-word here per the editorial spec).
const TITLE_OVERRIDES: Record<string, string> = {
  "Fast Lead Times": "Fast lead times",
  "Precision Machining": "Precision machining",
  "Multi-Axis Capability": "Multi-axis capability",
  "Tight Tolerances": "Tight tolerances",
  "Responsive Communication": "Responsive communication",
  "New Jersey Based": "New Jersey based",
};

export default function WhyPbf() {
  const reduced = useReducedMotion() ?? false;

  // Reveal: rows rise 16px + fade, staggered. Reduced motion = fade only.
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EXPO },
    },
  };

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="relative w-full overflow-hidden py-20 lg:py-40 md:py-32"
      style={{ backgroundColor: "#1B1E1F" }}
    >
      {/* Layered background — technical grid + volumetric corner light */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(192,197,206,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(192,197,206,0.04) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 55% at 12% 0%, rgba(43,91,166,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header meta row */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={container}
        >
          <motion.div
            variants={item}
            className="flex items-baseline justify-between"
          >
            <span
              aria-hidden
              className="font-display uppercase text-silver"
              style={{
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.42em",
              }}
            >
              INDEX / 06
            </span>
            <span
              aria-hidden
              className="font-display uppercase text-silver"
              style={{
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.42em",
              }}
            >
              WHY PBF MACHINE
            </span>
          </motion.div>

          {/* Hairline rule under the meta row */}
          <motion.span
            variants={item}
            aria-hidden
            className="mt-5 block h-px w-full"
            style={{ backgroundColor: "rgba(192,197,206,0.2)" }}
          />

          {/* Editorial heading */}
          <motion.h2
            variants={item}
            id="why-heading"
            className="mt-12 font-display font-bold text-bone md:mt-16"
            style={{
              fontSize: "clamp(40px, 5.6vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="block">Six reasons clients</span>
            <span className="block">
              <span className="relative inline-block">
                ship
                <span
                  aria-hidden
                  className="absolute left-0 right-0"
                  style={{
                    bottom: "-0.08em",
                    height: "2px",
                    backgroundColor: "#2B5BA6",
                  }}
                />
              </span>{" "}
              with us.
            </span>
          </motion.h2>

          {/* Lede */}
          <motion.p
            variants={item}
            className="mt-7 max-w-[640px] font-body text-mediumGray"
            style={{ fontSize: "17px", lineHeight: 1.55 }}
          >
            No assembly-line shop. No layered sales pitch. Just the six things
            that actually matter on a quote.
          </motion.p>
        </motion.div>

        {/* The index list */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={container}
          className="mt-14 md:mt-20"
        >
          {WHY_PBF.map((entry, i) => {
            const Icon = WHY_PBF_ICONS[entry.iconKey];
            const marker = `Ø${String(i + 1).padStart(2, "0")}`;
            const title = TITLE_OVERRIDES[entry.title] ?? entry.title;
            const isFirst = i === 0;

            return (
              <motion.li
                key={entry.iconKey}
                variants={item}
                data-cursor="hover"
                className="why-row group grid grid-cols-1 items-start gap-x-6 gap-y-4 py-10 md:grid-cols-12 lg:py-14"
                style={{
                  borderTop: isFirst
                    ? undefined
                    : "1px solid rgba(192,197,206,0.12)",
                  transition: "border-color 240ms ease-out",
                }}
              >
                {/* Marker + icon — share row 1 on mobile, split cols on desktop */}
                <div className="flex items-center gap-5 md:contents">
                  <span
                    aria-hidden
                    className="why-marker font-display uppercase md:col-span-1 md:col-start-1"
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      letterSpacing: "0.16em",
                      color: "rgba(192,197,206,0.5)",
                      transition: "color 240ms ease-out",
                    }}
                  >
                    {marker}
                  </span>
                  <span
                    aria-hidden
                    className="why-icon block h-8 w-8 shrink-0 md:col-span-1 md:col-start-2"
                    style={{
                      color: "rgba(43,91,166,0.75)",
                      transition: "color 240ms ease-out",
                    }}
                  >
                    <Icon />
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="why-title font-display font-bold text-bone md:col-span-6 md:col-start-3"
                  style={{
                    fontSize: "clamp(28px, 3.2vw, 44px)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.01em",
                    transition: "transform 240ms ease-out",
                  }}
                >
                  {title}
                </h3>

                {/* Body */}
                <p
                  className="why-body font-body md:col-span-4 md:col-start-9"
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.55,
                    color: "#95A5A6",
                    transition: "color 240ms ease-out",
                  }}
                >
                  {entry.body}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* Section footer */}
        <div
          className="mt-0 border-t pt-6"
          style={{ borderColor: "rgba(192,197,206,0.12)" }}
        >
          <span
            aria-hidden
            className="block text-right font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: "rgba(192,197,206,0.4)",
            }}
          >
            END OF INDEX · PBFMACHINE / NJ
          </span>
        </div>
      </div>
    </section>
  );
}

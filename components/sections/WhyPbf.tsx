"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WHY_PBF } from "@/lib/why-pbf-data";
import { WHY_PBF_ICONS } from "@/components/ui/icons/WhyPbfIcons";

const EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function WhyPbf() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="relative w-full bg-charcoal py-20 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col">
          <span
            aria-hidden
            className="font-display uppercase text-silver"
            style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.42em" }}
          >
            WHY PBF MACHINE
          </span>
          <h2
            id="why-heading"
            className="mt-4 max-w-3xl font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            Six reasons clients ship with us<span className="text-royal">.</span>
          </h2>
        </div>

        {/* Benefit grid — 1 / 2 / 3 columns */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {WHY_PBF.map((item, i) => {
            const Icon = WHY_PBF_ICONS[item.iconKey];
            return (
              <motion.div
                key={item.iconKey}
                className="why-card group relative overflow-hidden rounded-md border border-silver/[0.12] bg-[#22282A] p-6 transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] md:p-8 [@media(pointer:fine)]:hover:border-royal/60 [@media(pointer:fine)]:hover:shadow-[inset_0_0_28px_rgba(43,91,166,0.14)]"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EXPO }}
                whileHover={reduced ? undefined : { scale: 1.012 }}
              >
                <div
                  aria-hidden
                  className="h-10 w-10 text-royal transition-colors duration-150 [@media(pointer:fine)]:group-hover:text-royalLight"
                >
                  <Icon />
                </div>
                <h3
                  className="mt-6 font-display font-bold text-bone"
                  style={{
                    fontSize: "clamp(18px, 1.6vw, 22px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-3 font-body text-mediumGray"
                  style={{ fontSize: "15px", lineHeight: 1.6 }}
                >
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

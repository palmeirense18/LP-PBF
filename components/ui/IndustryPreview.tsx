"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AerospaceIcon,
  DefenseIcon,
  AutomotiveIcon,
  MedicalIcon,
  IndustrialIcon,
  EnergyIcon,
} from "@/components/ui/icons/IndustryIcons";
import {
  INDUSTRIES,
  type Industry,
  type IndustryIconKey,
} from "@/lib/industries-data";

const ICONS: Record<IndustryIconKey, () => JSX.Element> = {
  aerospace: AerospaceIcon,
  defense: DefenseIcon,
  automotive: AutomotiveIcon,
  medical: MedicalIcon,
  industrial: IndustrialIcon,
  energy: EnergyIcon,
};

interface IndustryPreviewProps {
  industry: Industry;
}

export default function IndustryPreview({ industry }: IndustryPreviewProps) {
  const Icon = ICONS[industry.icon];
  const indexNumber =
    INDUSTRIES.findIndex((i) => i.id === industry.id) + 1;
  const total = INDUSTRIES.length;
  const reduced = useReducedMotion();

  return (
    <div className="sticky top-32 flex min-h-[480px] flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={industry.id}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative flex flex-col"
        >
          {/* Sector code eyebrow */}
          <span
            className="mb-6 font-display uppercase text-bone"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
            }}
          >
            {industry.sectorCode}
          </span>

          {/* Icon */}
          <div className="h-20 w-20 text-bone" aria-hidden>
            <Icon />
          </div>

          {/* Industry name (huge) */}
          <h3
            className="mt-6 font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(56px, 7vw, 112px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            {industry.name}
            <span className="text-bone">.</span>
          </h3>

          {/* Bone rule */}
          <span
            aria-hidden
            className="mt-6 block h-px w-14 bg-bone"
          />

          {/* Body */}
          <p
            className="mt-8 max-w-md font-body"
            style={{
              fontSize: "clamp(17px, 1.3vw, 20px)",
              color: "rgba(192,197,206,0.85)",
              lineHeight: 1.7,
            }}
          >
            {industry.body}
          </p>

          {/* Lower-right decorative index */}
          <div
            aria-hidden
            className="mt-12 inline-flex flex-col items-end self-end text-right"
          >
            <span
              className="font-display uppercase text-mediumGray"
              style={{
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.42em",
              }}
            >
              INDUSTRY
            </span>
            <span
              className="mt-1 font-display font-bold uppercase text-mediumGray"
              style={{
                fontSize: "14px",
                letterSpacing: "0.18em",
              }}
            >
              {String(indexNumber).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

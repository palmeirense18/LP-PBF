"use client";

import type { ProcessStep as ProcessStepType } from "@/lib/process-data";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EASE_QUART = "cubic-bezier(0.25, 1, 0.5, 1)";
const EASE_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

interface ProcessStepProps {
  step: ProcessStepType;
  isActive: boolean;
}

export default function ProcessStep({ step, isActive }: ProcessStepProps) {
  const reduced = useReducedMotion();
  const titleOpacity = isActive || reduced ? 1 : 0.55;
  const bodyOpacity = isActive || reduced ? 1 : 0.4;
  const numberColor =
    isActive || reduced ? "rgba(192,197,206,0.18)" : "rgba(192,197,206,0.10)";
  const numberScale = isActive ? 1.02 : 1;
  const phaseColor = isActive ? "#6FA0E6" : "rgba(192,197,206,0.6)";
  const underlineWidth = isActive ? "8rem" : "0";
  const underlineDuration = isActive ? "700ms" : "280ms";
  const transitionMotion = reduced ? "none" : undefined;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 py-20 md:px-12 md:py-24">
      <div className="relative w-full max-w-3xl">
        {/* Huge background index */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 right-[-4%] z-0 select-none font-display font-bold uppercase"
          style={{
            fontSize: "clamp(180px, 26vw, 380px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: numberColor,
            transform: `scale(${numberScale})`,
            transformOrigin: "right top",
            transition: transitionMotion ?? `color 600ms ${EASE_QUART}, transform 800ms ${EASE_QUART}`,
          }}
        >
          {step.index}
        </span>

        <div className="relative z-10">
          {/* Phase tag */}
          <span
            className="mb-4 block font-display uppercase"
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: phaseColor,
              transition: transitionMotion ?? `color 500ms ${EASE_QUART}`,
            }}
          >
            PHASE {step.index} / {step.phase}
          </span>

          {/* Title */}
          <h3
            className="font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(40px, 5.4vw, 72px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              opacity: titleOpacity,
              transition: transitionMotion ?? `opacity 500ms ${EASE_QUART}`,
            }}
          >
            {step.title}
          </h3>

          {/* Underline */}
          <span
            aria-hidden
            className="mt-6 block h-px bg-royal"
            style={{
              width: underlineWidth,
              transition: transitionMotion ?? `width ${underlineDuration} ${EASE_QUINT}`,
            }}
          />

          {/* Body */}
          <p
            className="mt-8 max-w-xl font-body leading-relaxed text-mediumGray"
            style={{
              fontSize: "clamp(18px, 1.4vw, 22px)",
              opacity: bodyOpacity,
              transition: transitionMotion ?? `opacity 500ms ${EASE_QUART}`,
            }}
          >
            {step.body}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep as ProcessStepType } from "@/lib/process-data";

const EASE_QUART = "cubic-bezier(0.25, 1, 0.5, 1)";
const EASE_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

interface ProcessStepProps {
  step: ProcessStepType;
  isActive: boolean;
  layout: "pinned" | "stacked";
  total?: number;
}

export default function ProcessStep({
  step,
  isActive,
  layout,
  total = 5,
}: ProcessStepProps) {
  if (layout === "pinned") {
    return <PinnedStep step={step} isActive={isActive} />;
  }
  return <StackedStep step={step} total={total} />;
}

// ---------------------------------------------------------------------------
// Pinned variant
// ---------------------------------------------------------------------------

function PinnedStep({
  step,
  isActive,
}: {
  step: ProcessStepType;
  isActive: boolean;
}) {
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
    <div className="relative flex h-full w-screen flex-shrink-0 items-center justify-center overflow-hidden px-6 md:px-12">
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

// ---------------------------------------------------------------------------
// Stacked variant (mobile + reduced motion)
// ---------------------------------------------------------------------------

function StackedStep({
  step,
  total,
}: {
  step: ProcessStepType;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const visible = inView || reduced;

  return (
    <li
      ref={ref}
      data-process-step={step.id}
      data-process-active={visible ? "true" : "false"}
      className="relative py-12 pl-16 md:pl-24"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: reduced
          ? "none"
          : `opacity 600ms ${EASE_QUART}, transform 600ms ${EASE_QUART}`,
      }}
    >
      {/* Step marker */}
      <span
        aria-hidden
        className="absolute top-12 flex h-10 w-10 items-center justify-center rounded-full font-display font-bold uppercase"
        style={{
          left: "0.25rem",
          fontSize: "14px",
          letterSpacing: "0.05em",
          border: "1px solid rgba(43,91,166,1)",
          backgroundColor: visible ? "#2B5BA6" : "transparent",
          color: visible ? "#F5F5F5" : "#6FA0E6",
          transition: reduced
            ? "none"
            : `background-color 360ms ${EASE_QUART}, color 360ms ${EASE_QUART}`,
        }}
      >
        {step.index}
      </span>

      {/* Counter top-right */}
      <span
        aria-hidden
        className="absolute right-0 top-12 font-display text-silver/40"
        style={{
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "0.18em",
        }}
      >
        {step.index} / {String(total).padStart(2, "0")}
      </span>

      {/* Phase tag */}
      <span
        className="mb-3 block font-display uppercase"
        style={{
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.42em",
          color: visible ? "#6FA0E6" : "rgba(192,197,206,0.6)",
          transition: reduced ? "none" : `color 360ms ${EASE_QUART}`,
        }}
      >
        PHASE {step.index} / {step.phase}
      </span>

      <h3
        className="font-display font-bold uppercase text-bone"
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
        }}
      >
        {step.title}
      </h3>

      <span aria-hidden className="mt-4 block h-px w-12 bg-royal" />

      <p
        className="mt-5 max-w-xl font-body leading-relaxed text-mediumGray"
        style={{ fontSize: "clamp(16px, 2.2vw, 18px)" }}
      >
        {step.body}
      </p>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Reduced-motion hook
// ---------------------------------------------------------------------------

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

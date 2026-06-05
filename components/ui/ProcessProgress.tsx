"use client";

import { PROCESS } from "@/lib/process-data";

interface ProcessProgressProps {
  activeIndex: number;
  reduced: boolean;
  onStepClick?: (i: number) => void;
}

export default function ProcessProgress({
  activeIndex,
  reduced,
  onStepClick,
}: ProcessProgressProps) {
  const total = PROCESS.length;
  const fillPct = (activeIndex / (total - 1)) * 100;

  return (
    <div
      className="relative h-12 w-full"
      role="group"
      aria-label="Process step indicators"
    >
      <div className="relative h-full">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-mediumGray/15" />
        {/* Fill — driven by the active index */}
        <div
          aria-hidden
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-royal"
          style={{
            width: `${fillPct}%`,
            boxShadow: "0 0 12px rgba(43,91,166,0.4)",
            transition: reduced
              ? "none"
              : "width 0.5s cubic-bezier(0.45, 0, 0.55, 1)",
          }}
        />

        {/* Dot markers + labels — each wrapped in a zero-styled button so the
            indicators are clickable/keyboard-accessible. The button resets all
            browser chrome (no background, border, padding) so it is visually
            identical to a plain decorative marker at rest. */}
        {PROCESS.map((step, i) => {
          const pos = (i / (total - 1)) * 100;
          const active = i <= activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(i)}
              aria-label={`Go to step ${i + 1}: ${step.title}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                appearance: "none",
                background: "none",
                border: 0,
                padding: 0,
                margin: 0,
                left: `${pos}%`,
              }}
            >
              <span
                data-active={active ? "true" : "false"}
                aria-hidden
                className="process-progress-label absolute left-1/2 -top-5 -translate-x-1/2 font-display uppercase transition-colors duration-200"
                style={{
                  fontSize: "10px",
                  fontWeight: 400,
                  letterSpacing: "0.32em",
                }}
              >
                {step.index}
              </span>
              <span
                data-active={active ? "true" : "false"}
                aria-hidden
                className="process-progress-dot block h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200"
                style={{
                  outline: "2px solid #0A0A0A",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

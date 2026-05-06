"use client";

import type { MutableRefObject, RefObject } from "react";
import { PROCESS } from "@/lib/process-data";

interface ProcessProgressProps {
  activeIndex: number;
  fillRef: RefObject<HTMLDivElement>;
  dotRefs: MutableRefObject<Array<HTMLSpanElement | null>>;
  labelRefs: MutableRefObject<Array<HTMLSpanElement | null>>;
}

export default function ProcessProgress({
  activeIndex,
  fillRef,
  dotRefs,
  labelRefs,
}: ProcessProgressProps) {
  const total = PROCESS.length;

  return (
    <div
      className="relative mx-auto h-12 w-full max-w-[1440px] px-6 md:px-10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-label="Process step progress"
    >
      <div className="relative h-full">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-mediumGray/15" />
        {/* Fill */}
        <div
          ref={fillRef}
          aria-hidden
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-royal"
          style={{
            width: "0%",
            boxShadow: "0 0 12px rgba(43,91,166,0.4)",
            transition: "none",
            willChange: "width",
          }}
        />

        {/* Dot markers + labels */}
        {PROCESS.map((step, i) => {
          const pos = (i / (total - 1)) * 100;
          return (
            <div
              key={step.id}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos}%` }}
            >
              <span
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                data-active="false"
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
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                data-active="false"
                aria-hidden
                className="process-progress-dot block h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200"
                style={{
                  outline: "2px solid #0A0A0A",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

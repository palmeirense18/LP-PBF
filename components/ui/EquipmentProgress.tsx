"use client";

import type { MutableRefObject, RefObject } from "react";

interface EquipmentProgressProps {
  total: number;
  activeIndex: number;
  fillRef: RefObject<HTMLDivElement>;
  dotRefs: MutableRefObject<Array<HTMLSpanElement | null>>;
}

export default function EquipmentProgress({
  total,
  activeIndex,
  fillRef,
  dotRefs,
}: EquipmentProgressProps) {
  return (
    <div
      className="relative w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-label="Equipment slide progress"
    >
      <div className="relative h-px w-full bg-mediumGray/15">
        <div
          ref={fillRef}
          aria-hidden
          className="absolute inset-y-0 left-0 bg-royal"
          style={{
            width: "0%",
            boxShadow: "0 0 12px rgba(43,91,166,0.4)",
            transition: "none",
            willChange: "width",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[3px] flex justify-between"
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            data-active="false"
            className="equip-progress-dot block h-[7px] w-[7px] rounded-full transition-[background-color,box-shadow] duration-200"
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import type { Industry, IndustryIconKey } from "@/lib/industries-data";

export type { IndustryIconKey };

interface IndustryListItemProps {
  industry: Industry;
  isActive: boolean;
  onActivate: () => void;
}

export default function IndustryListItem({
  industry,
  isActive,
  onActivate,
}: IndustryListItemProps) {
  return (
    <li
      className="industry-li relative"
      data-active={isActive ? "true" : "false"}
      style={{
        borderTop: "1px solid rgba(192,197,206,0.12)",
        transition: "border-color 280ms cubic-bezier(0.25,1,0.5,1)",
      }}
    >
      <button
        type="button"
        data-cursor="hover"
        onPointerEnter={onActivate}
        onFocus={onActivate}
        aria-pressed={isActive}
        className="industry-li-button group flex w-full items-center justify-between gap-4 py-5 text-left outline-none transition-transform duration-[280ms] ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:ring-2 focus-visible:ring-royal/40 md:py-6"
        style={{
          transform: isActive ? "translateX(8px)" : "translateX(0)",
        }}
      >
        <span className="relative">
          <span
            className="industry-li-name block font-display font-bold uppercase"
            style={{
              fontSize: "clamp(22px, 2vw, 30px)",
              letterSpacing: "-0.005em",
              color: isActive ? "#F5F5F5" : "rgba(192,197,206,0.6)",
              transition: "color 280ms cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            {industry.name}
          </span>
          <span
            aria-hidden
            className="industry-li-underline absolute -bottom-0.5 left-0 block h-px w-6 bg-royal"
            style={{
              transformOrigin: "left center",
              transform: isActive ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 320ms cubic-bezier(0.25,1,0.5,1)",
            }}
          />
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="block h-1 w-1 bg-royal"
            style={{
              transformOrigin: "center",
              transform: isActive ? "scale(1)" : "scale(0)",
              transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <span
            className="font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: isActive ? "#6FA0E6" : "rgba(111,160,230,0.85)",
              transition: "color 280ms cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            {industry.sectorCode}
          </span>
        </span>
      </button>
    </li>
  );
}

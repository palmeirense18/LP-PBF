import type { WhyPbfIconKey } from "@/lib/why-pbf-data";

// Shared line-art props — stroke uses currentColor so the card controls hue.
const svgProps = {
  viewBox: "0 0 24 24",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/* Fast Lead Times — stopwatch */
export function LeadTimeIcon() {
  return (
    <svg {...svgProps}>
      {/* Crown + top bar */}
      <line x1="10" y1="3.5" x2="14" y2="3.5" />
      <line x1="12" y1="3.5" x2="12" y2="6.5" />
      {/* Side start button */}
      <line x1="18" y1="6" x2="19.5" y2="4.5" />
      {/* Clock body */}
      <circle cx="12" cy="14" r="7.5" />
      {/* Hand to ~1 o'clock + hub */}
      <line x1="12" y1="14" x2="15.5" y2="10.5" />
      <circle cx="12" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Precision Machining — crosshair / target reticle */
export function PrecisionIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" />
      {/* Reticle ticks crossing the rim */}
      <line x1="12" y1="2" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="22" y2="12" />
    </svg>
  );
}

/* Multi-Axis Capability — coordinate axis triad (X / Y / Z) */
export function MultiAxisIcon() {
  return (
    <svg {...svgProps}>
      {/* Origin */}
      <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
      {/* X axis (right) */}
      <line x1="10" y1="14" x2="20" y2="14" />
      <line x1="20" y1="14" x2="17.5" y2="12.5" />
      <line x1="20" y1="14" x2="17.5" y2="15.5" />
      {/* Y axis (up) */}
      <line x1="10" y1="14" x2="10" y2="4" />
      <line x1="10" y1="4" x2="8.5" y2="6.5" />
      <line x1="10" y1="4" x2="11.5" y2="6.5" />
      {/* Z axis (depth, down-left) */}
      <line x1="10" y1="14" x2="4" y2="19" />
      <line x1="4" y1="19" x2="6.6" y2="18.6" />
      <line x1="4" y1="19" x2="4.4" y2="16.4" />
    </svg>
  );
}

/* Tight Tolerances — micrometer (C-frame + spindle + thimble) */
export function ToleranceIcon() {
  return (
    <svg {...svgProps}>
      {/* C-frame, opening faces right */}
      <path d="M16 5.5 A 8 8 0 1 0 16 18.5" />
      {/* Anvil face */}
      <line x1="9.5" y1="9.5" x2="9.5" y2="14.5" />
      {/* Spindle axis */}
      <line x1="9.5" y1="12" x2="16.5" y2="12" />
      {/* Thimble / barrel */}
      <rect x="16.5" y="9.5" width="4.5" height="5" rx="0.5" />
      <line x1="18" y1="9.5" x2="18" y2="14.5" />
      <line x1="19.5" y1="9.5" x2="19.5" y2="14.5" />
    </svg>
  );
}

/* Responsive Communication — speech bubble with signal lines */
export function CommunicationIcon() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      {/* Tail */}
      <path d="M7 16 L7 20 L11 16" />
      {/* Signal lines */}
      <line x1="7" y1="8.5" x2="17" y2="8.5" />
      <line x1="7" y1="11.5" x2="14" y2="11.5" />
    </svg>
  );
}

/* New Jersey Based — simplified NJ state outline */
export function LocationIcon() {
  return (
    <svg {...svgProps}>
      <path d="M11 2 L15 4 L15 7 L16.5 11 L15 15 L13.5 20 L12 22 L10.5 19 L8.5 15 L8 11 L7.5 8 L9 4.5 Z" />
    </svg>
  );
}

export const WHY_PBF_ICONS: Record<WhyPbfIconKey, () => JSX.Element> = {
  leadtime: LeadTimeIcon,
  precision: PrecisionIcon,
  multiaxis: MultiAxisIcon,
  tolerance: ToleranceIcon,
  communication: CommunicationIcon,
  location: LocationIcon,
};

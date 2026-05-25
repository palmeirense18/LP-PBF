import type { WhyPbfIconKey } from "@/lib/why-pbf-data";

// Shared engineering line-art props. Stroke uses currentColor so the section
// drives hue (Royal Blue at rest, full Royal on hover). Square caps + miter
// joins read as instrument / blueprint draftsmanship rather than soft glyphs.
const svgProps = {
  viewBox: "0 0 32 32",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
};

/* Fast Lead Times — stopwatch with sweep tick + dial markings */
export function LeadTimeIcon() {
  return (
    <svg {...svgProps}>
      {/* Crown stem + top bar */}
      <line x1="13" y1="3.5" x2="19" y2="3.5" />
      <line x1="16" y1="3.5" x2="16" y2="6.5" />
      {/* Side start button */}
      <line x1="24" y1="8" x2="26" y2="6" />
      {/* Dial */}
      <circle cx="16" cy="18" r="9.5" />
      {/* Dial markings — N / E / S / W ticks */}
      <line x1="16" y1="9" x2="16" y2="11" />
      <line x1="25" y1="18" x2="23" y2="18" />
      <line x1="16" y1="27" x2="16" y2="25" />
      <line x1="7" y1="18" x2="9" y2="18" />
      {/* Sweep hand to ~1 o'clock + hub */}
      <line x1="16" y1="18" x2="21" y2="13" />
      <rect x="15.1" y="17.1" width="1.8" height="1.8" />
    </svg>
  );
}

/* Precision Machining — calipers measuring a small cube */
export function PrecisionIcon() {
  return (
    <svg {...svgProps}>
      {/* Caliper beam (graduated rule) */}
      <line x1="3.5" y1="9" x2="28.5" y2="9" />
      <line x1="3.5" y1="6.5" x2="3.5" y2="9" />
      <line x1="9" y1="7.2" x2="9" y2="9" />
      <line x1="14.5" y1="7.2" x2="14.5" y2="9" />
      <line x1="20" y1="7.2" x2="20" y2="9" />
      <line x1="25.5" y1="7.2" x2="25.5" y2="9" />
      {/* Fixed jaw (left) */}
      <line x1="3.5" y1="9" x2="3.5" y2="22" />
      {/* Sliding jaw (right) */}
      <line x1="14.5" y1="9" x2="14.5" y2="22" />
      {/* Measured cube held between the jaws */}
      <rect x="5" y="13.5" width="8" height="8" />
      <line x1="5" y1="13.5" x2="7.5" y2="11" />
      <line x1="13" y1="13.5" x2="15.5" y2="11" />
      <line x1="7.5" y1="11" x2="15.5" y2="11" />
      <line x1="15.5" y1="11" x2="15.5" y2="19" />
      <line x1="13" y1="21.5" x2="15.5" y2="19" />
    </svg>
  );
}

/* Multi-Axis Capability — CNC toolpath rosette (5-point spindle path) */
export function MultiAxisIcon() {
  // Five points evenly spaced on a circle (r=11, cx=cy=16), starting at top.
  // Connected star-skip (every 2nd point) to read as a swept 5-axis toolpath.
  const cx = 16;
  const cy = 16;
  const r = 11;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
  // Skip-2 ordering: 0 -> 2 -> 4 -> 1 -> 3 -> 0 (a {5/2} star)
  const order = [0, 2, 4, 1, 3, 0];
  const d =
    "M " +
    order
      .map((idx) => `${pts[idx][0].toFixed(2)} ${pts[idx][1].toFixed(2)}`)
      .join(" L ");
  return (
    <svg {...svgProps}>
      {/* Spindle hub */}
      <rect x="14.5" y="14.5" width="3" height="3" />
      {/* Toolpath star */}
      <path d={d} />
      {/* Node markers at each axis endpoint */}
      {pts.map(([x, y], i) => (
        <rect
          key={i}
          x={(x - 0.8).toFixed(2)}
          y={(y - 0.8).toFixed(2)}
          width="1.6"
          height="1.6"
        />
      ))}
    </svg>
  );
}

/* Tight Tolerances — micrometer thimble with engraved tolerance graduations */
export function ToleranceIcon() {
  return (
    <svg {...svgProps}>
      {/* Spindle entering from the left */}
      <line x1="3.5" y1="16" x2="11" y2="16" />
      {/* Barrel / sleeve */}
      <rect x="11" y="11.5" width="7" height="9" />
      {/* Barrel datum line */}
      <line x1="11" y1="16" x2="18" y2="16" />
      {/* Thimble (rotating cap) */}
      <rect x="18" y="9.5" width="8.5" height="13" />
      {/* Thimble graduations — fine engraved ticks */}
      <line x1="20.2" y1="9.5" x2="20.2" y2="13" />
      <line x1="22.25" y1="9.5" x2="22.25" y2="14" />
      <line x1="24.3" y1="9.5" x2="24.3" y2="13" />
      <line x1="20.2" y1="22.5" x2="20.2" y2="19" />
      <line x1="22.25" y1="22.5" x2="22.25" y2="18" />
      <line x1="24.3" y1="22.5" x2="24.3" y2="19" />
      {/* Ratchet stop knob */}
      <line x1="26.5" y1="16" x2="28.5" y2="16" />
    </svg>
  );
}

/* Responsive Communication — signal wave bursting from a hub (blueprint feel) */
export function CommunicationIcon() {
  return (
    <svg {...svgProps}>
      {/* Transmitter hub */}
      <rect x="6" y="14" width="4" height="4" />
      {/* Three expanding signal arcs to the right */}
      <path d="M12 11.5 A 6 6 0 0 1 12 20.5" />
      <path d="M15.5 8.5 A 10.5 10.5 0 0 1 15.5 23.5" />
      <path d="M19 5.5 A 15 15 0 0 1 19 26.5" />
      {/* Baseline axis through the hub (blueprint reference) */}
      <line x1="3.5" y1="16" x2="6" y2="16" />
    </svg>
  );
}

/* New Jersey Based — accurate NJ state outline */
export function LocationIcon() {
  return (
    <svg {...svgProps}>
      {/* Hand-authored NJ silhouette: narrow waist, NW panhandle, SE Cape May
          point. Scaled to sit within the 32x32 grid with breathing room. */}
      <path
        d="M14.5 3
           L18 4.5
           L17.4 7.2
           L19.2 8.8
           L18.2 11
           L20 13.2
           L19.4 16
           L21 18.8
           L19.6 22
           L17.4 25.6
           L15.2 28.8
           L13.6 26.4
           L13 23
           L11.4 20.2
           L12 17
           L11 14.6
           L11.8 11.2
           L10.8 8.6
           L12.4 5.2
           Z"
      />
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

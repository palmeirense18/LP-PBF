import type { CSSProperties } from "react";

const SILVER = "#C0C5CE";

const animBase: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
};

function animStyle(
  name: string,
  duration: string,
  timing: string,
  iteration: string = "infinite",
  direction: string = "normal",
  delay: string = "0s"
): CSSProperties {
  return {
    ...animBase,
    animationName: name,
    animationDuration: duration,
    animationTimingFunction: timing,
    animationIterationCount: iteration,
    animationDirection: direction,
    animationDelay: delay,
  };
}

const svgProps = {
  viewBox: "0 0 64 64",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/* CNC lathe — side view silhouette */
export function TurningIcon() {
  return (
    <svg {...svgProps}>
      {/* Floor line */}
      <line
        x1="2"
        y1="58"
        x2="62"
        y2="58"
        stroke={SILVER}
        strokeOpacity="0.4"
        strokeWidth={1}
      />

      {/* Bed */}
      <rect x="4" y="44" width="56" height="6" />

      {/* Headstock */}
      <rect x="6" y="22" width="14" height="22" />

      {/* Workpiece cylinder (between chuck and tailstock) */}
      <line x1="26" y1="30" x2="48" y2="30" />
      <line x1="26" y1="36" x2="48" y2="36" />

      {/* Tailstock */}
      <rect x="48" y="26" width="8" height="14" />

      {/* Chuck — rotates */}
      <g
        className="cap-anim cap-spin-chuck"
        style={{
          ...animStyle("cap-spin-chuck", "3.6s", "linear"),
          transformOrigin: "24px 33px",
          transformBox: "view-box",
        }}
      >
        <circle cx="24" cy="33" r="5" />
        {/* radial slots */}
        <line x1="24" y1="33" x2="29" y2="33" />
        <line x1="24" y1="33" x2="21.5" y2="37.33" />
        <line x1="24" y1="33" x2="21.5" y2="28.67" />
        {/* hub */}
        <circle cx="24" cy="33" r="1" fill="currentColor" stroke="none" />
      </g>

      {/* Tool turret on top — vertical bob */}
      <g
        className="cap-anim cap-tool-y"
        style={animStyle("cap-tool-y", "1.8s", "ease-in-out")}
      >
        {/* tool post */}
        <line x1="38" y1="18" x2="38" y2="26" />
        {/* turret triangle pointing down */}
        <path
          d="M33 10 L43 10 L38 18 Z"
          fill="currentColor"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
}

/* Vertical mill — side view silhouette */
export function MillingIcon() {
  return (
    <svg {...svgProps}>
      {/* Floor line */}
      <line
        x1="2"
        y1="58"
        x2="62"
        y2="58"
        stroke={SILVER}
        strokeOpacity="0.4"
        strokeWidth={1}
      />

      {/* Base */}
      <rect x="6" y="48" width="52" height="6" />

      {/* Table */}
      <rect x="12" y="42" width="40" height="6" />

      {/* Workpiece */}
      <rect x="22" y="36" width="20" height="6" />

      {/* Column (left) */}
      <rect x="6" y="6" width="12" height="42" />

      {/* Spindle head (overhang from column) */}
      <rect x="18" y="14" width="22" height="8" />

      {/* Spindle / cutter — plunges down on hover */}
      <g
        className="cap-anim cap-spindle-y"
        style={animStyle("cap-spindle-y", "1.8s", "ease-in-out")}
      >
        {/* spindle quill */}
        <line x1="29" y1="22" x2="29" y2="30" strokeWidth={2} />
        <line x1="33" y1="22" x2="33" y2="30" strokeWidth={2} />
        {/* cutter tip */}
        <line x1="29" y1="30" x2="33" y2="30" />
        <line x1="30" y1="30" x2="30" y2="34" />
        <line x1="32" y1="30" x2="32" y2="34" />
      </g>
    </svg>
  );
}

import type { CSSProperties } from "react";

const ROYAL = "#2B5BA6";
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
  stroke: ROYAL,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function TurningIcon() {
  return (
    <svg {...svgProps}>
      {/* Tailstock support (right side) */}
      <line x1="56" y1="22" x2="56" y2="42" />
      <line x1="54" y1="22" x2="58" y2="22" />
      <line x1="54" y1="42" x2="58" y2="42" />

      {/* Workpiece cylinder */}
      <line x1="24" y1="28" x2="54" y2="28" />
      <line x1="24" y1="36" x2="54" y2="36" />
      <line x1="54" y1="28" x2="54" y2="36" />

      {/* Centerline tick marks (silver, no animation) */}
      <line x1="30" y1="31" x2="30" y2="33" stroke={SILVER} strokeOpacity="0.3" />
      <line x1="38" y1="31" x2="38" y2="33" stroke={SILVER} strokeOpacity="0.3" />
      <line x1="46" y1="31" x2="46" y2="33" stroke={SILVER} strokeOpacity="0.3" />

      {/* Headstock chuck — rotates */}
      <g
        className="cap-anim cap-spin-chuck"
        style={animStyle("cap-spin-chuck", "3.6s", "linear")}
      >
        <circle cx="16" cy="32" r="8" />
        {/* radial slots at 0°, 120°, 240° */}
        <line x1="16" y1="32" x2="24" y2="32" />
        <line x1="16" y1="32" x2="12" y2="38.928" />
        <line x1="16" y1="32" x2="12" y2="25.072" />
        {/* Hub dot */}
        <circle cx="16" cy="32" r="1.2" fill={ROYAL} stroke="none" />
      </g>

      {/* Headstock body (static) */}
      <line x1="6" y1="22" x2="6" y2="42" />
      <line x1="6" y1="22" x2="10" y2="22" />
      <line x1="6" y1="42" x2="10" y2="42" />

      {/* Tool post (static vertical post) */}
      <line x1="42" y1="6" x2="42" y2="14" />

      {/* Tool tip — bobs vertically */}
      <g
        className="cap-anim cap-tool-y"
        style={animStyle("cap-tool-y", "1.8s", "ease-in-out")}
      >
        <path d="M38 14 L46 14 L42 22 Z" fill={ROYAL} stroke={ROYAL} />
      </g>
    </svg>
  );
}

export function MillingIcon() {
  return (
    <svg {...svgProps}>
      {/* Workpiece (static) */}
      <rect x="12" y="42" width="40" height="12" />

      {/* Spindle housing + end mill — rotates around (32,32) counter-clockwise */}
      <g
        className="cap-anim cap-spin-mill"
        style={{
          ...animStyle("cap-spin-mill", "2.4s", "linear"),
          transformOrigin: "32px 32px",
          transformBox: "view-box",
        }}
      >
        {/* Spindle housing — thicker stroke */}
        <rect x="28" y="6" width="8" height="16" strokeWidth={2} />
        {/* End mill body */}
        <line x1="30" y1="22" x2="30" y2="38" />
        <line x1="34" y1="22" x2="34" y2="38" />
        <line x1="30" y1="38" x2="34" y2="38" />
        {/* Flute mark */}
        <line x1="29" y1="36" x2="35" y2="36" />
      </g>

      {/* Traversing tick on top edge of workpiece */}
      <g
        className="cap-anim cap-traverse-x"
        style={animStyle(
          "cap-traverse-x",
          "2.6s",
          "ease-in-out",
          "infinite",
          "alternate"
        )}
      >
        <line x1="14" y1="40" x2="14" y2="44" strokeWidth={2} />
      </g>

      {/* X-axis indicator label (Orbitron, royal) */}
      <text
        x="32"
        y="62"
        textAnchor="middle"
        fontFamily="var(--font-orbitron), sans-serif"
        fontSize="6"
        fontWeight={400}
        fill={ROYAL}
        stroke="none"
      >
        X
      </text>
      {/* X-axis arrow */}
      <line x1="14" y1="58" x2="50" y2="58" />
      <polyline points="17,56 14,58 17,60" />
      <polyline points="47,56 50,58 47,60" />
    </svg>
  );
}

export function GrindingIcon() {
  const sparkDelays = ["0s", "0.12s", "0.24s", "0.36s", "0.48s"];
  const sparks: Array<{ x1: number; y1: number; x2: number; y2: number }> = [
    { x1: 28, y1: 40, x2: 26, y2: 44 },
    { x1: 30, y1: 41, x2: 29, y2: 46 },
    { x1: 32, y1: 41, x2: 32, y2: 46 },
    { x1: 34, y1: 41, x2: 35, y2: 46 },
    { x1: 36, y1: 40, x2: 38, y2: 44 },
  ];

  return (
    <svg {...svgProps}>
      {/* Workpiece */}
      <rect x="12" y="42" width="40" height="12" />

      {/* Contact line strokes */}
      <line x1="24" y1="42" x2="24" y2="44" stroke={SILVER} strokeOpacity="0.5" />
      <line x1="40" y1="42" x2="40" y2="44" stroke={SILVER} strokeOpacity="0.5" />

      {/* Grinding wheel — rotates around (32, 26) */}
      <g
        className="cap-anim cap-spin-wheel"
        style={{
          ...animStyle("cap-spin-wheel", "1.6s", "linear"),
          transformOrigin: "32px 26px",
          transformBox: "view-box",
        }}
      >
        {/* Outer rim */}
        <circle cx="32" cy="26" r="14" />
        {/* Hub */}
        <circle cx="32" cy="26" r="4" />
        {/* 8 abrasive marks between hub and rim */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          const rad = (angle * Math.PI) / 180;
          const x1 = 32 + Math.cos(rad) * 6;
          const y1 = 26 + Math.sin(rad) * 6;
          const x2 = 32 + Math.cos(rad) * 12;
          const y2 = 26 + Math.sin(rad) * 12;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Sparks */}
      {sparks.map((s, i) => (
        <g
          key={i}
          className="cap-anim cap-spark"
          style={animStyle(
            "cap-spark",
            "0.9s",
            "ease-in-out",
            "infinite",
            "normal",
            sparkDelays[i]
          )}
        >
          <line
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            strokeWidth={1}
            stroke={ROYAL}
          />
        </g>
      ))}
    </svg>
  );
}

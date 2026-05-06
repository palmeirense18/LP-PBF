const baseSvgProps = {
  viewBox: "0 0 40 40",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function AerospaceIcon() {
  return (
    <svg {...baseSvgProps}>
      {/* Swept delta wing — V shape from nose */}
      <path d="M20 6 L4 32" />
      <path d="M20 6 L36 32" />
      {/* Centerline */}
      <line x1="4" y1="32" x2="36" y2="32" />
      {/* Fuselage */}
      <rect x="18" y="6" width="4" height="26" />
      {/* Stabilizer */}
      <line x1="12" y1="30" x2="28" y2="30" />
    </svg>
  );
}

export function DefenseIcon() {
  // Regular hexagon, vertex at top, circumradius r, center (20,20)
  const hex = (r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      const x = 20 + Math.cos(angle) * r;
      const y = 20 + Math.sin(angle) * r;
      points.push(`${x.toFixed(3)},${y.toFixed(3)}`);
    }
    return points.join(" ");
  };
  return (
    <svg {...baseSvgProps}>
      <polygon points={hex(14)} />
      <polygon points={hex(8)} />
      {/* Crosshair — broken at center (4px gap) */}
      <line x1="4" y1="20" x2="18" y2="20" />
      <line x1="22" y1="20" x2="36" y2="20" />
      <line x1="20" y1="4" x2="20" y2="18" />
      <line x1="20" y1="22" x2="20" y2="36" />
      {/* Center dot */}
      <circle cx="20" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AutomotiveIcon() {
  // 8 radial teeth on a circle r=14, teeth protrude 3px outward (so to r=17)
  const teeth: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI * 2) / 8;
    teeth.push({
      x1: 20 + Math.cos(a) * 14,
      y1: 20 + Math.sin(a) * 14,
      x2: 20 + Math.cos(a) * 17,
      y2: 20 + Math.sin(a) * 17,
    });
  }
  return (
    <svg {...baseSvgProps}>
      {/* Axle */}
      <line x1="2" y1="20" x2="38" y2="20" />
      {/* Bearing markers */}
      <line x1="4" y1="18" x2="4" y2="22" />
      <line x1="36" y1="18" x2="36" y2="22" />
      {/* Outer gear circle */}
      <circle cx="20" cy="20" r="14" />
      {/* Teeth */}
      {teeth.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
      ))}
      {/* Hub */}
      <circle cx="20" cy="20" r="4" />
    </svg>
  );
}

export function MedicalIcon() {
  return (
    <svg {...baseSvgProps}>
      {/* Vertical rule */}
      <line x1="20" y1="6" x2="20" y2="34" />
      {/* Horizontal rule */}
      <line x1="6" y1="20" x2="34" y2="20" />
      {/* End caps — perpendicular dashes 6px wide */}
      <line x1="17" y1="6" x2="23" y2="6" />
      <line x1="17" y1="34" x2="23" y2="34" />
      <line x1="6" y1="17" x2="6" y2="23" />
      <line x1="34" y1="17" x2="34" y2="23" />
      {/* Center dot */}
      <circle cx="20" cy="20" r="2" />
    </svg>
  );
}

export function IndustrialIcon() {
  return (
    <svg {...baseSvgProps}>
      {/* Horizontal pipe (two parallel lines) */}
      <line x1="2" y1="14" x2="38" y2="14" />
      <line x1="2" y1="18" x2="38" y2="18" />
      {/* Vertical pipe */}
      <line x1="18" y1="2" x2="18" y2="38" />
      <line x1="22" y1="2" x2="22" y2="38" />
      {/* Flange — 12x12 centered at (20,16) where pipes cross */}
      <rect x="14" y="10" width="12" height="12" />
      {/* Bolt dots */}
      <circle cx="20" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="24.5" cy="16" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="20" cy="20.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EnergyIcon() {
  return (
    <svg {...baseSvgProps}>
      {/* Three blades with quadratic curves */}
      <path d="M20 20 Q30 12 32 8" />
      <path d="M20 20 Q24 28 20 36" />
      <path d="M20 20 Q10 14 8 8" />
      {/* Outer rotation arc — dashed 60° on right side, r=15 */}
      <path
        d="M 32.99 12.5 A 15 15 0 0 1 32.99 27.5"
        strokeDasharray="2 3"
      />
      {/* Hub */}
      <circle cx="20" cy="20" r="3" />
      <circle cx="20" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

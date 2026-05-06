// Stable, deterministic data generated at module scope so React renders are pure.

const VIEW_W = 1600;
const VIEW_H = 800;
const SAMPLE_END = 1800;
const SAMPLE_STEP = 16;
const LINE_COUNT = 14;

function buildLine(n: number): string {
  const amplitude = 24 + (n % 4) * 8;
  const yBase = 60 + n * 56;
  const period = 320 + (n % 3) * 80;

  const parts: string[] = [];
  for (let x = 0; x <= SAMPLE_END; x += SAMPLE_STEP) {
    const y = yBase + Math.sin((x / period) * Math.PI * 2 + n * 0.7) * amplitude;
    parts.push(`${x === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

const TOPO_PATHS: readonly string[] = Array.from(
  { length: LINE_COUNT },
  (_, n) => buildLine(n)
);

// Deterministic pseudo-random (Mulberry32)
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DOTS: ReadonlyArray<{ cx: number; cy: number }> = (() => {
  const rand = mulberry32(0x9e3779b1);
  return Array.from({ length: 30 }, () => ({
    cx: rand() * VIEW_W,
    cy: rand() * VIEW_H,
  }));
})();

interface TopoBackdropProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function TopoBackdrop({ className, style }: TopoBackdropProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={style}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g
          className="topo-drift"
          stroke="rgba(192,197,206,0.05)"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        >
          {TOPO_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g>
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={1}
              fill="rgba(43,91,166,0.18)"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

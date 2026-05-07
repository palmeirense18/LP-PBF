interface CertBadgeProps {
  label: string;
  detail: string;
  tone?: "royal" | "bone";
}

export default function CertBadge({ label, detail, tone = "royal" }: CertBadgeProps) {
  const isBone = tone === "bone";
  const containerClass = isBone
    ? "cert-badge inline-flex items-center gap-2 border border-bone/45 bg-transparent px-3 py-2 transition-[background-color,border-color] duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-bone hover:bg-bone/[0.08]"
    : "cert-badge inline-flex items-center gap-2 border border-royal/45 bg-transparent px-3 py-2 transition-[background-color,border-color] duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-royal hover:bg-royal/[0.08]";
  const dotClass = isBone ? "block h-1.5 w-1.5 bg-bone" : "block h-1.5 w-1.5 bg-royal";
  const sepClass = isBone ? "block h-3 w-px bg-bone/40" : "block h-3 w-px bg-royal/40";

  return (
    <span
      role="img"
      aria-label={`${label} — ${detail}`}
      data-cursor="hover"
      className={containerClass}
    >
      <span aria-hidden className={dotClass} />
      <span
        aria-hidden
        className="font-display font-bold uppercase text-bone"
        style={{
          fontSize: "12px",
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </span>
      <span aria-hidden className={sepClass} />
      <span
        aria-hidden
        className="font-display uppercase"
        style={{
          fontSize: "10px",
          fontWeight: 400,
          letterSpacing: "0.32em",
          color: "rgba(192,197,206,0.7)",
        }}
      >
        {detail}
      </span>
    </span>
  );
}

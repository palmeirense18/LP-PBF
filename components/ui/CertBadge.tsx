interface CertBadgeProps {
  label: string;
  detail: string;
}

export default function CertBadge({ label, detail }: CertBadgeProps) {
  return (
    <span
      role="img"
      aria-label={`${label} — ${detail}`}
      data-cursor="hover"
      className="cert-badge inline-flex items-center gap-2 border border-royal/45 bg-transparent px-3 py-2 transition-[background-color,border-color] duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-royal hover:bg-royal/[0.08]"
    >
      <span aria-hidden className="block h-1.5 w-1.5 bg-royal" />
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
      <span
        aria-hidden
        className="block h-3 w-px bg-royal/40"
      />
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

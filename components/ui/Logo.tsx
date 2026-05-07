"use client";

import LogoMark from "@/components/ui/LogoMark";

export default function Logo({
  href = "/",
  onAnchorClick,
}: {
  href?: string;
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      data-cursor="hover"
      onClick={onAnchorClick}
      className="group/logo inline-flex items-center gap-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
    >
      <LogoMark size={36} />

      <span className="flex flex-col leading-none">
        <span
          className="font-display font-bold uppercase tracking-[0.18em] text-bone"
          style={{ fontSize: 17 }}
        >
          PBFMACHINE
        </span>
        <span
          className="hidden font-display uppercase tracking-[0.4em] text-silver md:mt-1 md:inline"
          style={{ fontSize: 8, fontWeight: 400 }}
        >
          Precision Machining
        </span>
      </span>
    </a>
  );
}

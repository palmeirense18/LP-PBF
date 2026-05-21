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
      className="group/logo inline-flex items-center gap-3.5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal md:gap-5"
    >
      <span className="block md:hidden">
        <LogoMark size={56} withTile />
      </span>
      <span className="hidden md:block">
        <LogoMark size={72} withTile />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className="font-display font-bold uppercase tracking-[0.18em] text-bone md:text-[26px]"
          style={{ fontSize: 22 }}
        >
          PBFMACHINE
        </span>
        <span
          className="hidden font-display uppercase tracking-[0.4em] text-silver md:mt-1.5 lg:inline"
          style={{ fontSize: 9, fontWeight: 400 }}
        >
          PRECISION
          <span className="mx-1.5 text-royal">·</span>
          QUALITY
          <span className="mx-1.5 text-royal">·</span>
          PERFORMANCE
        </span>
      </span>
    </a>
  );
}

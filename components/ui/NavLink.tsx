"use client";

import { cn } from "@/lib/cn";

export default function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      data-cursor="hover"
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/nav relative inline-flex flex-col items-center font-display uppercase outline-none transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal",
        active ? "text-bone" : "text-silver hover:text-bone"
      )}
      style={{
        fontSize: 11,
        letterSpacing: "0.22em",
        fontWeight: 400,
        textShadow: active ? "0 0 12px rgba(43,91,166,0.4)" : undefined,
      }}
    >
      <span className="relative inline-block whitespace-nowrap py-1.5">{label}</span>
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 h-px w-full origin-left bg-royal transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
        )}
      />
    </a>
  );
}

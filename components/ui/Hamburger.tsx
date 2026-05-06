"use client";

import { forwardRef } from "react";

const Hamburger = forwardRef<
  HTMLButtonElement,
  {
    open: boolean;
    onClick: () => void;
    controls?: string;
    className?: string;
  }
>(function Hamburger({ open, onClick, controls = "mobile-menu", className }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      data-cursor="hover"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className={`group/ham relative inline-flex h-10 w-10 items-center justify-center bg-transparent outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${className ?? ""}`}
    >
      <span className="relative block h-[12.5px] w-[18px]">
        <span
          aria-hidden
          className="absolute left-0 top-0 block h-[1.5px] w-[18px] origin-center bg-silver transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: open
              ? "translateY(5.5px) rotate(45deg)"
              : "translateY(0) rotate(0)",
          }}
        />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 block h-[1.5px] w-[18px] origin-center bg-silver transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: open
              ? "translateY(-5.5px) rotate(-45deg)"
              : "translateY(0) rotate(0)",
          }}
        />
      </span>
    </button>
  );
});

export default Hamburger;

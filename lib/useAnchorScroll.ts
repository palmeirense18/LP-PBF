"use client";

import { useCallback } from "react";

type ScrollOptions = {
  onComplete?: () => void;
};

export function useAnchorScroll() {
  return useCallback(
    (href: string, opts?: ScrollOptions) =>
      (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (!href.startsWith("#")) return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        event.preventDefault();

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const lenis = window.__lenis;
        const offset = -96;

        if (lenis) {
          lenis.scrollTo(target, {
            duration: reduced ? 0 : 1.4,
            offset,
            immediate: reduced,
            easing: (t: number) => 1 - Math.pow(1 - t, 4),
            onComplete: opts?.onComplete,
          });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({
            top,
            behavior: reduced ? "auto" : "smooth",
          });
          if (opts?.onComplete) {
            window.setTimeout(opts.onComplete, reduced ? 0 : 800);
          }
        }

        if (typeof history !== "undefined" && history.replaceState) {
          history.replaceState(null, "", href);
        }
      },
    []
  );
}

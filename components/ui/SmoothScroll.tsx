"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { setupGsap, syncLenisWithScrollTrigger } from "@/components/animations/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // Skip Lenis on touch devices — native momentum scrolling is already smooth
    // and Lenis's wheel smoothing only applies to mouse input. Saves load on mobile.
    if (prefersReducedMotion || isTouch) {
      setupGsap();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
    });

    window.__lenis = lenis;

    setupGsap();
    const cleanupSync = syncLenisWithScrollTrigger(lenis);

    return () => {
      cleanupSync?.();
      lenis.destroy();
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, []);

  return <>{children}</>;
}

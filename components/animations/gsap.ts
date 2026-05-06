"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "@studio-freight/lenis";

let initialized = false;

export function setupGsap() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  gsap.registerPlugin(ScrollTrigger);
  initialized = true;
}

export function syncLenisWithScrollTrigger(lenis: Lenis) {
  if (typeof window === "undefined") return;

  const update = () => ScrollTrigger.update();
  lenis.on("scroll", update);

  const tickerCb = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerCb);
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off("scroll", update);
    gsap.ticker.remove(tickerCb);
  };
}

export { gsap, ScrollTrigger };

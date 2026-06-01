"use client";

import { useEffect, useState } from "react";

// Reveal the button once the user has scrolled past roughly one viewport / 600px.
const SCROLL_THRESHOLD = 600;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    // Lenis drives the real scroll position, so native scroll events still fire.
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClick = () => {
    const lenis = window.__lenis;
    if (lenis) {
      // Route through Lenis so the motion matches the site's weighted scroll feel.
      lenis.scrollTo(0, reducedMotion ? { immediate: true } : undefined);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[90] md:bottom-10 md:right-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
        transition: reducedMotion
          ? "none"
          : `opacity 400ms ${EASE}, transform 400ms ${EASE}`,
      }}
    >
      <button
        type="button"
        aria-label="Back to top"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onClick={handleClick}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-silver/40 bg-royal text-bone shadow-[0_8px_24px_rgba(0,0,0,0.35)] outline-none ring-1 ring-silver/20 transition-[transform,background-color,border-color] duration-300 ease-out hover:scale-110 hover:border-silver/70 hover:bg-navy focus-visible:ring-2 focus-visible:ring-bone md:h-14 md:w-14"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5 md:h-6 md:w-6"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

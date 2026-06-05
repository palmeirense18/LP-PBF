"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import { gsap, ScrollTrigger, setupGsap } from "@/components/animations/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PROCESS } from "@/lib/process-data";
import ProcessStep from "@/components/ui/ProcessStep";
import ProcessProgress from "@/components/ui/ProcessProgress";

// Slide width as a fraction of the carousel viewport — full width, so exactly
// one step card is visible (and centered) at a time on every breakpoint.
const DESKTOP_SLIDE_FRACTION = 1;

export default function Process() {
  // Header entrance timeline
  const { ref: revealRef, inView } = useInViewOnce<HTMLDivElement>(
    0.2,
    "0px 0px -10% 0px"
  );
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupGsap();
    const headerEl = headerRef.current;
    if (!headerEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const heads = headerEl.querySelectorAll<HTMLElement>("[data-proc-head]");
      if (reduced) {
        gsap.set(heads, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(heads, { opacity: 0, y: 24, filter: "blur(6px)" });
      if (inView) {
        gsap.to(heads, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        });
      }
    });

    return () => ctx.revert();
  }, [inView]);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full bg-ink [overflow:clip]"
    >
      {/* Heading block */}
      <div
        ref={revealRef}
        className="mx-auto max-w-[1440px] px-6 pb-12 pt-28 md:px-10 md:pt-36"
      >
        <div ref={headerRef} className="flex flex-col">
          <span
            data-proc-head
            aria-hidden
            className="font-display uppercase text-royalLight"
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.42em",
            }}
          >
            FROM PRINT TO PART
          </span>
          <h2
            id="process-heading"
            data-proc-head
            className="mt-4 font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            OUR PROCESS<span className="text-royal">.</span>
          </h2>
          <span
            data-proc-head
            aria-hidden
            className="mt-6 block h-[3px] w-20 bg-royal"
          />
          <p
            data-proc-head
            className="mt-6 max-w-md font-body text-[18px] text-mediumGray"
          >
            Five disciplined stages between every quote and shipment.
          </p>
        </div>
      </div>

      {/* SR-only ordered list — the accessible baseline for the full content */}
      <ol className="sr-only">
        {PROCESS.map((step) => (
          <li key={step.id}>
            Step {step.index} of {String(PROCESS.length).padStart(2, "0")} —{" "}
            {step.phase}: {step.title}. {step.body}
          </li>
        ))}
      </ol>

      <ProcessCarousel />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Carousel — self-contained, normal document flow, no scroll hijacking
// ---------------------------------------------------------------------------

function ProcessCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Measure the carousel viewport so slide offsets are exact pixels.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // This section no longer pins, so the document height changed relative to
  // the old layout — recompute every other ScrollTrigger's start/end after we
  // settle, and again when this section unmounts.
  useEffect(() => {
    setupGsap();
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, []);

  const slideW = isDesktop ? viewportW * DESKTOP_SLIDE_FRACTION : viewportW;
  const x = useMotionValue(0);

  const slideTransition = reduced
    ? ({ duration: 0 } as const)
    : ({ duration: 0.5, ease: "easeInOut" } as const);

  // Keep the track in sync with the active index (and re-sync on resize).
  useEffect(() => {
    const controls = animate(x, -activeIndex * slideW, slideTransition);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slideW, reduced]);

  const goTo = useCallback((i: number) => {
    setActiveIndex(Math.min(PROCESS.length - 1, Math.max(0, i)));
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = Math.max(48, slideW * 0.18);
      let next = activeIndex;
      if (info.offset.x < -threshold || info.velocity.x < -500) {
        next = Math.min(PROCESS.length - 1, activeIndex + 1);
      } else if (info.offset.x > threshold || info.velocity.x > 500) {
        next = Math.max(0, activeIndex - 1);
      }
      if (next === activeIndex) {
        // Index unchanged — settle the track back onto the current slide.
        animate(x, -activeIndex * slideW, slideTransition);
      } else {
        setActiveIndex(next);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, slideW, reduced]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(PROCESS.length - 1);
      }
    },
    [activeIndex, goTo]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Manufacturing process steps"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="pb-24 outline-none focus-visible:ring-1 focus-visible:ring-royal/60 md:pb-28"
    >
      {/* Live region for active step */}
      <span aria-live="polite" className="sr-only">
        Step {activeIndex + 1} of {PROCESS.length}:{" "}
        {PROCESS[activeIndex].title}.
      </span>

      {/* Track viewport */}
      <div ref={viewportRef} className="relative w-full overflow-hidden">
        <motion.div
          aria-hidden
          className="flex w-full cursor-grab touch-pan-y select-none flex-nowrap items-stretch active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -(PROCESS.length - 1) * slideW,
            right: 0,
          }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.id}
              className="w-full flex-none"
              animate={{ opacity: 1 }}
              transition={slideTransition}
            >
              <ProcessStep step={step} isActive={i === activeIndex} />
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative rail line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-silver/[0.08]"
        />
      </div>

      {/* Controls: prev / progress / next */}
      <div className="mx-auto mt-8 flex w-full max-w-[1440px] items-center gap-5 px-6 md:gap-8 md:px-10">
        <ArrowButton
          dir="prev"
          disabled={activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
        />
        <div className="min-w-0 flex-1">
          <ProcessProgress
            activeIndex={activeIndex}
            reduced={reduced}
            onStepClick={goTo}
          />
        </div>
        <ArrowButton
          dir="next"
          disabled={activeIndex === PROCESS.length - 1}
          onClick={() => goTo(activeIndex + 1)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Arrow button
// ---------------------------------------------------------------------------

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous step" : "Next step"}
      className="flex h-11 w-11 flex-none items-center justify-center border border-royal/50 text-royalLight transition-colors duration-200 hover:border-royal hover:bg-royal hover:text-bone focus-visible:border-royal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-royal disabled:cursor-default disabled:opacity-30 disabled:hover:border-royal/50 disabled:hover:bg-transparent disabled:hover:text-royalLight"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        {dir === "prev" ? (
          <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.5" />
        ) : (
          <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
    </button>
  );
}

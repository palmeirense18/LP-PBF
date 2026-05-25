"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, setupGsap } from "@/components/animations/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { PROCESS } from "@/lib/process-data";
import ProcessStep from "@/components/ui/ProcessStep";
import ProcessProgress from "@/components/ui/ProcessProgress";

const STEP_VH = 200;

export default function Process() {
  const [mountMode, setMountMode] = useState<"pinned" | "stacked" | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Decide variant after first paint
  useEffect(() => {
    const decide = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMountMode(desktop && !reduced ? "pinned" : "stacked");
    };
    decide();
    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqDesktop.addEventListener("change", decide);
    mqReduced.addEventListener("change", decide);
    return () => {
      mqDesktop.removeEventListener("change", decide);
      mqReduced.removeEventListener("change", decide);
    };
  }, []);

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

      {/* SR-only ordered list (always present, gives non-pinned content baseline) */}
      <ol className="sr-only">
        {PROCESS.map((step) => (
          <li key={step.id}>
            Step {step.index} of {String(PROCESS.length).padStart(2, "0")} —{" "}
            {step.phase}: {step.title}. {step.body}
          </li>
        ))}
      </ol>

      {/* Live region for active step */}
      {mountMode === "pinned" && (
        <span aria-live="polite" className="sr-only">
          Step {activeIndex + 1} of {PROCESS.length}:{" "}
          {PROCESS[activeIndex].title}.
        </span>
      )}

      {mountMode === "pinned" && (
        <DesktopPinned
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}

      {mountMode === "stacked" && <MobileStacked />}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Desktop pinned variant
// ---------------------------------------------------------------------------

interface DesktopPinnedProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

function DesktopPinned({ activeIndex, setActiveIndex }: DesktopPinnedProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  // Live start/end (px) of the pinned ScrollTrigger range. Read on click to
  // map a step index to its scroll position; updated automatically by GSAP on
  // refresh/resize since we hold the same instance.
  const triggerRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    setupGsap();
    const wrapper = wrapperRef.current;
    const rail = railRef.current;
    if (!wrapper || !rail) return;

    const ctx = gsap.context(() => {
      const totalScroll = PROCESS.length * STEP_VH;

      const tween = gsap.to(rail, {
        x: () => -window.innerWidth * (PROCESS.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${totalScroll}vh`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) =>
              Math.round(value * PROCESS.length) / PROCESS.length,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const p = self.progress;
            const i = Math.min(
              PROCESS.length - 1,
              Math.floor(p * PROCESS.length * 0.9999)
            );

            // setState only on boundary change
            if (i !== lastActiveIndexRef.current) {
              lastActiveIndexRef.current = i;
              setActiveIndex(i);

              // Imperative dot + label state — no React reconciliation
              dotRefs.current.forEach((el, idx) => {
                if (!el) return;
                el.dataset.active = idx <= i ? "true" : "false";
              });
              labelRefs.current.forEach((el, idx) => {
                if (!el) return;
                el.dataset.active = idx <= i ? "true" : "false";
              });
            }

            // Imperative width update
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${p * 100}%`;
            }
          },
        },
      });

      // Hold the live ScrollTrigger so clicks can read its current start/end.
      triggerRef.current = tween.scrollTrigger ?? null;

      // Initialize step 0 as active
      requestAnimationFrame(() => {
        dotRefs.current.forEach((el, idx) => {
          if (!el) return;
          el.dataset.active = idx === 0 ? "true" : "false";
        });
        labelRefs.current.forEach((el, idx) => {
          if (!el) return;
          el.dataset.active = idx === 0 ? "true" : "false";
        });
      });

      return () => {
        triggerRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, wrapper);

    return () => ctx.revert();
  }, [setActiveIndex]);

  // Jump to a step by scrolling to the scrollY that corresponds to that step's
  // progress point inside the pinned range. The scroll-scrub then drives the
  // slide naturally — the pin/scrub/snap logic is untouched.
  const handleStepClick = useCallback((i: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const { start, end } = trigger;
    const denom = Math.max(1, PROCESS.length - 1);
    // Nudge fractions a hair inside the range so the first/last steps land just
    // past the pin enter / before the pin exit rather than on the boundary.
    const eps = 0.002;
    const frac = Math.min(1 - eps, Math.max(eps, i / denom));
    const targetY = start + (end - start) * frac;

    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.0, lock: false });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Top breathing room */}
      <div className="h-14" />

      {/* Rail */}
      <div className="relative h-[calc(100vh-3.5rem-3rem)] w-full overflow-hidden">
        <div
          ref={railRef}
          className="flex h-full flex-nowrap will-change-transform"
          style={{ width: `${PROCESS.length * 100}vw` }}
        >
          {PROCESS.map((step, i) => (
            <ProcessStep
              key={step.id}
              step={step}
              isActive={i === activeIndex}
              layout="pinned"
            />
          ))}
        </div>

        {/* Decorative rail line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-silver/[0.08]"
        />
      </div>

      {/* Bottom progress */}
      <div className="flex h-12 items-center">
        <ProcessProgress
          activeIndex={activeIndex}
          fillRef={progressFillRef}
          dotRefs={dotRefs}
          labelRefs={labelRefs}
          onStepClick={handleStepClick}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile stacked variant
// ---------------------------------------------------------------------------

function MobileStacked() {
  const listRef = useRef<HTMLOListElement>(null);
  const [filledHeight, setFilledHeight] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = listRef.current;
    if (!list) return;

    const compute = () => {
      const items = Array.from(
        list.querySelectorAll<HTMLLIElement>("[data-process-step]")
      );
      const activeItems = items.filter(
        (el) => el.getAttribute("data-process-active") === "true"
      );
      if (activeItems.length === 0) {
        setFilledHeight(0);
        return;
      }
      if (reduced.current) {
        const last = items[items.length - 1];
        const top = list.getBoundingClientRect().top;
        const lastBottom = last.getBoundingClientRect().bottom;
        setFilledHeight(lastBottom - top);
        return;
      }
      const last = activeItems[activeItems.length - 1];
      const top = list.getBoundingClientRect().top;
      const marker = last.querySelector("[aria-hidden]");
      const refRect = (marker ?? last).getBoundingClientRect();
      const targetY = (refRect.top + refRect.bottom) / 2 - top;
      setFilledHeight(Math.max(0, targetY));
    };

    compute();
    const mo = new MutationObserver(compute);
    mo.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-process-active"],
    });
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    const t = window.setInterval(compute, 250);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
      window.clearInterval(t);
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-[1440px] px-6 pb-28 md:px-10">
      <ol ref={listRef} className="relative">
        {/* Vertical track */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-mediumGray/15"
          style={{ left: "1.5rem" }}
        />
        {/* Fill */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 w-px bg-royal"
          style={{
            left: "1.5rem",
            height: `${filledHeight}px`,
            boxShadow: "0 0 12px rgba(43,91,166,0.4)",
            transition: "height 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {PROCESS.map((step) => (
          <ProcessStep
            key={step.id}
            step={step}
            isActive
            layout="stacked"
            total={PROCESS.length}
          />
        ))}
      </ol>
    </div>
  );
}

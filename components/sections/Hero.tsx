"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { gsap, setupGsap } from "@/components/animations/gsap";

const FRAME_COUNT = 240;
const FRAME_PATH = (i: number) => `/hero/frames/frame-${String(i).padStart(3, "0")}.jpg`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [, setFramesReady] = useState(false);

  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const cAR = cw / ch;
    const iAR = iw / ih;

    let sx = 0,
      sy = 0,
      sw = iw,
      sh = ih;
    if (iAR > cAR) {
      sw = ih * cAR;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / cAR;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    currentFrameRef.current = index;
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    let cancelled = false;
    const images: HTMLImageElement[] = [];

    if (!desktop || reduced) {
      // Mobile / reduced-motion: only load the middle frame
      const midIndex = Math.floor(FRAME_COUNT / 2);
      const img = new Image();
      images[midIndex] = img;
      img.src = FRAME_PATH(midIndex);
      img.onload = () => {
        if (cancelled) return;
        framesRef.current = images;
        drawFrame(midIndex);
        setFramesReady(true);
      };
      framesRef.current = images;
      return () => {
        cancelled = true;
      };
    }

    let loaded = 0;
    let readyFlagged = false;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (cancelled) return;
        loaded++;
        if (i === 0) drawFrame(0);
        if (!readyFlagged && loaded >= Math.floor(FRAME_COUNT * 0.8)) {
          readyFlagged = true;
          setFramesReady(true);
        }
      };
      images.push(img);
    }
    framesRef.current = images;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    if (!desktop || reduced) {
      const midIndex = Math.floor(FRAME_COUNT / 2);
      const tryDraw = () => drawFrame(midIndex);
      const img = framesRef.current[midIndex];
      if (img?.complete) tryDraw();
      else img?.addEventListener("load", tryDraw, { once: true });
      return;
    }

    let rafId = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewport = window.innerHeight;
      const scrolled = -rect.top;
      const total = Math.max(1, sectionHeight - viewport);
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const targetIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      if (targetIndex !== currentFrameRef.current) {
        drawFrame(targetIndex);
      }
      rafId = 0;
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    setupGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eyebrow = eyebrowRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const subhead = subheadRef.current;
    const ctas = ctasRef.current;
    const indicator = indicatorRef.current;

    if (reduced) {
      [eyebrow, subhead, ctas, indicator].forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
      });
      [line1, line2].forEach((el) => {
        if (el) gsap.set(el, { yPercent: 0, opacity: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(eyebrow, { opacity: 0, y: 12, filter: "blur(4px)" });
      gsap.set(subhead, { opacity: 0, y: 8, filter: "blur(4px)" });
      gsap.set(ctas, { opacity: 0, y: 12 });
      gsap.set(indicator, { opacity: 0 });
      gsap.set([line1, line2].filter(Boolean), { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(eyebrow, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 })
        .to(line1, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out" }, "-=0.2")
        .to(line2, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out" }, "-=0.45")
        .to(subhead, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, "-=0.4")
        .to(ctas, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(indicator, { opacity: 1, duration: 0.5 }, "+=0.2");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen md:h-[200vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 block h-full w-full"
          style={{ background: "#0A0A0A" }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, transparent 32%, rgba(10,10,10,0.55) 58%, rgba(10,10,10,0.92) 100%)",
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] md:hidden"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 40%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.92) 100%)",
          }}
        />

        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center md:left-auto md:right-0 md:w-[52%] md:justify-start">
          <div className="w-full max-w-xl px-6 text-center md:pl-12 md:pr-8 md:text-left lg:pr-12">
            <span
              ref={eyebrowRef}
              aria-hidden
              className="mb-6 block font-display text-[12px] uppercase tracking-[0.32em] text-silver"
              style={{
                fontWeight: 400,
                textShadow: "0 1px 12px rgba(0,0,0,0.7)",
              }}
            >
              Est. New Jersey · USA
            </span>

            <h1
              className="font-display font-bold uppercase text-bone"
              style={{
                fontSize: "clamp(40px, 5.2vw, 80px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow:
                  "0 2px 24px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.7), 0 1px 0 rgba(0,0,0,0.4)",
              }}
            >
              <span className="block overflow-hidden whitespace-nowrap">
                <span ref={line1Ref} className="inline-block [will-change:transform,opacity]">
                  PBF
                </span>
              </span>
              <span className="block overflow-hidden whitespace-nowrap">
                <span ref={line2Ref} className="inline-block [will-change:transform,opacity]">
                  MACHINE<span className="text-royal">.</span>
                </span>
              </span>
            </h1>

            <p
              ref={subheadRef}
              className="mx-auto mt-6 max-w-md font-body text-[16px] leading-relaxed text-mediumGray md:mx-0 md:text-[18px]"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              High-tolerance CNC machining for the industries that build the modern world.
              Aerospace. Defense. Automotive. Medical. Industrial.
            </p>

            <div
              ref={ctasRef}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start lg:flex-row lg:gap-4"
            >
              <Button variant="primary" href="#contact">
                Request a Quote
              </Button>
              <Button variant="ghost" href="#capabilities" withArrow={false}>
                View Capabilities
              </Button>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 z-[1] hidden md:right-6 md:block"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center",
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.6em",
              color: "rgba(192,197,206,0.15)",
            }}
          >
            PRECISION · QUALITY · PERFORMANCE
          </span>
        </div>

        <div ref={indicatorRef}>
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}

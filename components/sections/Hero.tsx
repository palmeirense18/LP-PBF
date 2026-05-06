"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { gsap, setupGsap } from "@/components/animations/gsap";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(true);
  const [renderCanvas, setRenderCanvas] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.intersectionRatio > 0);
        }
      },
      { threshold: [0, 0.01, 0.5, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Only mount the heavy Three.js Canvas on pointer:fine devices (desktop / mouse).
  // Touch / coarse-pointer devices get a pure CSS gradient — saves ~3 s of mobile
  // script evaluation and makes the Hero fast on phones.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && wide && !reduced) {
      setRenderCanvas(true);
    }
  }, []);

  useEffect(() => {
    setupGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector<HTMLElement>("[data-hero='eyebrow']");
      const subhead = root.querySelector<HTMLElement>("[data-hero='subhead']");
      const ctas = root.querySelectorAll<HTMLElement>("[data-hero='cta']");
      const indicator = root.querySelector<HTMLElement>("[data-hero='indicator']");
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;

      if (reduced) {
        gsap.set([eyebrow, subhead, ...Array.from(ctas), indicator], {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        gsap.set([line1, line2].filter(Boolean), {
          yPercent: 0,
          opacity: 1,
        });
        return;
      }

      gsap.set(eyebrow, { opacity: 0, y: 12, filter: "blur(4px)" });
      gsap.set(subhead, { opacity: 0, y: 8, filter: "blur(4px)" });
      gsap.set(ctas, { opacity: 0, scale: 0.95 });
      gsap.set(indicator, { opacity: 0 });
      gsap.set([line1, line2].filter(Boolean), {
        yPercent: 100,
        opacity: 0,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
      })
        .to(
          line1,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power4.out",
          },
          "-=0.2"
        )
        .to(
          line2,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power4.out",
          },
          "-=0.45"
        )
        .to(
          subhead,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 },
          "-=0.4"
        )
        .to(
          ctas,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(indicator, { opacity: 1, duration: 0.5 }, "+=0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      {/* Full-bleed atmospheric backdrop: 3D Canvas on desktop / pointer:fine,
          radial gradient fallback on touch + reduced-motion (saves heavy JS). */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        {renderCanvas ? (
          <HeroScene inView={inView} />
        ) : (
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(43,91,166,0.18) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(30,58,95,0.35) 0%, transparent 60%), #0A0A0A",
            }}
          />
        )}
      </div>

      {/* Right-side darkening gradient — desktop ensures text legibility over the part */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 32%, rgba(10,10,10,0.55) 58%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Mobile bottom-up gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] md:hidden"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 40%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Foreground content — right column on md+, full width centered on mobile */}
      <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center md:left-auto md:right-0 md:w-[52%] md:justify-start">
        <div className="w-full max-w-xl px-6 text-center md:pl-12 md:pr-8 md:text-left lg:pr-12">
          <span
            data-hero="eyebrow"
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
              <span
                ref={line1Ref}
                className="inline-block [will-change:transform,opacity]"
              >
                PRECISION
              </span>
            </span>
            <span className="block overflow-hidden whitespace-nowrap">
              <span
                ref={line2Ref}
                className="inline-block [will-change:transform,opacity]"
              >
                MACHINED<span className="text-royal">.</span>
              </span>
            </span>
          </h1>

          <p
            data-hero="subhead"
            className="mx-auto mt-6 max-w-md font-body text-[16px] leading-relaxed text-mediumGray md:mx-0 md:text-[18px]"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
          >
            High-tolerance CNC machining for the industries that build the modern world.
            Aerospace. Defense. Automotive. Medical. Industrial.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start lg:flex-row lg:gap-4">
            <span data-hero="cta" className="inline-block">
              <Button variant="primary" href="#contact">
                Request a Quote
              </Button>
            </span>
            <span data-hero="cta" className="inline-block">
              <Button variant="ghost" href="#capabilities" withArrow={false}>
                View Capabilities
              </Button>
            </span>
          </div>
        </div>
      </div>

      {/* Vertical decorative text — right edge, md+ only */}
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

      <div data-hero="indicator">
        <ScrollIndicator />
      </div>
    </section>
  );
}

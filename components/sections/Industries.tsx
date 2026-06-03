"use client";

import { useEffect, useRef, useState } from "react";
import {
  AerospaceIcon,
  DefenseIcon,
  AutomotiveIcon,
  MedicalIcon,
  IndustrialIcon,
  EnergyIcon,
} from "@/components/ui/icons/IndustryIcons";
import IndustryListItem from "@/components/ui/IndustryListItem";
import IndustryPreview from "@/components/ui/IndustryPreview";
import TopoBackdrop from "@/components/ui/TopoBackdrop";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { gsap, setupGsap } from "@/components/animations/gsap";
import {
  INDUSTRIES,
  type Industry,
  type IndustryIconKey,
} from "@/lib/industries-data";

const ICONS: Record<IndustryIconKey, () => JSX.Element> = {
  aerospace: AerospaceIcon,
  defense: DefenseIcon,
  automotive: AutomotiveIcon,
  medical: MedicalIcon,
  industrial: IndustrialIcon,
  energy: EnergyIcon,
};

export default function Industries() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(
    0.2,
    "0px 0px -10% 0px"
  );
  const headerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(INDUSTRIES[0].id);
  const [mountMode, setMountMode] = useState<"desktop" | "mobile" | null>(null);

  // Decide variant after first paint
  useEffect(() => {
    const decide = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      setMountMode(desktop ? "desktop" : "mobile");
    };
    decide();
    const mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  // Header + backdrop entrance
  useEffect(() => {
    setupGsap();
    const headerEl = headerRef.current;
    const backdropEl = backdropRef.current;
    if (!headerEl || !backdropEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const heads = headerEl.querySelectorAll<HTMLElement>("[data-ind-head]");
      if (reduced) {
        gsap.set(heads, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(backdropEl, { opacity: 1 });
        return;
      }
      gsap.set(heads, { opacity: 0, y: 24, filter: "blur(6px)" });
      gsap.set(backdropEl, { opacity: 0 });
      if (inView) {
        gsap.to(backdropEl, {
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        });
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

  const activeIndustry =
    INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];

  return (
    <section
      id="industries"
      aria-labelledby="industries-heading"
      className="relative w-full overflow-hidden bg-navy py-28 md:py-36"
    >
      {/* Topographic backdrop */}
      <div ref={backdropRef} className="absolute inset-0 z-0">
        <TopoBackdrop />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col">
          <span
            data-ind-head
            aria-hidden
            className="font-display text-[11px] uppercase text-bone"
            style={{ fontWeight: 400, letterSpacing: "0.42em" }}
          >
            WHERE OUR PARTS LIVE
          </span>
          <h2
            id="industries-heading"
            data-ind-head
            className="mt-4 font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            INDUSTRIES<span className="text-bone">.</span>
          </h2>
          <p
            data-ind-head
            className="mt-4 max-w-md font-body text-[18px] text-mediumGray"
          >
            Six sectors. One standard.
          </p>
        </div>

        {/* SR-only canonical list */}
        <ul className="sr-only">
          {INDUSTRIES.map((ind) => (
            <li key={ind.id}>
              <h3>
                {ind.name} ({ind.sectorCode})
              </h3>
              <p>{ind.body}</p>
            </li>
          ))}
        </ul>

        {mountMode === "desktop" && (
          <div className="mt-16 grid grid-cols-12 gap-10 md:mt-24">
            {/* Left: directory list */}
            <div
              className="col-span-12 md:col-span-5"
              onPointerLeave={() => {
                /* keep last activeId — don't reset */
              }}
            >
              <ul role="list" className="flex flex-col">
                {INDUSTRIES.map((ind) => (
                  <IndustryListItem
                    key={ind.id}
                    industry={ind}
                    isActive={ind.id === activeId}
                    onActivate={() => setActiveId(ind.id)}
                  />
                ))}
              </ul>
              {/* Closing hairline below the last item */}
              <span
                aria-hidden
                className="block h-px w-full"
                style={{ backgroundColor: "rgba(192,197,206,0.12)" }}
              />
            </div>

            {/* Right: sticky preview */}
            <div
              className="col-span-12 md:col-span-7 md:pl-6"
              aria-live="polite"
            >
              <IndustryPreview industry={activeIndustry} />
            </div>
          </div>
        )}

        {mountMode === "mobile" && (
          <ul role="list" className="mt-16 flex flex-col gap-12">
            {INDUSTRIES.map((ind, i) => (
              <MobileIndustryBlock
                key={ind.id}
                industry={ind}
                play={inView}
                delay={i * 0.08}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mobile stacked block — full preview content per industry
// ---------------------------------------------------------------------------

interface MobileIndustryBlockProps {
  industry: Industry;
  play: boolean;
  delay: number;
}

function MobileIndustryBlock({
  industry,
  play,
  delay,
}: MobileIndustryBlockProps) {
  const ref = useRef<HTMLLIElement>(null);
  const Icon = ICONS[industry.icon];

  useEffect(() => {
    setupGsap();
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(el, { opacity: 0, y: 24, filter: "blur(4px)" });
      if (play) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          delay,
        });
      }
    }, el);
    return () => ctx.revert();
  }, [play, delay]);

  return (
    <li ref={ref} className="flex flex-col">
      <span
        className="font-display uppercase text-bone"
        style={{
          fontSize: "10px",
          fontWeight: 400,
          letterSpacing: "0.42em",
        }}
      >
        {industry.sectorCode}
      </span>
      <div className="mt-4 h-14 w-14 text-bone" aria-hidden>
        <Icon />
      </div>
      <h3
        className="mt-4 font-display font-bold uppercase text-bone"
        style={{
          fontSize: "clamp(36px, 9vw, 48px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
        }}
      >
        {industry.name}
        <span className="text-bone">.</span>
      </h3>
      <span aria-hidden className="mt-4 block h-px w-12 bg-bone" />
      <p
        className="mt-4 font-body text-[16px]"
        style={{
          color: "rgba(192,197,206,0.85)",
          lineHeight: 1.7,
        }}
      >
        {industry.body}
      </p>
    </li>
  );
}

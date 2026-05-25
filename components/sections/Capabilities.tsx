"use client";

import { useEffect, useRef } from "react";
import CapabilityRow, {
  type CapabilityIconKey,
} from "@/components/ui/CapabilityCard";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { gsap, setupGsap } from "@/components/animations/gsap";

interface Capability {
  icon: CapabilityIconKey;
  title: string;
  body: string;
  tags: ReadonlyArray<string>;
}

const CAPABILITIES: readonly Capability[] = [
  {
    icon: "turning",
    title: "CNC Turning Live Tool",
    body:
      "Multi-axis turning centers producing complex rotational geometries with sub-thousandth tolerances. Bar fed and chucker capabilities up to 12 inches in diameter.",
    tags: ["BAR FED", "CHUCKER", "LIVE TOOLS", "MULTI-AXIS", 'UP TO 12"'],
  },
  {
    icon: "milling",
    title: "CNC Milling",
    body:
      "4-axis milling for prismatic and contoured parts. From prototype to full production runs in steel, aluminum, titanium, and exotic alloys.",
    tags: ["4-AXIS", "STEEL", "ALUMINUM", "TITANIUM"],
  },
] as const;

export default function Capabilities() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(
    0.4,
    "0px 0px -10% 0px"
  );
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupGsap();
    const root = headerRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = root.querySelectorAll<HTMLElement>("[data-cap-head]");
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 24, filter: "blur(6px)" });
      if (inView) {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [inView]);

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative w-full bg-[#1B57C9] py-28 md:py-36"
    >
      <div ref={ref} className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header block */}
        <div ref={headerRef} className="flex flex-col">
          <span
            data-cap-head
            aria-hidden
            className="font-display text-[11px] uppercase text-bone"
            style={{ fontWeight: 400, letterSpacing: "0.42em" }}
          >
            WHAT WE DO
          </span>

          <h2
            id="capabilities-heading"
            data-cap-head
            className="mt-4 font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            MORI SEIKI MACHINES<span className="text-bone">.</span>
          </h2>

          <p
            data-cap-head
            className="mt-4 max-w-md font-body text-[18px] text-mediumGray"
          >
            Two disciplines. One standard.
          </p>
        </div>

        {/* Editorial rows */}
        <ul role="list" className="mt-16 flex flex-col md:mt-24">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityRow
              key={cap.icon}
              index={i}
              icon={cap.icon}
              title={cap.title}
              body={cap.body}
              tags={cap.tags}
              play={inView}
              delay={0.4 + i * 0.15}
              isFirst={i === 0}
              isLast={i === CAPABILITIES.length - 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

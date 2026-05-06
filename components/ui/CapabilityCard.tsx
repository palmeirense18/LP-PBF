"use client";

import { useEffect, useRef } from "react";
import {
  TurningIcon,
  MillingIcon,
  GrindingIcon,
} from "@/components/ui/icons/CapabilityIcons";
import { gsap, setupGsap } from "@/components/animations/gsap";

export type CapabilityIconKey = "turning" | "milling" | "grinding";

const ICONS: Record<CapabilityIconKey, () => JSX.Element> = {
  turning: TurningIcon,
  milling: MillingIcon,
  grinding: GrindingIcon,
};

export interface CapabilityRowProps {
  index: number;
  icon: CapabilityIconKey;
  title: string;
  body: string;
  tags: ReadonlyArray<string>;
  play: boolean;
  delay: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function CapabilityRow({
  index,
  icon,
  title,
  body,
  tags,
  play,
  delay,
  isFirst,
  isLast,
}: CapabilityRowProps) {
  const rootRef = useRef<HTMLLIElement>(null);
  const Icon = ICONS[icon];
  const indexLabel = String(index + 1).padStart(2, "0");

  useEffect(() => {
    setupGsap();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const indexEl = root.querySelector<HTMLElement>("[data-cap-row='index']");
      const stageEl = root.querySelector<HTMLElement>("[data-cap-row='stage']");
      const titleEl = root.querySelector<HTMLElement>("[data-cap-row='title']");
      const bodyEl = root.querySelector<HTMLElement>("[data-cap-row='body']");
      const tagsEl = root.querySelector<HTMLElement>("[data-cap-row='tags']");
      const iconEl = root.querySelector<HTMLElement>("[data-cap-row='icon']");

      const targets = [indexEl, stageEl, titleEl, bodyEl, tagsEl, iconEl].filter(
        Boolean
      ) as HTMLElement[];

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 16, filter: "blur(4px)" });

      if (play) {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          delay,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [play, delay]);

  return (
    <li
      ref={rootRef}
      data-cap-card
      data-cursor="hover"
      className="cap-row group relative grid grid-cols-12 gap-6 py-12 md:gap-8 md:py-16"
      style={{
        borderTop: isFirst
          ? "1px solid rgba(43,91,166,0.6)"
          : "1px solid rgba(43,91,166,0.3)",
        borderBottom: isLast ? "1px solid rgba(43,91,166,0.3)" : undefined,
        transition: "border-color 280ms cubic-bezier(0.25,1,0.5,1)",
      }}
    >
      {/* Index block — cols 1-2 on md+, full width above content on mobile */}
      <div className="col-span-12 md:col-span-2 md:col-start-1">
        <div className="flex items-end justify-between gap-4 md:block">
          <span
            data-cap-row="index"
            aria-hidden
            className="cap-row-index block font-display font-bold uppercase"
            style={{
              fontSize: "clamp(72px, 9vw, 144px)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              color: "rgba(192,197,206,0.12)",
              transition: "color 280ms cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            {indexLabel}
          </span>

          {/* Mobile-only icon (top-right of stacked block) */}
          <div
            data-cap-row="icon"
            aria-hidden
            className="cap-row-icon-mobile h-10 w-10 shrink-0 text-royal md:hidden"
            style={{
              transition: "filter 280ms cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            <Icon />
          </div>
        </div>
        <span
          data-cap-row="stage"
          aria-hidden
          className="mt-2 inline-block font-display uppercase text-royalLight"
          style={{
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.4em",
          }}
        >
          STAGE {indexLabel}
        </span>
      </div>

      {/* Content block — cols 3-9 */}
      <div className="col-span-12 md:col-span-7 md:col-start-3">
        <h3
          data-cap-row="title"
          className="mb-4 font-display font-bold uppercase text-bone"
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.005em",
          }}
        >
          {title}
          <span className="text-royal">.</span>
        </h3>
        <span
          aria-hidden
          className="cap-row-underline mb-6 block h-px bg-royal"
          style={{
            width: 0,
            transition: "width 320ms cubic-bezier(0.25,1,0.5,1)",
          }}
        />
        <p
          data-cap-row="body"
          className="mb-8 max-w-2xl font-body"
          style={{
            fontSize: "clamp(15px, 1.1vw, 17px)",
            color: "rgba(192,197,206,0.85)",
            lineHeight: 1.7,
          }}
        >
          {body}
        </p>
        <div
          data-cap-row="tags"
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="inline-flex items-center gap-3 font-display uppercase"
              style={{
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.32em",
                color: "rgba(192,197,206,0.7)",
              }}
            >
              {tag}
              {i < tags.length - 1 ? (
                <span aria-hidden className="text-royal">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {/* Icon block — cols 11-12, desktop only (mobile icon shown above) */}
      <div
        data-cap-row="icon"
        className="col-span-2 col-start-11 hidden self-center text-royal md:block"
        style={{
          transition: "filter 280ms cubic-bezier(0.25,1,0.5,1)",
        }}
      >
        <div className="h-24 w-24">
          <Icon />
        </div>
      </div>
    </li>
  );
}

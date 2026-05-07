"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/animations/gsap";

type StatBase = { id: string; label: string };
type StaticStat = StatBase & { kind: "static"; display: string };
type CountStat = StatBase & {
  kind: "count";
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatNoCommas?: boolean;
};
export type Stat = StaticStat | CountStat;

function formatValue(stat: CountStat, value: number): string {
  const decimals = stat.decimals ?? 0;
  const rounded = Number(value.toFixed(decimals));
  const formatted = stat.formatNoCommas
    ? rounded.toFixed(decimals)
    : new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(rounded);
  return `${stat.prefix ?? ""}${formatted}${stat.suffix ?? ""}`;
}

function finalText(stat: Stat): string {
  return stat.kind === "static" ? stat.display : formatValue(stat, stat.to);
}

export default function StatCounter({
  stat,
  play,
  delay = 0,
}: {
  stat: Stat;
  play: boolean;
  delay?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numEl = numberRef.current;
    if (!numEl) return;
    if (stat.kind === "count") {
      numEl.textContent = formatValue(stat, stat.from);
    } else {
      numEl.textContent = stat.display;
    }
  }, [stat]);

  useEffect(() => {
    if (!play) return;
    const wrapper = wrapperRef.current;
    const numEl = numberRef.current;
    const labelEl = labelRef.current;
    if (!wrapper || !numEl || !labelEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(wrapper, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(labelEl, { opacity: 1 });
      gsap.set(numEl, { scale: 1 });
      numEl.textContent = finalText(stat);
      return;
    }

    gsap.set(wrapper, { opacity: 0, y: 16, filter: "blur(8px)" });
    gsap.set(labelEl, { opacity: 0 });
    gsap.set(numEl, { scale: 1, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ delay });

    tl.to(wrapper, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.7,
      ease: "power4.out",
    });

    tl.to(
      labelEl,
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "<+=0.2"
    );

    if (stat.kind === "count") {
      const proxy = { value: stat.from };
      tl.to(
        proxy,
        {
          value: stat.to,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            numEl.textContent = formatValue(stat, proxy.value);
          },
          onComplete: () => {
            numEl.textContent = formatValue(stat, stat.to);
          },
        },
        "<"
      );
    }

    tl.to(
      numEl,
      {
        scale: 1.04,
        duration: 0.12,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "+=0.04"
    );

    return () => {
      tl.kill();
    };
  }, [play, delay, stat]);

  return (
    <div
      ref={wrapperRef}
      className="flex min-h-[160px] flex-col items-center justify-center px-3 py-10 text-center md:px-4 md:py-0"
      style={{ opacity: 0 }}
    >
      <span
        ref={numberRef}
        aria-hidden="true"
        className="font-display font-bold tabular-nums text-bone"
        style={{
          fontSize: "clamp(28px, 4.8vw, 64px)",
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
          textShadow: "0 0 24px rgba(43, 91, 166, 0.18)",
          display: "inline-block",
        }}
      />
      <span className="sr-only">{finalText(stat)}</span>
      <span
        ref={labelRef}
        className="mt-2 block font-body text-[11px] uppercase tracking-[0.28em] text-silver md:text-[12px]"
        style={{ fontWeight: 400 }}
      >
        {stat.label}
      </span>
    </div>
  );
}

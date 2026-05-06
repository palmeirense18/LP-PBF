"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import EquipmentSpecRow from "@/components/ui/EquipmentSpecRow";
import type { Equipment } from "@/lib/equipment-data";

interface EquipmentSlideProps {
  machine: Equipment;
  index: number;
  total: number;
}

export default function EquipmentSlide({
  machine,
  index,
  total,
}: EquipmentSlideProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isStudio = machine.id === "vm04";

  return (
    <li
      ref={ref}
      className="border-t border-silver/10 py-12 first:border-t-0 first:pt-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
      }}
    >
      {/* Category badge */}
      <span
        className="mb-4 inline-flex items-center gap-2 font-display uppercase text-royalLight"
        style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.32em" }}
      >
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-royal"
        />
        {machine.category.toUpperCase()}
      </span>

      {/* Photo */}
      <div className="relative w-full overflow-hidden bg-charcoal">
        <div
          className="relative aspect-[3/2] w-full"
          style={{
            filter: "contrast(1.06) saturate(0.85) brightness(0.92)",
          }}
        >
          <Image
            src={machine.image}
            alt={machine.alt}
            fill
            sizes="100vw"
            quality={88}
            priority={index === 0}
            className="object-cover"
          />
          {isStudio && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,10,0.35), rgba(10,10,10,0.65))",
              }}
            />
          )}
          {/* Royal tint */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(43,91,166,0.06), transparent 70%)",
            }}
          />
          {/* Vignette */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.5) 100%)",
            }}
          />
          {/* Inner outline */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 0 1px rgba(43,91,166,0.25)" }}
          />
          {/* Corner accent */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 block h-px w-9 origin-right rotate-45 bg-royal/60"
          />
        </div>
      </div>

      {/* Designation + Name */}
      <div className="mt-6">
        <span
          className="font-display uppercase text-royalLight"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.4em",
          }}
        >
          {machine.designation}
        </span>
        <h3
          className="mt-3 font-display font-bold uppercase text-bone"
          style={{
            fontSize: "clamp(24px, 6vw, 32px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {machine.name}
        </h3>
        <span
          aria-hidden
          className="mt-4 block h-px w-12 bg-royal"
        />
      </div>

      {/* Spec rows */}
      <dl className="mt-6 grid grid-cols-[110px_1fr] gap-x-5 gap-y-4">
        {machine.specs.map((s) => (
          <EquipmentSpecRow key={s.label} label={s.label} value={s.value} />
        ))}
      </dl>

      {/* Counter */}
      <div
        className="mt-6 font-display text-silver/40"
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.32em",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </li>
  );
}

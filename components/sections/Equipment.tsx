"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger, setupGsap } from "@/components/animations/gsap";
import { EQUIPMENT } from "@/lib/equipment-data";
import EquipmentSlide from "@/components/ui/EquipmentSlide";
import EquipmentProgress from "@/components/ui/EquipmentProgress";

const SEQUENCE_LENGTH = EQUIPMENT.length;
const STEP_VH = 200;

export default function Equipment() {
  const [mountMode, setMountMode] = useState<"pinned" | "stacked" | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Decide which variant to render after mount (avoids SSR mismatch)
  useEffect(() => {
    const decide = () => {
      const mqDesktop = window.matchMedia("(min-width: 768px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMountMode(mqDesktop && !reduced ? "pinned" : "stacked");
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

  return (
    <section
      id="equipment"
      aria-labelledby="equipment-heading"
      className="relative w-full bg-ink [overflow:clip]"
    >
      {/* Heading block (always rendered, scrolls normally) */}
      <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-28 md:px-10 md:pt-36">
        <span
          aria-hidden
          className="font-display uppercase text-royalLight"
          style={{
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.42em",
          }}
        >
          OUR INFRASTRUCTURE
        </span>
        <h2
          id="equipment-heading"
          className="mt-4 font-display font-bold uppercase text-bone"
          style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          OUR EQUIPMENT<span className="text-royal">.</span>
        </h2>
        <span
          aria-hidden
          className="mt-6 block h-[3px] w-20 bg-royal"
        />
        <p className="mt-6 max-w-md font-body text-[18px] text-mediumGray">
          The hardware behind every micron of precision.
        </p>
      </div>

      {/* Screen-reader equivalent: full machine list */}
      <ul className="sr-only">
        {EQUIPMENT.map((m) => (
          <li key={m.id}>
            <h3>
              {m.designation} — {m.name} ({m.category})
            </h3>
            <p>{m.alt}</p>
            <dl>
              {m.specs.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Live region: announces active slide on desktop */}
      {mountMode === "pinned" && (
        <span aria-live="polite" className="sr-only">
          Now viewing {activeIndex + 1} of {SEQUENCE_LENGTH}:{" "}
          {EQUIPMENT[activeIndex].name}
        </span>
      )}

      {mountMode === "pinned" && (
        <PinnedVariant
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}

      {mountMode === "stacked" && (
        <ul className="mx-auto max-w-[1440px] px-6 pb-28 md:px-10">
          {EQUIPMENT.map((m, i) => (
            <EquipmentSlide
              key={m.id}
              machine={m}
              index={i}
              total={SEQUENCE_LENGTH}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pinned variant (desktop, no reduced motion)
// ---------------------------------------------------------------------------

interface PinnedVariantProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

function PinnedVariant({ activeIndex, setActiveIndex }: PinnedVariantProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastActiveIndexRef = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    setupGsap();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const photos = photoRefs.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      // Initial state — only photo 0 visible
      photos.forEach((p, i) => {
        gsap.set(p, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 1.04,
          y: 0,
        });
      });

      const totalScroll = SEQUENCE_LENGTH * STEP_VH;

      const trigger = ScrollTrigger.create({
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
            Math.round(value * SEQUENCE_LENGTH) / SEQUENCE_LENGTH,
          duration: { min: 0.2, max: 0.6 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const p = self.progress;
          const i = Math.min(
            SEQUENCE_LENGTH - 1,
            Math.floor(p * SEQUENCE_LENGTH * 0.9999)
          );

          // setState only on boundary change — no per-frame React reconciliation
          if (i !== lastActiveIndexRef.current) {
            lastActiveIndexRef.current = i;
            setActiveIndex(i);

            // Update dot data-active attributes imperatively (CSS handles styling)
            dotRefs.current.forEach((el, idx) => {
              if (!el) return;
              el.dataset.active = idx === i ? "true" : "false";
            });
          }

          // Imperative width update for the progress fill — direct DOM, no React
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${p * 100}%`;
          }

          // Crossfade photos based on progress
          const scaled = p * SEQUENCE_LENGTH;
          photos.forEach((el, idx) => {
            const isLast = idx === SEQUENCE_LENGTH - 1;
            const local = scaled - idx; // 0..1 within this slot, may go negative or >1
            let opacity = 0;
            let scale = 1.04;
            if (local <= -0.3) {
              opacity = 0;
              scale = 1.04;
            } else if (local < 0) {
              const t = (local + 0.3) / 0.3; // 0..1
              opacity = t;
              scale = 1.04 - t * 0.04;
            } else if (local <= 0.7) {
              opacity = 1;
              scale = 1;
            } else if (local < 1) {
              // Last photo has no successor — hold it steady instead of fading to black.
              if (isLast) {
                opacity = 1;
                scale = 1;
              } else {
                const t = (local - 0.7) / 0.3; // 0..1
                opacity = 1 - t;
                scale = 1;
              }
            } else {
              // Beyond this slot's window: the last photo stays fully visible
              // through to the pin release so the section never flashes black.
              opacity = isLast ? 1 : 0;
              scale = 1;
            }
            // Parallax: -16 → +16 across the visible window
            const parallaxT = Math.max(-0.3, Math.min(1, local));
            const yShift = -16 + (parallaxT + 0.3) * (32 / 1.3);

            gsap.set(el, { opacity, scale, y: yShift });
          });
        },
      });

      // Initialize dot 0 as active
      requestAnimationFrame(() => {
        dotRefs.current.forEach((el, idx) => {
          if (!el) return;
          el.dataset.active = idx === 0 ? "true" : "false";
        });
      });

      return () => {
        trigger.kill();
      };
    }, wrapper);

    return () => ctx.revert();
  }, [setActiveIndex]);

  const active = EQUIPMENT[activeIndex];

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-6 md:px-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={`counter-${activeIndex}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-bone"
            style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.18em" }}
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SEQUENCE_LENGTH).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={`tag-${activeIndex}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 font-display uppercase text-royalLight"
            style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.32em" }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-royal"
            />
            {active.category.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Main split */}
      <div className="absolute inset-x-0 top-12 bottom-10 flex">
        {/* Photo stage */}
        <div className="relative w-[58%] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
            <div
              className="relative aspect-[3/2] max-h-full w-full overflow-hidden bg-ink"
              style={{
                filter: "contrast(1.06) saturate(0.85) brightness(0.92)",
              }}
            >
              {/* Defense-in-depth base layer: the last machine, always present
                  behind the crossfade stack so a sub-frame gap during fast
                  scroll/resize never flashes pure black. */}
              <div aria-hidden className="absolute inset-0">
                <Image
                  src={EQUIPMENT[SEQUENCE_LENGTH - 1].image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  quality={88}
                  className="object-cover"
                />
              </div>
              {EQUIPMENT.map((m, i) => {
                const isStudio = m.id === "vm04";
                return (
                  <div
                    key={m.id}
                    ref={(el) => {
                      photoRefs.current[i] = el;
                    }}
                    className="absolute inset-0"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <Image
                      src={m.image}
                      alt={m.alt}
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      quality={88}
                      priority={i === 0}
                      className="object-cover"
                    />
                    {isStudio && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(10,10,10,0.25), rgba(10,10,10,0.55))",
                        }}
                      />
                    )}
                  </div>
                );
              })}
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
                    "radial-gradient(ellipse at center, transparent 55%, rgba(10,10,10,0.55) 100%)",
                }}
              />
              {/* Inner outline */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: "inset 0 0 0 1px rgba(43,91,166,0.25)" }}
              />
              {/* Corner accent — top-right diagonal */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-4"
                style={{
                  width: "36px",
                  height: "1px",
                  backgroundColor: "rgba(43,91,166,0.6)",
                  transform: "rotate(-45deg)",
                  transformOrigin: "right center",
                }}
              />
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <span
          aria-hidden
          className="block w-px self-stretch bg-royal/20"
        />

        {/* Spec panel */}
        <div className="relative flex w-[42%] items-center px-10 lg:px-14">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`spec-${activeIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="font-display uppercase text-royalLight"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.4em",
                  }}
                >
                  {active.designation}
                </span>
                <h3
                  className="mt-3 font-display font-bold uppercase text-bone"
                  style={{
                    fontSize: "clamp(28px, 3.4vw, 48px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {active.name}
                </h3>
                <span
                  aria-hidden
                  className="my-8 block h-px w-full bg-silver/15"
                />
                <dl className="flex flex-col gap-y-5">
                  {active.specs.map((s, idx) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.32,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.05 + idx * 0.03,
                      }}
                      className="flex items-baseline gap-6"
                    >
                      <dt
                        className="font-body uppercase text-silver shrink-0"
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          letterSpacing: "0.18em",
                          width: "140px",
                        }}
                      >
                        {s.label}
                      </dt>
                      <dd
                        className="font-display text-bone"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        {s.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-10 px-6 md:px-10">
        <div className="flex h-full items-center">
          <EquipmentProgress
            total={SEQUENCE_LENGTH}
            activeIndex={activeIndex}
            fillRef={progressFillRef}
            dotRefs={dotRefs}
          />
        </div>
      </div>
    </div>
  );
}

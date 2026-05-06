"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, setupGsap } from "@/components/animations/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import CertBadge from "@/components/ui/CertBadge";

const HEADING_LINE_1 = "Built in New Jersey";
const HEADING_LINE_2 = "Trusted Worldwide";

const PARAGRAPHS = [
  "PBFMACHINE is a family-owned precision machining shop operating out of New Jersey since our founding. We exist for one reason: to manufacture parts that meet the unforgiving tolerances modern industry demands.",
  "Our floor combines decades of operator experience with the latest multi-axis CNC platforms, full inspection laboratories, and a quality system built around AS9100 and ISO 9001 disciplines. Every part that ships carries our name.",
];

const CLOSE_PARAGRAPH =
  "When tolerance is non-negotiable and lead time matters, the right shop makes all the difference. We are that shop.";

const PULL_QUOTE = "We are that shop";

interface CalloutSpec {
  id: string;
  eyebrow: string;
  value: string;
  // Wrapper position relative to photo (interior anchoring, percentages)
  wrapper: React.CSSProperties;
  // SVG dimensions
  svgWidth: number;
  svgHeight: number;
  // Connector line endpoints + dot position
  lineX1: number;
  lineY1: number;
  lineX2: number;
  lineY2: number;
  dotX: number;
  dotY: number;
  // Label pill position within the wrapper
  label: React.CSSProperties;
  labelAlign: "left" | "right";
}

// Callouts sit ENTIRELY within the photo's bounding box, in interior positions
// that don't intersect the heading bleed zone (top edge ~60px) or the body text
// column (cols 8-12, outside the photo's cols 2-7).
const CALLOUTS: CalloutSpec[] = [
  // A — OPERATING / 40+ YEARS
  // Wrapper at top 38% / left 18% — mid-left interior. Label at top-right of
  // wrapper, connector points down-left into the chuck/spindle area.
  {
    id: "operating",
    eyebrow: "OPERATING",
    value: "40+ YEARS",
    wrapper: {
      top: "38%",
      left: "18%",
      width: "160px",
      height: "70px",
    },
    svgWidth: 160,
    svgHeight: 70,
    lineX1: 60,
    lineY1: 30,
    lineX2: 15,
    lineY2: 55,
    dotX: 13,
    dotY: 53,
    label: { top: 0, right: 0 },
    labelAlign: "right",
  },
  // B — TOLERANCE / ±0.0001"
  // Wrapper at top 72% / left 14% — lower-left interior. Label at bottom-right,
  // connector points up-left into the work envelope.
  {
    id: "tolerance",
    eyebrow: "TOLERANCE",
    value: '±0.0001"',
    wrapper: {
      top: "72%",
      left: "14%",
      width: "160px",
      height: "70px",
    },
    svgWidth: 160,
    svgHeight: 70,
    lineX1: 60,
    lineY1: 40,
    lineX2: 15,
    lineY2: 15,
    dotX: 13,
    dotY: 13,
    label: { bottom: 0, right: 0 },
    labelAlign: "right",
  },
  // C — CERTIFIED / AS9100 · ISO 9001
  // Wrapper at top 28% / left 48% — upper-middle interior, sits BELOW the
  // heading-bleed zone. Label at top-left, connector points down-right toward
  // the spindle/work area.
  {
    id: "certified",
    eyebrow: "CERTIFIED",
    value: "AS9100 · ISO 9001",
    wrapper: {
      top: "28%",
      left: "48%",
      width: "200px",
      height: "70px",
    },
    svgWidth: 200,
    svgHeight: 70,
    lineX1: 130,
    lineY1: 40,
    lineX2: 178,
    lineY2: 60,
    dotX: 176,
    dotY: 58,
    label: { top: 0, left: 0 },
    labelAlign: "left",
  },
];

function lineLength(c: CalloutSpec) {
  const dx = c.lineX2 - c.lineX1;
  const dy = c.lineY2 - c.lineY1;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function About() {
  const { ref: revealRef, inView } = useInViewOnce<HTMLDivElement>(
    0.2,
    "0px 0px -10% 0px"
  );
  const sectionRef = useRef<HTMLElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupGsap();
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const verticalText = root.querySelector<HTMLElement>(
        "[data-about='vertical']"
      );
      const eyebrow = root.querySelector<HTMLElement>("[data-about='eyebrow']");
      const headingLines = root.querySelectorAll<HTMLElement>(
        "[data-about='heading-line']"
      );
      const photo = root.querySelector<HTMLElement>("[data-about='photo']");
      const calloutLines = root.querySelectorAll<SVGPathElement>(
        "[data-about='callout-line']"
      );
      const calloutDots = root.querySelectorAll<HTMLElement>(
        "[data-about='callout-dot']"
      );
      const calloutLabels = root.querySelectorAll<HTMLElement>(
        "[data-about='callout-label']"
      );
      const paras = root.querySelectorAll<HTMLElement>("[data-about='para']");
      const pullQuote = root.querySelector<HTMLElement>(
        "[data-about='pull-quote']"
      );
      const pullBars = root.querySelectorAll<HTMLElement>(
        "[data-about='pull-bar']"
      );
      const badges = root.querySelectorAll<HTMLElement>("[data-about='badge']");

      if (reduced) {
        gsap.set(
          [
            verticalText,
            eyebrow,
            photo,
            pullQuote,
            ...Array.from(headingLines),
            ...Array.from(calloutLabels),
            ...Array.from(calloutDots),
            ...Array.from(paras),
            ...Array.from(pullBars),
            ...Array.from(badges),
          ].filter(Boolean),
          { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", scaleY: 1 }
        );
        calloutLines.forEach((p) => {
          gsap.set(p, { strokeDashoffset: 0 });
        });
        return;
      }

      gsap.set(verticalText, { opacity: 0 });
      gsap.set([eyebrow, ...Array.from(paras)], { opacity: 0, y: 16 });
      gsap.set(headingLines, { yPercent: 100, opacity: 0 });
      gsap.set(photo, { opacity: 0, scale: 1.04 });
      gsap.set(calloutDots, { scale: 0, transformOrigin: "center" });
      gsap.set(calloutLabels, { opacity: 0, y: 6 });
      calloutLines.forEach((p) => {
        const len = parseFloat(p.dataset.length || "0");
        gsap.set(p, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });
      gsap.set(pullBars, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(pullQuote, { opacity: 0, y: 32 });
      gsap.set(badges, { opacity: 0, scale: 0.96 });

      if (!inView) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(verticalText, { opacity: 1, duration: 1.2 })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to(
          headingLines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power4.out",
          },
          0.2
        )
        .to(photo, { opacity: 1, scale: 1, duration: 1 }, 0.35)
        .to(
          calloutLines,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.7
        )
        .to(
          calloutDots,
          { scale: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.1 },
          0.95
        )
        .to(
          calloutLabels,
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 },
          1.0
        )
        .to(paras, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.85)
        .to(pullBars, { scaleY: 1, duration: 0.5 }, "+=0.05")
        .to(pullQuote, { opacity: 1, y: 0, duration: 0.8 }, "<+=0.1")
        .to(
          badges,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.06,
          },
          "+=0.1"
        );
    }, root);

    return () => ctx.revert();
  }, [inView]);

  // Subtle scroll-tied photo parallax (desktop only, no reduced motion)
  useEffect(() => {
    setupGsap();
    const photoEl = photoInnerRef.current;
    const sectionEl = sectionRef.current;
    if (!photoEl || !sectionEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !desktop) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        photoEl,
        { y: 24 },
        {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden bg-charcoal py-32 md:py-44"
    >
      {/* Vertical decorative text — far-left edge, md+ only */}
      <div
        data-about="vertical"
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 z-[1] hidden md:left-8 md:block"
        style={{ transform: "translateY(-50%)" }}
      >
        <span
          className="block font-display uppercase"
          style={{
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.6em",
            color: "rgba(192,197,206,0.15)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            whiteSpace: "nowrap",
          }}
        >
          EST. NEW JERSEY <span className="text-royal">·</span> USA
        </span>
      </div>

      <div
        ref={revealRef}
        className="relative mx-auto max-w-[1440px] px-6 md:px-12"
      >
        {/* Eyebrow + Heading — bleeds onto photo top only */}
        <div className="relative z-20 grid grid-cols-12 md:-mb-14">
          <div className="col-span-12 md:col-span-8 md:col-start-2">
            <span
              data-about="eyebrow"
              aria-hidden
              className="mb-6 block font-display uppercase text-royalLight"
              style={{
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.42em",
              }}
            >
              ABOUT US
            </span>

            <h2
              id="about-heading"
              className="font-display font-bold uppercase text-bone"
              style={{
                fontSize: "clamp(36px, 4.4vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              <span className="block overflow-hidden whitespace-nowrap">
                <span data-about="heading-line" className="inline-block">
                  {HEADING_LINE_1}
                  <span className="text-royal">.</span>
                </span>
              </span>
              <span className="block overflow-hidden whitespace-nowrap">
                <span data-about="heading-line" className="inline-block">
                  {HEADING_LINE_2}
                  <span className="text-royal">.</span>
                </span>
              </span>
            </h2>
          </div>
        </div>

        {/* Photo + body row */}
        <div className="relative z-10 mt-10 grid grid-cols-12 gap-6 md:mt-0 md:gap-8">
          {/* Photo block — cols 2-7 on md+, full width on mobile */}
          <div
            data-about="photo"
            className="relative col-span-12 md:col-span-6 md:col-start-2"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/4]">
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  filter: "contrast(1.08) saturate(0.78) brightness(0.78)",
                }}
              >
                <div
                  ref={photoInnerRef}
                  className="absolute"
                  style={{
                    top: "-32px",
                    bottom: "-32px",
                    left: 0,
                    right: 0,
                  }}
                >
                  <Image
                    src="/about/shop-floor.jpg"
                    alt="Inside the PBFMACHINE turning cell — chuck, work envelope, and operator console."
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    quality={88}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Overlays */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(45,52,54,0) 0%, rgba(45,52,54,0.45) 60%, rgba(10,10,10,0.85) 100%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(10,10,10,0.4) 0%, transparent 25%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(45,52,54,0.5) 0%, transparent 30%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,10,0.55) 100%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ backgroundColor: "rgba(43,91,166,0.06)" }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: "inset 0 0 0 1px rgba(43,91,166,0.18)" }}
              />

              {/* Floating callouts (desktop only) — all anchored INSIDE photo */}
              <div
                aria-hidden
                className="about-callouts pointer-events-none absolute inset-0 hidden md:block"
              >
                {CALLOUTS.map((c) => (
                  <div
                    key={c.id}
                    className="absolute"
                    style={c.wrapper}
                  >
                    <svg
                      width={c.svgWidth}
                      height={c.svgHeight}
                      viewBox={`0 0 ${c.svgWidth} ${c.svgHeight}`}
                      className="absolute inset-0"
                      aria-hidden
                    >
                      <line
                        data-about="callout-line"
                        data-length={lineLength(c).toFixed(2)}
                        x1={c.lineX1}
                        y1={c.lineY1}
                        x2={c.lineX2}
                        y2={c.lineY2}
                        stroke="rgba(43,91,166,0.5)"
                        strokeWidth={1}
                      />
                      <rect
                        data-about="callout-dot"
                        x={c.dotX}
                        y={c.dotY}
                        width={4}
                        height={4}
                        fill="#2B5BA6"
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                        }}
                      />
                    </svg>
                    <div
                      data-about="callout-label"
                      className={`absolute inline-flex flex-col gap-1 bg-ink/70 px-2.5 py-1.5 backdrop-blur-sm ${
                        c.labelAlign === "right"
                          ? "items-end text-right"
                          : "items-start text-left"
                      }`}
                      style={c.label}
                    >
                      <span
                        className="font-display uppercase text-royalLight"
                        style={{
                          fontSize: "9px",
                          fontWeight: 400,
                          letterSpacing: "0.42em",
                        }}
                      >
                        {c.eyebrow}
                      </span>
                      <span
                        className="font-display font-bold uppercase text-bone"
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body text — cols 8-12 on md+, full width on mobile, no overlap */}
          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-16">
            <div className="max-w-md">
              {PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  data-about="para"
                  className="mb-6 font-body text-[16px] md:text-[17px]"
                  style={{
                    color: "rgba(192,197,206,0.9)",
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </p>
              ))}
              <p
                data-about="para"
                className="mt-6 border-t border-royal/30 pt-6 font-body text-[16px] font-medium text-bone md:text-[17px]"
                style={{ lineHeight: 1.7 }}
              >
                {CLOSE_PARAGRAPH}
              </p>
            </div>
          </div>
        </div>

        {/* Pull quote */}
        <div className="relative mx-auto mt-20 flex flex-col items-center md:mt-28">
          <span
            data-about="pull-bar"
            aria-hidden
            className="mb-6 block h-14 w-px bg-royal"
          />
          <blockquote
            data-about="pull-quote"
            className="max-w-3xl text-center font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            {PULL_QUOTE}
            <span className="text-royal">.</span>
          </blockquote>
          <span
            data-about="pull-bar"
            aria-hidden
            className="mt-6 block h-6 w-px bg-royal"
          />
        </div>

        {/* Cert badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <span data-about="badge" className="inline-flex">
            <CertBadge label="AS9100" detail="AEROSPACE" />
          </span>
          <span data-about="badge" className="inline-flex">
            <CertBadge label="ISO 9001" detail="QUALITY" />
          </span>
          <span data-about="badge" className="inline-flex">
            <CertBadge label="ITAR" detail="REGISTERED" />
          </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { gsap, setupGsap } from "@/components/animations/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Detect viewport + reduced motion on mount; pick the right src.
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    setReduceMotion(motionMq.matches);
    setVideoSrc(
      mobileMq.matches ? "/hero/video-hero-loop-mobile.mp4" : "/hero/video-hero-loop.mp4"
    );
    const onMotionChange = () => setReduceMotion(motionMq.matches);
    motionMq.addEventListener("change", onMotionChange);
    return () => motionMq.removeEventListener("change", onMotionChange);
  }, []);

  // Silent autoplay maximization for iOS Safari.
  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let played = false;

    const safePlay = () => {
      if (played) return;
      video.muted = true;
      video.playsInline = true;
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          played = true;
        }).catch(() => {
          /* still blocked — first-interaction listener will retry */
        });
      } else {
        played = true;
      }
    };

    if (video.readyState >= 3) {
      safePlay();
    } else {
      video.addEventListener("canplay", safePlay, { once: true });
    }

    const onFirstInteraction = () => {
      safePlay();
      if (played) {
        window.removeEventListener("touchstart", onFirstInteraction);
        window.removeEventListener("scroll", onFirstInteraction);
        window.removeEventListener("click", onFirstInteraction);
        window.removeEventListener("keydown", onFirstInteraction);
      }
    };
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("scroll", onFirstInteraction, { passive: true });
    window.addEventListener("click", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction, { passive: true });

    return () => {
      video.removeEventListener("canplay", safePlay);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [reduceMotion, videoSrc]);

  // Entrance choreography
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
    <section ref={sectionRef} className="relative w-full h-screen bg-ink">
      <div className="relative h-full w-full overflow-hidden">
        {videoSrc && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            autoPlay={!reduceMotion}
            loop={!reduceMotion}
            muted
            playsInline
            {...({ "webkit-playsinline": "true" } as Record<string, string>)}
            preload="auto"
            poster="/hero/video-hero-poster.jpg"
            aria-hidden
            style={{ background: "#0A0A0A" }}
          />
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, transparent 32%, rgba(10,10,10,0.55) 58%, rgba(10,10,10,0.92) 100%)",
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 40%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.92) 100%)",
          }}
        />

        <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center md:left-auto md:right-0 md:w-[52%] md:justify-start">
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
              className="hero-h1 font-display font-bold uppercase text-bone"
              style={{
                fontSize: "clamp(40px, 5.2vw, 80px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
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
              className="hero-subhead mx-auto mt-6 max-w-md rounded-sm bg-ink/35 px-4 py-3 font-body text-[16px] leading-relaxed text-mediumGray backdrop-blur-[3px] md:mx-0 md:bg-transparent md:p-0 md:text-[18px] md:backdrop-blur-none"
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

        <div ref={indicatorRef} className="relative z-30">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}

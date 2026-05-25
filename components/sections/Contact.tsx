"use client";

import { useEffect, useRef } from "react";
import { gsap, setupGsap } from "@/components/animations/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import ContactForm from "@/components/ui/ContactForm";
import ContactInfoBlock from "@/components/ui/ContactInfoBlock";

const INFO = [
  {
    icon: "address" as const,
    label: "Address",
    value: "615 Pennsylvania Ave\nElizabeth, NJ 07201\nUnited States",
  },
  {
    icon: "phone" as const,
    label: "Phone",
    value: "(862) 291-9548",
    href: "tel:+18622919548",
  },
  {
    icon: "email" as const,
    label: "Email",
    value: "info@pbfmachine.com",
    href: "mailto:info@pbfmachine.com",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: revealRef, inView } = useInViewOnce<HTMLDivElement>(
    0.15,
    "0px 0px -10% 0px"
  );

  useEffect(() => {
    setupGsap();
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const decoLine = root.querySelector<HTMLElement>("[data-contact='deco-line']");
      const decoLabel = root.querySelector<HTMLElement>("[data-contact='deco-label']");
      const eyebrow = root.querySelector<HTMLElement>("[data-contact='eyebrow']");
      const heading = root.querySelector<HTMLElement>("[data-contact='heading']");
      const subhead = root.querySelector<HTMLElement>("[data-contact='subhead']");
      const fields = root.querySelectorAll<HTMLElement>("[data-contact-field]");
      const infoHair = root.querySelector<HTMLElement>("[data-contact='info-hairline']");
      const infoEyebrow = root.querySelector<HTMLElement>("[data-contact='info-eyebrow']");
      const infoBlocks = root.querySelectorAll<HTMLElement>("[data-contact='info-block']");

      const finalState = {
        opacity: 1,
        y: 0,
        scaleY: 1,
        filter: "blur(0px)",
      };

      if (reduced) {
        gsap.set(
          [
            decoLine,
            decoLabel,
            eyebrow,
            heading,
            subhead,
            infoHair,
            infoEyebrow,
            ...Array.from(fields),
            ...Array.from(infoBlocks),
          ].filter(Boolean),
          finalState
        );
        return;
      }

      gsap.set(decoLine, { transformOrigin: "top center", scaleY: 0 });
      gsap.set([decoLabel, eyebrow, subhead], {
        opacity: 0,
        y: 16,
        filter: "blur(4px)",
      });
      gsap.set(heading, { opacity: 0, y: 32 });
      gsap.set(fields, { opacity: 0, y: 16 });
      gsap.set([infoHair, infoEyebrow], { opacity: 0, y: 12 });
      gsap.set(infoBlocks, { opacity: 0, y: 16 });

      if (!inView) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(decoLine, {
        scaleY: 1,
        duration: 0.6,
        ease: "power3.out",
      })
        .to(
          decoLabel,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 },
          "-=0.2"
        )
        .to(
          eyebrow,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          "-=0.1"
        )
        .to(
          heading,
          { opacity: 1, y: 0, duration: 0.8 },
          "+=0.05"
        )
        .to(
          subhead,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          "-=0.4"
        )
        .to(
          fields,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
          },
          "+=0.05"
        )
        .to(
          [infoHair, infoEyebrow],
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "+=0.1"
        )
        .to(
          infoBlocks,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        );
    }, root);

    return () => ctx.revert();
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full bg-ink py-32 md:py-44"
    >
      <div
        ref={revealRef}
        className="mx-auto max-w-3xl px-6 md:px-10"
      >
        {/* Top decoration */}
        <div className="mb-10 flex flex-col items-center">
          <span
            data-contact="deco-line"
            aria-hidden
            className="block h-10 w-px bg-royal"
          />
          <span
            data-contact="deco-label"
            aria-hidden
            className="mt-3 font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: "rgba(192,197,206,0.4)",
            }}
          >
            09 / 10
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <span
            data-contact="eyebrow"
            aria-hidden
            className="mb-6 block font-display uppercase text-royalLight"
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.42em",
            }}
          >
            LET&rsquo;S BUILD SOMETHING
          </span>
          <h2
            id="contact-heading"
            data-contact="heading"
            className="font-display font-bold uppercase text-bone"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            READY TO QUOTE YOUR PART<span className="text-royal">?</span>
          </h2>
          <p
            data-contact="subhead"
            className="mx-auto mt-6 max-w-xl font-body text-[18px] leading-relaxed text-mediumGray"
          >
            Send us your prints, specs, or just a question. We respond within
            one business day.
          </p>
        </div>

        {/* Form */}
        <div className="mt-16 md:mt-20">
          <ContactForm />
        </div>

        {/* Info row */}
        <div className="mt-24">
          <span
            data-contact="info-hairline"
            aria-hidden
            className="block h-px w-full bg-silver/15"
          />
          <span
            data-contact="info-eyebrow"
            aria-hidden
            className="mb-8 mt-8 block font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: "rgba(192,197,206,0.4)",
            }}
          >
            INFORMATION
          </span>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
            {INFO.map((info) => (
              <span data-contact="info-block" key={info.label} className="block">
                <ContactInfoBlock
                  icon={info.icon}
                  label={info.label}
                  value={info.value}
                  href={info.href}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

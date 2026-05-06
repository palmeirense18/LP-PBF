"use client";

import { useEffect, useRef } from "react";
import LogoMark from "@/components/ui/LogoMark";
import CertBadge from "@/components/ui/CertBadge";
import FooterLinkColumn from "@/components/ui/FooterLinkColumn";
import { gsap, setupGsap } from "@/components/animations/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";

const FOOTER_COLUMNS = [
  {
    title: "Capabilities",
    links: [
      { label: "CNC Turning", href: "#capabilities" },
      { label: "CNC Milling", href: "#capabilities" },
      { label: "Precision Grinding", href: "#capabilities" },
      { label: "Equipment", href: "#equipment" },
      { label: "Inspection", href: "#process" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Aerospace", href: "#industries" },
      { label: "Defense", href: "#industries" },
      { label: "Automotive", href: "#industries" },
      { label: "Medical", href: "#industries" },
      { label: "Industrial", href: "#industries" },
      { label: "Energy", href: "#industries" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
      { label: "Compliance", href: "#about" },
      { label: "Careers", href: "mailto:careers@pbfmachine.com" },
    ],
  },
] as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { ref: revealRef, inView } = useInViewOnce<HTMLDivElement>(
    0.15,
    "0px 0px -10% 0px"
  );
  const year = new Date().getFullYear();

  useEffect(() => {
    setupGsap();
    const root = footerRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const wordmark = root.querySelector<HTMLElement>("[data-footer='wordmark']");
      const brand = root.querySelector<HTMLElement>("[data-footer='brand']");
      const cols = root.querySelectorAll<HTMLElement>("[data-footer='link-col']");
      const hairline = root.querySelector<HTMLElement>("[data-footer='hairline']");
      const bottom = root.querySelector<HTMLElement>("[data-footer='bottom']");

      if (reduced) {
        gsap.set(
          [
            wordmark,
            brand,
            hairline,
            bottom,
            ...Array.from(cols),
          ].filter(Boolean),
          { opacity: 1, y: 0, filter: "blur(0px)" }
        );
        return;
      }

      gsap.set(wordmark, { opacity: 0 });
      gsap.set(brand, { opacity: 0, y: 16, filter: "blur(4px)" });
      gsap.set(cols, { opacity: 0, y: 12 });
      gsap.set([hairline, bottom], { opacity: 0 });

      if (!inView) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(wordmark, { opacity: 1, duration: 1.4 })
        .to(
          brand,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
          },
          0
        )
        .to(
          cols,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "+=0.05"
        )
        .to(
          [hairline, bottom],
          { opacity: 1, duration: 0.6 },
          "+=0.1"
        );
    }, root);

    return () => ctx.revert();
  }, [inView]);

  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: reduced ? 0 : 1.6,
        immediate: reduced,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      className="relative w-full overflow-hidden bg-ink"
    >
      {/* Faded wordmark backdrop */}
      <div
        data-footer="wordmark"
        aria-hidden
        className="pointer-events-none absolute z-0 select-none"
        style={{
          bottom: "-8%",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          className="block font-display font-bold uppercase"
          style={{
            fontSize: "clamp(180px, 24vw, 480px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: "rgba(192,197,206,0.04)",
          }}
        >
          PBFMACHINE
        </span>
      </div>

      <div
        ref={revealRef}
        className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-y-12 px-6 pb-16 pt-24 md:grid-cols-2 md:gap-y-16 md:px-10 md:pt-32 lg:grid-cols-12 lg:gap-8"
      >
        {/* Brand column */}
        <div data-footer="brand" className="lg:col-span-5">
          <div className="group/logo flex items-center">
            <LogoMark size={32} className="text-silver" />
            <span
              className="ml-3 font-display font-bold uppercase text-bone"
              style={{ fontSize: "18px", letterSpacing: "0.18em" }}
            >
              PBFMACHINE
            </span>
          </div>

          <p
            className="mt-8 max-w-xs font-display uppercase"
            style={{
              fontSize: "13px",
              fontWeight: 400,
              letterSpacing: "0.32em",
              color: "rgba(192,197,206,0.8)",
            }}
          >
            Precision<span className="text-royal">.</span> Quality
            <span className="text-royal">.</span> Performance
            <span className="text-royal">.</span>
          </p>

          <div className="mt-8 flex flex-col gap-1 font-body text-[12px]">
            <span style={{ color: "rgba(192,197,206,0.6)" }}>
              615 PENNSYLVANIA AVE
            </span>
            <span style={{ color: "rgba(192,197,206,0.6)" }}>
              ELIZABETH, NJ 07201
            </span>
            <a
              href="mailto:info@pbfmachine.com"
              data-cursor="hover"
              className="mt-2 text-bone transition-colors duration-200 hover:text-royal"
            >
              info@pbfmachine.com
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 [&>*]:origin-left [&>*]:scale-90">
            <CertBadge label="AS9100" detail="AEROSPACE" />
            <CertBadge label="ISO 9001" detail="QUALITY" />
            <CertBadge label="ITAR" detail="REGISTERED" />
          </div>
        </div>

        {/* Link columns */}
        <div data-footer="link-col" className="lg:col-span-2">
          <FooterLinkColumn
            title={FOOTER_COLUMNS[0].title}
            links={FOOTER_COLUMNS[0].links}
          />
        </div>
        <div data-footer="link-col" className="lg:col-span-2">
          <FooterLinkColumn
            title={FOOTER_COLUMNS[1].title}
            links={FOOTER_COLUMNS[1].links}
          />
        </div>
        <div data-footer="link-col" className="lg:col-span-3">
          <FooterLinkColumn
            title={FOOTER_COLUMNS[2].title}
            links={FOOTER_COLUMNS[2].links}
          />
        </div>
      </div>

      {/* Hairline */}
      <div
        data-footer="hairline"
        aria-hidden
        className="relative z-10 mx-auto h-px max-w-[1440px] bg-mediumGray/[0.12]"
      />

      {/* Bottom strip */}
      <div
        data-footer="bottom"
        className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-start gap-3 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10"
      >
        <p
          className="font-body text-[12px]"
          style={{ color: "rgba(192,197,206,0.5)" }}
        >
          © {year} PBFMACHINE LLC. All rights reserved.
        </p>

        <span
          className="hidden items-center gap-2 md:inline-flex"
          aria-hidden
        >
          <span className="block h-2 w-2 bg-royal" />
          <span
            className="font-display uppercase"
            style={{
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.42em",
              color: "rgba(192,197,206,0.7)",
            }}
          >
            MADE WITH PRECISION IN NEW JERSEY
          </span>
        </span>

        <a
          href="#top"
          onClick={handleBackToTop}
          data-cursor="hover"
          className="group/back inline-flex items-center gap-2 font-display uppercase outline-none transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
          style={{
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.32em",
            color: "rgba(192,197,206,0.6)",
          }}
        >
          BACK TO TOP
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/back:-translate-y-0.5"
          >
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}

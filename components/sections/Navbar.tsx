"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/ui/Logo";
import NavLink from "@/components/ui/NavLink";
import Button from "@/components/ui/Button";
import Hamburger from "@/components/ui/Hamburger";
import MobileMenu from "@/components/ui/MobileMenu";
import { useAnchorScroll } from "@/lib/useAnchorScroll";

const NAV_ITEMS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Equipment", href: "#equipment" },
  { label: "Industries", href: "#industries" },
  { label: "Why PBF", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const SCROLL_THRESHOLD = 100;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorClick = useAnchorScroll();
  const rafRef = useRef(0);

  useEffect(() => {
    let active = true;
    let cleanupScroll = () => {};

    const update = (y: number) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setScrolled(y >= SCROLL_THRESHOLD);
      });
    };

    const attachScroll = () => {
      if (!active) return;
      const lenis = window.__lenis;
      if (lenis) {
        const handler = ({ scroll }: { scroll: number }) => update(scroll);
        lenis.on("scroll", handler);
        update(lenis.scroll ?? window.scrollY);
        cleanupScroll = () => lenis.off("scroll", handler);
      } else {
        const handler = () => update(window.scrollY);
        window.addEventListener("scroll", handler, { passive: true });
        update(window.scrollY);
        cleanupScroll = () =>
          window.removeEventListener("scroll", handler);
      }
    };

    const raf = requestAnimationFrame(attachScroll);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      cleanupScroll();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, []);

  useEffect(() => {
    const targets = NAV_ITEMS.map((item) =>
      document.querySelector<HTMLElement>(item.href)
    ).filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = `#${entry.target.id}`;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size === 0) {
          setActiveId(null);
          return;
        }
        let bestId: string | null = null;
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        setActiveId(bestId);
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.01, 0.5, 1],
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navClass = `pointer-events-auto fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    scrolled
      ? "bg-[rgba(45,52,54,0.78)] [backdrop-filter:blur(14px)_saturate(140%)] [-webkit-backdrop-filter:blur(14px)_saturate(140%)] border-b border-silver/[0.12]"
      : "bg-transparent border-b border-silver/[0.04]"
  }`;

  return (
    <>
      <header role="banner" className={navClass}>
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:h-24 md:px-10">
          <Logo onAnchorClick={(e) => {
            e.preventDefault();
            const lenis = window.__lenis;
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (lenis) {
              lenis.scrollTo(0, { duration: reduced ? 0 : 1.2, immediate: reduced });
            } else {
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            }
            history.replaceState(null, "", "/");
          }} />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 xl:flex 2xl:gap-10"
          >
            {NAV_ITEMS.filter((item) => item.href !== "#contact").map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={activeId === item.href}
                onClick={anchorClick(item.href)}
              />
            ))}
          </nav>

          <div className="flex items-center">
            <div className="hidden xl:block">
              <Button
                variant="primary"
                size="sm"
                href="#contact"
                withArrow={false}
                onClick={anchorClick("#contact")}
              >
                Contact Us
              </Button>
            </div>
            <div className="xl:hidden">
              <Hamburger
                open={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={NAV_ITEMS}
      />
    </>
  );
}

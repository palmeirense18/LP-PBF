"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Hamburger from "@/components/ui/Hamburger";
import { useAnchorScroll } from "@/lib/useAnchorScroll";

const EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = { label: string; href: string };

export default function MobileMenu({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: ReadonlyArray<Item>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const anchorClick = useAnchorScroll();

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        closeBtnRef.current?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        closeBtnRef.current?.focus();
      } else if (
        !e.shiftKey &&
        document.activeElement === closeBtnRef.current
      ) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => {
      const firstLink = dialogRef.current?.querySelector<HTMLElement>(
        'a[data-mobile-link="true"]'
      );
      firstLink?.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [open, onClose]);

  const handleLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    anchorClick(href, { onComplete: onClose })(e);
    onClose();
  };

  const linkStagger = reducedMotion ? 0 : 0.07;
  const exitStagger = reducedMotion ? 0 : 0.04;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: EXPO }}
          className="fixed inset-0 z-[60] flex h-dvh w-screen flex-col overflow-y-auto bg-ink px-8 pb-10 pt-6 md:hidden"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-32 w-px bg-royal/70"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-32 h-px w-24 bg-royal/40"
          />

          <div className="flex h-16 items-center justify-end">
            <Hamburger
              ref={closeBtnRef}
              open
              onClick={onClose}
              controls="mobile-menu"
            />
          </div>

          <nav aria-label="Mobile primary" className="mt-8 flex flex-col">
            {items.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                data-cursor="hover"
                data-mobile-link="true"
                onClick={handleLinkClick(item.href)}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  y: 12,
                  filter: "blur(4px)",
                  transition: {
                    duration: reducedMotion ? 0 : 0.22,
                    delay: reducedMotion
                      ? 0
                      : (items.length - 1 - i) * exitStagger,
                    ease: EXPO,
                  },
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  delay: reducedMotion ? 0 : 0.18 + i * linkStagger,
                  ease: EXPO,
                }}
                className="group/mlink relative flex items-center py-2 font-display font-bold uppercase text-bone outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
                style={{
                  fontSize: "clamp(36px, 9vw, 64px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none mr-3 inline-block h-2 w-2 -translate-x-3 bg-royal opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mlink:translate-x-0 group-hover/mlink:opacity-100"
                />
                {item.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              delay: reducedMotion ? 0 : 0.18 + items.length * linkStagger,
              ease: EXPO,
            }}
            className="mt-10 flex flex-col gap-1 border-t border-silver/20 pt-6 font-body text-[13px] text-silver"
          >
            <span>pbf@pbfmachine.com</span>
            <span>(862) 291-9548</span>
            <span>Elizabeth, NJ · USA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              delay: reducedMotion ? 0 : 0.22 + items.length * linkStagger,
              ease: EXPO,
            }}
            className="mt-auto pt-10"
          >
            <Button
              variant="primary"
              href="#contact"
              onClick={handleLinkClick("#contact")}
              className="w-full"
            >
              Contact Us
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

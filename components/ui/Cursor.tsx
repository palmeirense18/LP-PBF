"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  const ringX = useSpring(dotX, { stiffness: 220, damping: 24, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 24, mass: 0.6 });

  const ringScale = useSpring(1, { stiffness: 260, damping: 22 });
  const dotOpacity = useSpring(1, { stiffness: 260, damping: 22 });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest('a, button, [role="button"], [data-cursor="hover"]');
    };

    const handleOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) setHovering(true);
    };
    const handleOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) setHovering(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, [enabled, visible, dotX, dotY]);

  useEffect(() => {
    ringScale.set(hovering ? 1.6 : 1);
    dotOpacity.set(hovering ? 0 : 1);
  }, [hovering, ringScale, dotOpacity]);

  const dotTranslateX = useTransform(dotX, (v) => `${v - 4}px`);
  const dotTranslateY = useTransform(dotY, (v) => `${v - 4}px`);
  const ringTranslateX = useTransform(ringX, (v) => `${v - 18}px`);
  const ringTranslateY = useTransform(ringY, (v) => `${v - 18}px`);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: "1px solid #C0C5CE",
          pointerEvents: "none",
          zIndex: 9999,
          x: ringTranslateX,
          y: ringTranslateY,
          scale: ringScale,
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: "#2B5BA6",
          pointerEvents: "none",
          zIndex: 10000,
          x: dotTranslateX,
          y: dotTranslateY,
          opacity: visible ? dotOpacity : 0,
        }}
      />
    </>
  );
}

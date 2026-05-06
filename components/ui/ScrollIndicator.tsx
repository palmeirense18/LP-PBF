"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
    >
      <div className="relative h-14 w-px overflow-hidden bg-silver/30">
        <motion.span
          className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-royal"
          initial={{ y: -4 }}
          animate={{ y: [0, 56, 56] }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            times: [0, 0.85, 1],
          }}
        />
      </div>
      <span className="font-display text-[10px] uppercase tracking-[0.42em] text-silver">
        Scroll
      </span>
    </div>
  );
}

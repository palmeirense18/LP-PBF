"use client";

import { useCallback, useRef, useState } from "react";

export function useInViewOnce<T extends Element>(
  threshold = 0.6,
  rootMargin = "0px 0px -10% 0px"
) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const firedRef = useRef(false);

  const ref = useCallback(
    (node: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || firedRef.current) return;

      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          firedRef.current = true;
          setInView(true);
          obs.disconnect();
          observerRef.current = null;
        },
        { threshold, rootMargin }
      );
      obs.observe(node);
      observerRef.current = obs;
    },
    [threshold, rootMargin]
  );

  return { ref, inView };
}

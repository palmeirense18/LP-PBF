"use client";

import { useEffect, useRef } from "react";

type AnyFn = (...args: never[]) => void;

export function useRafThrottle<T extends AnyFn>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const frameRef = useRef<number | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);
  const wrapperRef = useRef<T | null>(null);

  if (wrapperRef.current === null) {
    const wrapper = ((...args: Parameters<T>) => {
      argsRef.current = args;
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const latest = argsRef.current;
        argsRef.current = null;
        if (latest) callbackRef.current(...latest);
      });
    }) as T;
    wrapperRef.current = wrapper;
  }

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  return wrapperRef.current;
}

export default useRafThrottle;

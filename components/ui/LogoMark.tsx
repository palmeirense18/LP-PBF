"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// three/r3f/drei stay out of the SSR/initial bundle — the navbar renders
// instantly with the PNG and the 3D upgrades in after hydration.
const Logo3D = dynamic(() => import("@/components/three/Logo3D"), {
  ssr: false,
});

type LogoMarkProps = {
  size?: number;
  className?: string;
  withTile?: boolean;
};

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function LogoMark({
  size = 40,
  className,
  withTile = true,
}: LogoMarkProps) {
  // Keep the same outer box as the previous tile treatment → no layout shift.
  const box = withTile ? Math.round(size * 1.1) : size;

  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWebgl(webglAvailable());
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  // Reduced motion or no WebGL → clean static PNG, no canvas cost.
  const enable3D = webgl && !reduced;

  return (
    <span
      className={className}
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        width: box,
        height: box,
        // Soft grounding so the mark sits on the bar without the heavy coin.
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))",
      }}
    >
      {/* Static PNG: SSR/pre-mount placeholder + reduced-motion/no-WebGL
          fallback. Inset matches the 3D plane's share of the canvas so the
          crossfade is seamless. */}
      <span
        style={{
          position: "absolute",
          inset: "3.7%",
          opacity: enable3D && ready ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <Image
          src="/brand/logo-icon.png"
          alt=""
          fill
          sizes={`${box}px`}
          priority
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </span>

      {enable3D && (
        <span style={{ position: "absolute", inset: 0, display: "block" }}>
          <Logo3D size={box} onReady={handleReady} />
        </span>
      )}
    </span>
  );
}

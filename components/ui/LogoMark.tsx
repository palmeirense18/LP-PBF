"use client";

import Image from "next/image";

type LogoMarkProps = {
  size?: number;
  className?: string;
  withTile?: boolean;
};

export default function LogoMark({
  size = 40,
  className,
  withTile = true,
}: LogoMarkProps) {
  const tileSize = withTile ? Math.round(size * 1.1) : size;
  const iconSize = withTile ? Math.round(tileSize * 0.92) : size;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: tileSize,
        height: tileSize,
        borderRadius: "50%",
        background: withTile ? "#F5F0E6" : "transparent",
        boxShadow: withTile
          ? "0 0 0 1px rgba(245, 240, 230, 0.18), 0 4px 14px rgba(0, 0, 0, 0.35)"
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
      aria-hidden
    >
      <span
        style={{
          display: "inline-block",
          width: iconSize,
          height: iconSize,
          position: "relative",
        }}
      >
        <Image
          src="/brand/logo-icon.png"
          alt=""
          fill
          sizes={`${iconSize}px`}
          priority
          style={{ objectFit: "contain" }}
        />
      </span>
    </span>
  );
}

"use client";

import Image from "next/image";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export default function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        position: "relative",
      }}
      aria-hidden
    >
      <Image
        src="/brand/logo-icon.png"
        alt=""
        fill
        sizes={`${size}px`}
        priority
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}

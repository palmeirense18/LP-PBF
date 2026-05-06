interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 24, className }: LogoMarkProps) {
  // Scale stroke width proportionally to the original 26x26 / 1.25 ratio
  // so larger sizes don't get heavier-looking strokes.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      aria-hidden
      className={className ? `block shrink-0 ${className}` : "block shrink-0"}
    >
      <g transform="rotate(45 13 13)">
        <rect
          x="5"
          y="5"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          x="10"
          y="10"
          width="6"
          height="6"
          fill="#2B5BA6"
          className="origin-center transition-[fill] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:[fill:#F5F5F5]"
        />
      </g>
    </svg>
  );
}

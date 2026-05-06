"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  withArrow?: boolean;
};

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type Props = AnchorProps | ButtonProps;

const baseClasses =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden font-display font-bold uppercase tracking-[0.18em] outline-none transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal";

const sizeClasses: Record<Size, string> = {
  md: "px-7 py-3.5 text-sm",
  sm: "px-5 py-2.5 text-xs",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-royal text-bone hover:bg-navy hover:scale-[1.02] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  ghost:
    "border border-silver/40 bg-transparent text-bone hover:border-silver hover:bg-[rgba(192,197,206,0.06)]",
};

const Arrow = () => (
  <span
    aria-hidden
    className="ml-1 inline-block translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[4px]"
  >
    →
  </span>
);

const Sheen = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [background:linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] [mix-blend-mode:overlay] group-hover/btn:translate-x-[200%]"
  />
);

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      className,
      children,
      withArrow,
      ...rest
    } = props;
    const showArrow = withArrow ?? (variant === "primary" && size === "md");
    const showSheen = variant === "primary";

    const content = (
      <>
        {showSheen ? <Sheen /> : null}
        <span className="relative z-10 inline-flex items-center">
          {children}
          {showArrow ? <Arrow /> : null}
        </span>
      </>
    );

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as AnchorProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          data-cursor="hover"
          className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    const buttonRest = rest as Omit<
      ButtonProps,
      "variant" | "size" | "children" | "className" | "withArrow"
    >;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        data-cursor="hover"
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

export default Button;

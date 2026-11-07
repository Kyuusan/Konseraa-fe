"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "destructive-outline"
  | "link";

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "xl"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"
  | "icon-xl";

const BASE_CLASSES =
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border font-sans font-bold uppercase tracking-wide outline-none transition-all duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-full focus-visible:ring-2 focus-visible:ring-accent-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: "h-10 px-5 text-xs sm:text-sm",
  xs: "h-7 gap-1 px-3 text-[11px]",
  sm: "h-9 gap-1.5 px-4 text-xs",
  lg: "h-11 px-6 text-xs md:h-12 md:px-8 md:text-sm",
  xl: "h-12 px-7 text-xs md:h-14 md:px-9 md:text-sm",
  icon: "size-10",
  "icon-xs": "size-7",
  "icon-sm": "size-9",
  "icon-lg": "size-11",
  "icon-xl": "size-12",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    "border-accent-lime bg-accent-lime text-bg-base shadow-[0_1px_20px_rgba(198,255,61,0.22),inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105 hover:shadow-[0_4px_28px_rgba(198,255,61,0.38)] active:shadow-none",
  outline:
    "border-border bg-bg-surface/60 text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm hover:border-text-primary/25 hover:bg-white/8 active:shadow-none",
  secondary:
    "border-transparent bg-bg-surface-2 text-text-primary hover:bg-bg-surface-2/80",
  ghost:
    "border-transparent bg-transparent text-text-primary hover:bg-white/8",
  destructive:
    "border-accent-pink bg-accent-pink text-bg-base shadow-[0_1px_20px_rgba(255,61,166,0.25)] hover:brightness-110 active:shadow-none",
  "destructive-outline":
    "border-accent-pink/40 bg-transparent text-accent-pink hover:bg-accent-pink/10",
  link: "border-transparent bg-transparent text-accent-lime underline-offset-4 hover:underline",
};

function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    BASE_CLASSES,
    SIZE_CLASSES[size ?? "default"],
    VARIANT_CLASSES[variant ?? "default"],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  render?: React.ReactElement<Record<string, unknown>>;
}

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const mergedClassName = buttonVariants({ variant, size, className });

  if (render && React.isValidElement(render)) {
    return React.cloneElement(render, {
      ...props,
      "data-slot": "button",
      className: cn(
        mergedClassName,
        (render.props as { className?: string })?.className,
      ),
      children: children ?? (render.props as { children?: React.ReactNode })?.children,
    });
  }

  return (
    <button
      data-slot="button"
      type={type}
      className={mergedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
export default Button;

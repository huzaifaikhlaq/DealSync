import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

export type PopoverTriggerAttributes = {
  popovertarget?: string;
  popovertargetaction?: "toggle" | "show" | "hide";
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-white shadow-[0_2px_4px_rgb(53_37_205_/_14%)] hover:bg-[#3d34d7] hover:shadow-[0_6px_16px_rgb(53_37_205_/_19%)]",
  secondary:
    "bg-white text-foreground shadow-[0_1px_3px_rgb(20_27_46_/_5%)] hover:border-[#e5e4f1] hover:bg-surface-low",
  quiet: "bg-transparent text-foreground hover:bg-surface-low",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[2.65rem] px-4 py-[0.65rem] text-[0.82rem]",
  md: "min-h-[2.9rem] px-[1.1rem] py-3",
  lg: "min-h-[3.4rem] px-[1.4rem] py-[0.9rem] text-[0.95rem]",
};

function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-[0.6rem] rounded-[0.65rem] border border-transparent text-center text-[0.9rem] leading-[1.25] font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-150 hover:-translate-y-px active:translate-y-0",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
} & PopoverTriggerAttributes;

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName(variant, size, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={getButtonClassName(variant, size, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

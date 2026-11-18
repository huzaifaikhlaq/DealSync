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
  primary: "button-primary",
  secondary: "button-secondary",
  quiet: "button-quiet",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "button-sm",
  md: "button-md",
  lg: "button-lg",
};

function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn("button", variantClasses[variant], sizeClasses[size], className);
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

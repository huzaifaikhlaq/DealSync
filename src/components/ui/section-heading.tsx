import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
  titleClassName,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("text-left", align === "center" && "text-center", className)}>
      <p className="mb-3 text-[0.72rem] font-bold tracking-[0.13em] text-primary-container uppercase">{eyebrow}</p>
      <h2 className={cn("m-0 text-[clamp(1.8rem,3.5vw,2.65rem)] leading-[1.15] font-semibold tracking-[-0.045em]", titleClassName)} id={id}>{title}</h2>
      {description ? <p className="mx-auto mt-4 max-w-[48rem] text-[1.05rem] leading-[1.7] text-text-muted">{description}</p> : null}
      {children}
    </div>
  );
}

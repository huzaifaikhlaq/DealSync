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
    <div className={cn("section-heading", align === "center" && "is-centered", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={titleClassName} id={id}>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
      {children}
    </div>
  );
}

import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function DashboardBreadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <div className="breadcrumbs">
      <BriefcaseBusiness size={18} />
      <span>DealSync</span>
      {items.map((item, index) => (
        <span className="breadcrumb-segment" key={item.label + "-" + index}>
          <b>/</b>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <strong aria-current="page">{item.label}</strong>
          )}
        </span>
      ))}
    </div>
  );
}

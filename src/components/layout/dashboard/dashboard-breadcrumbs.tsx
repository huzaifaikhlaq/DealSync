import { BriefcaseBusiness } from "lucide-react";

export function DashboardBreadcrumbs({ currentPage }: { currentPage: string }) {
  return (
    <div className="breadcrumbs">
      <BriefcaseBusiness size={18} />
      <span>Acme Cloud Systems</span>
      <b>/</b>
      <strong>{currentPage}</strong>
    </div>
  );
}

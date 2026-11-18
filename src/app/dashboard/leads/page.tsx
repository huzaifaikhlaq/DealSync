import type { Metadata } from "next";
import { LeadsPage } from "@/features/leads/leads-page";

export const metadata: Metadata = {
  title: "Leads | DealSync",
  description: "Search, filter, and manage your incoming leads in DealSync.",
};

export default function LeadsRoute() {
  return (
    <div className="overflow-hidden">
      <LeadsPage />
    </div>
  )
}

import type { Metadata } from "next";
import { LeadsPage } from "@/features/leads/leads-page";

export const metadata: Metadata = {
  title: "Leads | DealSync",
  description: "Search, filter, and manage your incoming leads in DealSync.",
};

export default async function LeadsRoute({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string | string[] }>;
}) {
  const params = await searchParams;
  const leadId = Array.isArray(params.leadId)
    ? params.leadId[0]
    : params.leadId;

  return (
    <div className="overflow-hidden">
      <LeadsPage initialLeadId={leadId} />
    </div>
  );
}

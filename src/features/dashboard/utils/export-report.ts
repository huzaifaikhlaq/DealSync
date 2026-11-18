import { serializeCsv } from "@/lib/utils/csv";
import type { DashboardLead } from "../types/dashboard";

export function createLeadReport(leads: readonly DashboardLead[]) {
  return serializeCsv([
    ["Lead", "Role", "Company", "Source form", "Score", "Status", "Received"],
    ...leads.map((lead) => [
      lead.name,
      lead.role,
      lead.company,
      lead.form,
      String(lead.score),
      lead.status,
      lead.time,
    ]),
  ]);
}

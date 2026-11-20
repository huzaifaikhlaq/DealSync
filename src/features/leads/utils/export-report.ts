import { serializeCsv } from "@/lib/utils/csv";
import { extractContactDetails } from "./contact-data";

export type LeadReportRow = {
  data: unknown;
  formName: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: Date;
};

export function createLeadReport(leads: readonly LeadReportRow[]): string {
  return serializeCsv([
    ["Lead", "Email", "Phone", "Source Form", "Status", "Received"],
    ...leads.map((lead) => {
      const contact = extractContactDetails(lead.data);
      return [
        contact.name,
        contact.email,
        contact.phone,
        lead.formName,
        lead.status,
        lead.createdAt.toISOString(),
      ];
    }),
  ]);
}

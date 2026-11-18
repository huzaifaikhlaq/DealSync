import { serializeCsv } from "@/lib/utils/csv";
import type { Lead } from "../types/lead";

export type LeadFilters = {
  query: string;
  form: string;
  status: string;
};

export function filterLeads(leads: readonly Lead[], filters: LeadFilters) {
  const query = filters.query.trim().toLowerCase();

  return leads.filter((lead) => {
    const matchesQuery =
      `${lead.name} ${lead.email} ${lead.company} ${lead.phone}`
        .toLowerCase()
        .includes(query);
    const matchesForm =
      filters.form === "All Forms (8)" || lead.form === filters.form;
    const matchesStatus =
      filters.status === "All Statuses" || lead.status === filters.status;
    return matchesQuery && matchesForm && matchesStatus;
  });
}

export function createLeadsCsv(leads: readonly Lead[]) {
  return serializeCsv([
    [
      "Name",
      "Role",
      "Email",
      "Company",
      "Phone",
      "Source Form",
      "Status",
      "Submitted",
    ],
    ...leads.map((lead) => [
      lead.name,
      lead.role,
      lead.email,
      lead.company,
      lead.phone,
      lead.form,
      lead.status,
      lead.submitted,
    ]),
  ]);
}

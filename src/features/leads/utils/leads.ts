import { serializeCsv } from "@/lib/utils/csv";
import type { Lead } from "../types/lead.types";

export type LeadFilters = {
  query: string;
  form: string;
  status: string;
};

export function filterLeads(
  leads: readonly Lead[],
  filters: LeadFilters,
): Lead[] {
  const query = filters.query.trim().toLowerCase();

  return leads.filter((lead) => {
    const searchable = [lead.name, lead.email, lead.company, lead.phone]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || searchable.includes(query);

    const matchesForm = filters.form === "all" || lead.formId === filters.form;

    const matchesStatus =
      filters.status === "all" || lead.status.toUpperCase() === filters.status;

    return matchesQuery && matchesForm && matchesStatus;
  });
}

export function createLeadsCsv(leads: readonly Lead[]): string {
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
      "Notes",
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
      lead.notes ?? "",
    ]),
  ]);
}

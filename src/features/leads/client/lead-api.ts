import type { Lead } from "../types/lead.types";
import { extractContactDetails } from "../utils/contact-data";

export type LeadDTO = {
  id: string;
  data: Record<string, unknown>;
  status: "NEW" | "CONTACTED" | "CLOSED";
  notes: string | null;
  createdAt: string;
  form: {
    id: string;
    name: string;
    publicId: string;
  };
};

export type LeadListDTO = {
  items: LeadDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function toLeadRecord(item: LeadDTO): Lead {
  const contact = extractContactDetails(item.data);
  const name = contact.name;

  const statuses = {
    NEW: "New",
    CONTACTED: "Contacted",
    CLOSED: "Closed",
  } as const;

  return {
    id: item.id,
    name,
    email: contact.email,
    role: contact.role || "Website visitor",
    company: contact.company || "—",
    domain: contact.domain,
    phone: contact.phone || "—",
    form: item.form.name,
    formId: item.form.id,
    status: statuses[item.status],
    notes: item.notes,
    submitted: new Date(item.createdAt).toLocaleString(),
    initials: name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] ?? "")
      .join("")
      .toUpperCase(),
    color: "lavender",
  };
}

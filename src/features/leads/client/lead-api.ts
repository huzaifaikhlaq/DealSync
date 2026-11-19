import type { Lead } from "../types/lead.types";

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

function getField(data: Record<string, unknown>, key: string): string {
  const value = data[key];

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

export function toLeadRecord(item: LeadDTO): Lead {
  const name = getField(item.data, "name") || "Unknown visitor";

  const statuses = {
    NEW: "New",
    CONTACTED: "Contacted",
    CLOSED: "Closed",
  } as const;

  return {
    id: item.id,
    name,
    email: getField(item.data, "email"),
    role: getField(item.data, "role") || "Website visitor",
    company: getField(item.data, "company") || "—",
    domain: getField(item.data, "domain"),
    phone: getField(item.data, "phone") || "—",
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

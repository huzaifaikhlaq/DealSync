import type { FormRecord } from "../types/form.types";

export type FormDTO = {
  id: string;
  name: string;
  publicId: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  allowedOrigins: string[];
  createdAt: string;
  updatedAt: string;
  _count: {
    submissions: number;
  };
};

export function toFormRecord(form: FormDTO): FormRecord {
  const statuses = {
    DRAFT: "Draft • Unpublished",
    ACTIVE: "Active",
    ARCHIVED: "Archived",
  } as const;

  return {
    id: form.id,
    title: form.name,
    status: statuses[form.status],
    category: "contact",
    date: new Date(form.createdAt).toLocaleDateString(),
    createdAt: form.createdAt,
    slug: form.publicId,
    publicId: form.publicId,
    submissions: String(form._count.submissions),
    conversion: "—",
    last: "See Leads",
    tags: ["API Form"],
  };
}

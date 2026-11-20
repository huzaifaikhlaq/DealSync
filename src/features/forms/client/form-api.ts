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
  const statusLabels = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    ARCHIVED: "Archived",
  } as const;

  return {
    id: form.id,
    title: form.name,
    status: statusLabels[form.status],
    date: new Date(form.createdAt).toLocaleDateString(),
    slug: form.publicId,
    publicId: form.publicId,
    allowedOrigins: form.allowedOrigins,
    createdAt: form.createdAt,
    submissions: String(form._count.submissions),
  };
}

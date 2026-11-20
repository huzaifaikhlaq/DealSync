import type { FormRecord } from "../types/form.types";

export type FormFilters = {
  query: string;
  status: string;
  sort: string;
};

export function filterAndSortForms(
  forms: readonly FormRecord[],
  filters: FormFilters,
) {
  const query = filters.query.trim().toLowerCase();
  return forms
    .filter((form) => {
      const matchesQuery = `${form.title} ${form.slug}`
        .toLowerCase()
        .includes(query);
      return (
        matchesQuery &&
        (filters.status === "all" ||
          form.status.toLowerCase().startsWith(filters.status))
      );
    })
    .sort((a, b) => {
      if (filters.sort === "name") {
        return a.title.localeCompare(b.title);
      }

      if (filters.sort === "submissions") {
        return (
          Number(b.submissions.replaceAll(",", "")) -
          Number(a.submissions.replaceAll(",", ""))
        );
      }

      if (a.createdAt && b.createdAt) {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }

      return String(b.id).localeCompare(String(a.id));
    });
}

export function countFormStatuses(forms: readonly FormRecord[]) {
  return {
    active: forms.filter((form) => form.status === "Active").length,
    draft: forms.filter((form) => form.status.startsWith("Draft")).length,
    archived: forms.filter((form) => form.status === "Archived").length,
  };
}

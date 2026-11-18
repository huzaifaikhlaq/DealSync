import type { FormRecord } from "../types/form.types";

export type FormFilters = {
  query: string;
  status: string;
  category: string;
  sort: string;
};

export function filterAndSortForms(
  forms: readonly FormRecord[],
  filters: FormFilters,
) {
  const query = filters.query.trim().toLowerCase();
  return forms
    .filter((form) => {
      const matchesQuery = `${form.title} ${form.slug} ${form.tags.join(" ")}`
        .toLowerCase()
        .includes(query);
      return (
        matchesQuery &&
        (filters.status === "all" ||
          form.status.toLowerCase().startsWith(filters.status)) &&
        (filters.category === "all" || form.category === filters.category)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "name") return a.title.localeCompare(b.title);
      if (filters.sort === "submissions") {
        return (
          Number(b.submissions.replace(",", "")) -
          Number(a.submissions.replace(",", ""))
        );
      }
      if (a.id > 1_000_000_000_000) return -1;
      if (b.id > 1_000_000_000_000) return 1;
      return a.id - b.id;
    });
}

export function countFormStatuses(forms: readonly FormRecord[]) {
  return {
    active: forms.filter((form) => form.status === "Active").length,
    draft: forms.filter((form) => form.status.startsWith("Draft")).length,
    archived: forms.filter((form) => form.status === "Archived").length,
  };
}

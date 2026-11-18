import { describe, expect, it } from "vitest";
import { filterAndSortForms } from "@/features/forms/utils/forms";
import type { FormRecord } from "@/features/forms/types/form";

const forms: FormRecord[] = [
  {
    id: 2,
    title: "Zulu",
    status: "Active",
    category: "sales",
    date: "Today",
    slug: "zulu",
    submissions: "20",
    conversion: "10%",
    last: "Now",
    tags: ["Enterprise"],
  },
  {
    id: 1,
    title: "Alpha",
    status: "Draft • Unpublished",
    category: "marketing",
    date: "Today",
    slug: "alpha",
    submissions: "0",
    conversion: "—",
    last: "Not live",
    tags: ["Waitlist"],
  },
];

describe("filterAndSortForms", () => {
  it("filters by status and category", () => {
    expect(
      filterAndSortForms(forms, {
        query: "",
        status: "active",
        category: "sales",
        sort: "recent",
      }).map((form) => form.title),
    ).toEqual(["Zulu"]);
  });

  it("sorts matching forms by name", () => {
    expect(
      filterAndSortForms(forms, {
        query: "",
        status: "all",
        category: "all",
        sort: "name",
      }).map((form) => form.title),
    ).toEqual(["Alpha", "Zulu"]);
  });
});

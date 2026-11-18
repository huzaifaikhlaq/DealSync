import { describe, expect, it } from "vitest";
import { filterLeads } from "@/features/leads/utils/leads";
import type { Lead } from "@/features/leads/types/lead.types";

const leads: Lead[] = [
  {
    id: 1,
    name: "Ada",
    role: "CTO",
    email: "ada@example.com",
    company: "Northstar",
    domain: "northstar.test",
    phone: "123",
    form: "Demo",
    status: "Qualified",
    submitted: "Today",
    initials: "A",
    color: "blue",
  },
  {
    id: 2,
    name: "Sam",
    role: "CEO",
    email: "sam@example.com",
    company: "Orbit",
    domain: "orbit.test",
    phone: "456",
    form: "Guide",
    status: "New",
    submitted: "Today",
    initials: "S",
    color: "blue",
  },
];

describe("filterLeads", () => {
  it("matches contact, company, status, and form filters", () => {
    expect(
      filterLeads(leads, {
        query: "northstar",
        form: "All Forms (8)",
        status: "Qualified",
      }).map((lead) => lead.name),
    ).toEqual(["Ada"]);
  });
});

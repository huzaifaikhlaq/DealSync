import { describe, expect, it } from "vitest";

import { getLeadRangeStart } from "@/features/leads/server/lead-range";

describe("getLeadRangeStart", () => {
  const now = new Date("2026-11-20T12:00:00.000Z");

  it.each([
    ["7d", 7],
    ["30d", 30],
    ["90d", 90],
  ] as const)("uses the same rolling window for %s", (range, days) => {
    expect(getLeadRangeStart(range, now)).toEqual(
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    );
  });

  it("returns no lower bound for all time", () => {
    expect(getLeadRangeStart("all", now)).toBeNull();
  });
});

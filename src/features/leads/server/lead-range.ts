export type LeadRange = "7d" | "30d" | "90d" | "all";

const rangeDays: Record<Exclude<LeadRange, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function getLeadRangeStart(
  range: LeadRange,
  now = new Date(),
): Date | null {
  if (range === "all") return null;

  return new Date(now.getTime() - rangeDays[range] * 24 * 60 * 60 * 1000);
}

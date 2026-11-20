import "server-only";

import { getLeadRangeStart } from "@/features/leads/server/lead-range";

import { dashboardRepository } from "./dashboard.repository";

import type {
  DashboardGranularity,
  DashboardOverviewData,
  DashboardRange,
} from "../types/dashboard";

export const dashboardService = {
  getOverview(
    userId: string,
    range: DashboardRange,
    granularity: DashboardGranularity,
    now = new Date(),
  ): Promise<DashboardOverviewData> {
    const startAt = getLeadRangeStart(range, now);
    if (!startAt) throw new Error("A bounded dashboard date range is required");

    return dashboardRepository.getOverview(userId, startAt, now, granularity);
  },
};

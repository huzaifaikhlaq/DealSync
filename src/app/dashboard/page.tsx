import { Suspense } from "react";
import type { Metadata } from "next";

import { requireApprovedOwner } from "@/lib/security/authorize";
import { dashboardService } from "@/features/dashboard/server/dashboard.service";
import type {
  DashboardGranularity,
  DashboardRange,
} from "@/features/dashboard/types/dashboard";
import { OverviewContent } from "@/features/dashboard/components/overview-content";

export const metadata: Metadata = {
  title: "Dashboard Overview | DealSync",
  description: "Review your forms and incoming submissions in DealSync.",
};

type PageProps = {
  searchParams: Promise<{
    range?: string | string[];
    granularity?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseRange(value: string | undefined): DashboardRange {
  return value === "7d" || value === "90d" ? value : "30d";
}

function parseGranularity(value: string | undefined): DashboardGranularity {
  return value === "weekly" || value === "monthly" ? value : "daily";
}

function DashboardLoading() {
  return (
    <div className="dashboard-page" role="status">
      <p>Loading dashboard data…</p>
    </div>
  );
}

async function DashboardOverview({
  range,
  granularity,
}: {
  range: DashboardRange;
  granularity: DashboardGranularity;
}) {
  const user = await requireApprovedOwner();
  const data = await dashboardService.getOverview(user.id, range, granularity);

  return (
    <OverviewContent
      data={data}
      userName={user.name}
      range={range}
      granularity={granularity}
    />
  );
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const range = parseRange(firstValue(params.range));
  const granularity = parseGranularity(firstValue(params.granularity));

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardOverview range={range} granularity={granularity} />
    </Suspense>
  );
}

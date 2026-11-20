"use client";

import { ArrowDownToLine, Plus } from "lucide-react";
import Link from "next/link";

import { useDashboardSearch } from "@/components/layout/dashboard/dashboard-context";

import type {
  DashboardGranularity,
  DashboardOverviewData,
  DashboardRange,
} from "../types/dashboard";
import { LeadsTrendChart } from "./leads-trend-chart";
import { OverviewMetrics } from "./overview-metrics";
import { RecentLeads } from "./recent-leads";
import { ReportingPeriodSelect } from "./reporting-period-select";
import { StatusDistribution } from "./status-distribution";
import { TopPerformingForms } from "./top-performing-forms";

function rangeLabel(range: DashboardRange): string {
  return `the last ${range.slice(0, -1)} days`;
}

export function OverviewContent({
  data,
  userName,
  range,
  granularity,
}: {
  data: DashboardOverviewData;
  userName: string;
  range: DashboardRange;
  granularity: DashboardGranularity;
}) {
  const searchQuery = useDashboardSearch();

  return (
    <div className="dashboard-page overview-content" id="overview">
      <section className="welcome-card">
        <div>
          <div className="welcome-title">
            <h1>Welcome back, {userName}</h1>
          </div>
          <p>
            Review your forms and incoming submissions from {rangeLabel(range)}.
          </p>
        </div>
        <div className="welcome-actions">
          <ReportingPeriodSelect range={range} granularity={granularity} />
          <Link
            className="secondary-button"
            href={`/api/leads/export?range=${range}`}
          >
            <ArrowDownToLine size={17} />
            Export CSV
          </Link>
          <Link className="primary-button" href="/dashboard/forms?create=1">
            <Plus size={18} />
            Create New Form
          </Link>
        </div>
      </section>

      <OverviewMetrics metrics={data.metrics} range={range} />

      <section className="analytics-grid">
        <LeadsTrendChart
          points={data.trend}
          range={range}
          granularity={granularity}
        />
        <StatusDistribution counts={data.statuses} range={range} />
      </section>

      <TopPerformingForms forms={data.forms} range={range} />

      <section className="overview-bottom-grid">
        <RecentLeads
          leads={data.recentLeads}
          query={searchQuery}
          range={range}
        />
      </section>

      <footer className="dash-footer">
        <span>DealSync</span>
        <span>
          Lead counts use submissions received during {rangeLabel(range)}.
        </span>
      </footer>
    </div>
  );
}

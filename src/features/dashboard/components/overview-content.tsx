"use client";

import { useCallback, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  Check,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import {
  useDashboardNewAction,
  useDashboardSearch,
} from "@/components/layout/dashboard/dashboard-context";
import { createLeadReport } from "../utils/export-report";
import { dashboardLeads } from "../data/overview-data";
import { ActivityFeed } from "./activity-feed";
import { LeadsTrendChart } from "./leads-trend-chart";
import { OverviewMetrics } from "./overview-metrics";
import { RecentLeads } from "./recent-leads";
import { StatusDistribution } from "./status-distribution";
import { TopPerformingForms } from "./top-performing-forms";

export function OverviewContent() {
  const [period, setPeriod] = useState("Last 30 days");
  const [notice, setNotice] = useState("");
  const searchQuery = useDashboardSearch();
  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }, []);
  const handleNew = useCallback(() => {
    showNotice("Your new form is ready to configure");
  }, [showNotice]);
  useDashboardNewAction(handleNew);

  function exportReport() {
    const csv = createLeadReport(dashboardLeads);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = "dealsync-leads-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    showNotice("Report exported as CSV");
  }

  return (
    <div className="dashboard-page overview-content" id="overview">
      <section className="welcome-card">
        <div>
          <div className="welcome-title">
            <h1>
              Good morning, Marcus! <span aria-hidden="true">👋</span>
            </h1>
            <span className="live-pill">
              <i /> Live Sync Active
            </span>
          </div>
          <p>
            Here&apos;s what&apos;s happening with your leads and capture forms
            across <strong>Acme Cloud Systems</strong> today.
          </p>
        </div>
        <div className="welcome-actions">
          <label className="select-control">
            <CalendarDays size={17} />
            <select
              aria-label="Reporting date range"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown size={16} />
          </label>
          <button
            className="secondary-button"
            type="button"
            onClick={exportReport}
          >
            <ArrowDownToLine size={17} /> Export Report
          </button>
          <button className="primary-button" type="button" onClick={handleNew}>
            <Plus size={18} /> Create New Form
          </button>
        </div>
      </section>

      <OverviewMetrics />

      <section className="analytics-grid">
        <LeadsTrendChart />
        <StatusDistribution />
      </section>

      <TopPerformingForms onManage={() => showNotice("Opening all forms")} />

      <section className="bottom-grid">
        <RecentLeads query={searchQuery} onAction={showNotice} />
        <ActivityFeed />
      </section>

      <footer className="dash-footer">
        <span>© 2024 DealSync</span>
        <span>
          All data synced just now <i />
        </span>
      </footer>

      {notice && (
        <div className="dash-toast" role="status">
          <Check size={16} />
          {notice}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

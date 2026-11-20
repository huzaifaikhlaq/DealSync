import {
  CheckCircle2,
  ClipboardList,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";

import type { DashboardMetrics, DashboardRange } from "../types/dashboard";

const numberFormatter = new Intl.NumberFormat("en-US");

function periodLabel(range: DashboardRange): string {
  return `in the last ${range.slice(0, -1)} days`;
}

export function OverviewMetrics({
  metrics,
  range,
}: {
  metrics: DashboardMetrics;
  range: DashboardRange;
}) {
  const cards = [
    {
      icon: <ClipboardList size={20} />,
      label: "Total Forms",
      value: metrics.totalForms,
      note: "All forms in your account",
      tone: "indigo",
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "Active Forms",
      value: metrics.activeForms,
      note: "Forms accepting submissions",
      tone: "green",
    },
    {
      icon: <Users size={20} />,
      label: "Total Leads",
      value: metrics.totalLeads,
      note: periodLabel(range),
      tone: "purple",
    },
    {
      icon: <UserPlus size={20} />,
      label: "New Leads",
      value: metrics.newLeads,
      note: periodLabel(range),
      tone: "blue",
    },
    {
      icon: <Phone size={20} />,
      label: "Contacted Leads",
      value: metrics.contactedLeads,
      note: periodLabel(range),
      tone: "indigo",
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "Closed Leads",
      value: metrics.closedLeads,
      note: periodLabel(range),
      tone: "green",
    },
  ] as const;

  return (
    <section
      className="metric-grid overview-metrics-grid"
      aria-label="Dashboard metrics"
    >
      {cards.map((card) => (
        <article className="metric-card" key={card.label}>
          <div className="metric-top">
            <span>{card.label}</span>
            <div className={`metric-icon ${card.tone}`}>{card.icon}</div>
          </div>
          <div className="metric-value">
            <strong>{numberFormatter.format(card.value)}</strong>
          </div>
          <p>{card.note}</p>
        </article>
      ))}
    </section>
  );
}

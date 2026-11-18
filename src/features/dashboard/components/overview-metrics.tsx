import { Bolt, ShieldCheck, Trophy, Users } from "lucide-react";

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  note: string;
  progress: string;
  tone?: "indigo" | "blue" | "purple" | "green";
};

function MetricCard({
  icon,
  label,
  value,
  change,
  note,
  progress,
  tone = "indigo",
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <div className={`metric-icon ${tone}`}>{icon}</div>
      </div>
      <div className="metric-value">
        <strong>{value}</strong>
        <span>
          <span aria-hidden="true">↑</span> {change}
        </span>
      </div>
      <p>{note}</p>
      <div className="progress-track">
        <i className={`${tone}-fill`} style={{ width: progress }} />
      </div>
    </article>
  );
}

export function OverviewMetrics() {
  return (
    <section className="metric-grid" aria-label="Lead metrics">
      <MetricCard
        icon={<Users size={20} />}
        label="Total Captured Leads"
        value="4,892"
        change="18.4%"
        note="Total captured through 8 active forms"
        progress="78%"
      />
      <MetricCard
        icon={<Bolt size={20} />}
        label="New Leads"
        value="342"
        change="12.1%"
        note="Unreviewed in the last 48 hours"
        progress="42%"
        tone="blue"
      />
      <MetricCard
        icon={<ShieldCheck size={20} />}
        label="Qualified Leads"
        value="1,280"
        change="24.8%"
        note="Score ≥ 75 or high buyer intent"
        progress="64%"
        tone="purple"
      />
      <MetricCard
        icon={<Trophy size={20} />}
        label="Converted Leads"
        value="614"
        change="12.5%"
        note="$284,500 pipeline ARR value"
        progress="55%"
        tone="green"
      />
    </section>
  );
}

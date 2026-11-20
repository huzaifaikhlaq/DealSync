import type { DashboardRange, DashboardLeadStatus } from "../types/dashboard";

const statuses: Array<{
  key: DashboardLeadStatus;
  color: string;
  label: string;
}> = [
  { key: "NEW", color: "mint", label: "New" },
  { key: "CONTACTED", color: "indigo", label: "Contacted" },
  { key: "CLOSED", color: "emerald", label: "Closed" },
];

function periodLabel(range: DashboardRange): string {
  return `Last ${range.slice(0, -1)} days`;
}

export function StatusDistribution({
  counts,
  range,
}: {
  counts: Record<DashboardLeadStatus, number>;
  range: DashboardRange;
}) {
  const total = statuses.reduce((sum, status) => sum + counts[status.key], 0);
  let stop = 0;
  const stops = statuses.map((status) => {
    const start = stop;
    stop += total === 0 ? 0 : (counts[status.key] / total) * 100;
    return `${status.color === "mint" ? "#62d7a8" : status.color === "indigo" ? "#5145e8" : "#007c56"} ${start}% ${stop}%`;
  });
  const background =
    total === 0 ? "#edf0f7" : `conic-gradient(${stops.join(", ")})`;

  return (
    <section className="panel status-panel">
      <div className="panel-heading">
        <div>
          <h2>Lead Status Distribution</h2>
          <p>{periodLabel(range)}</p>
        </div>
      </div>
      <div className="donut-area">
        <div
          className="donut"
          style={{ background }}
          role="img"
          aria-label={statuses
            .map((status) => `${status.label}: ${counts[status.key]}`)
            .join(", ")}
        >
          <div className="donut-center">
            <span>Total Leads</span>
            <strong>{total.toLocaleString("en-US")}</strong>
            <small>{periodLabel(range)}</small>
          </div>
        </div>
      </div>
      <div className="status-legend">
        {statuses.map((status) => {
          const count = counts[status.key];
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);

          return (
            <div className="status-row" key={status.key}>
              <span>
                <i className={`dot ${status.color}`} />
                {status.label}
              </span>
              <strong>{count.toLocaleString("en-US")}</strong>
              <b>{percent}%</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}

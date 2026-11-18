import { Check, MoreHorizontal } from "lucide-react";

const statuses = [
  { color: "emerald", label: "Converted", count: "614", percent: "12.5%" },
  {
    color: "indigo-dark",
    label: "Qualified",
    count: "1,280",
    percent: "26.2%",
  },
  { color: "indigo", label: "In Progress", count: "1,420", percent: "29.0%" },
  {
    color: "blue-pale",
    label: "Attempted Contact",
    count: "1,236",
    percent: "25.3%",
  },
  { color: "mint", label: "New / Unreviewed", count: "342", percent: "7.0%" },
];

export function StatusDistribution() {
  return (
    <section className="panel status-panel">
      <div className="panel-heading">
        <div>
          <h2>Status Distribution</h2>
          <p>Where your pipeline stands</p>
        </div>
        <button
          className="icon-button small-icon"
          type="button"
          aria-label="More status options"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="donut-area">
        <div className="donut" role="img" aria-label="Lead status distribution">
          <div className="donut-center">
            <span>Total Leads</span>
            <strong>4,892</strong>
            <small>
              <Check size={13} />
              100% Synced
            </small>
          </div>
        </div>
      </div>
      <div className="status-legend">
        {statuses.map(({ color, label, count, percent }) => (
          <div className="status-row" key={label}>
            <span>
              <i className={`dot ${color}`} />
              {label}
            </span>
            <strong>{count}</strong>
            <b>{percent}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

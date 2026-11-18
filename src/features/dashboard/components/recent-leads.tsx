import { ArrowRight, FileText, Filter } from "lucide-react";
import { dashboardLeads } from "../data/overview-data";

export function RecentLeads({
  query,
  onAction,
}: {
  query: string;
  onAction: (message: string) => void;
}) {
  const leads = dashboardLeads.filter((lead) =>
    `${lead.name} ${lead.company} ${lead.form} ${lead.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <section className="panel leads-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Incoming Leads</h2>
          <p>Real-time incoming submissions enriched with firmographics</p>
        </div>
        <div className="lead-tools">
          <button
            className="icon-button small-icon"
            type="button"
            aria-label="Filter leads"
            onClick={() => onAction("Use the search field to filter leads")}
          >
            <Filter size={17} />
          </button>
          <button
            className="text-link"
            type="button"
            onClick={() => onAction("Opening all leads")}
          >
            View all (4,892)
          </button>
        </div>
      </div>
      <div className="table-scroll">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead Contact</th>
              <th>Source Form</th>
              <th>Score</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.name}>
                <td>
                  <div className="lead-person">
                    <div className={`avatar ${lead.color}`}>
                      {lead.initials}
                    </div>
                    <span>
                      <strong>{lead.name}</strong>
                      <small>
                        {lead.role}, {lead.company}
                      </small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="form-source">
                    <FileText size={14} />
                    {lead.form}
                  </span>
                </td>
                <td>
                  <span
                    className={`score ${lead.score >= 85 ? "high-score" : ""}`}
                  >
                    {lead.score}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-chip ${lead.status.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    <i />
                    {lead.status}
                  </span>
                </td>
                <td className="timestamp">{lead.time}</td>
                <td>
                  <button
                    className="row-action"
                    type="button"
                    aria-label={`Open ${lead.name}`}
                    onClick={() => onAction(`Lead profile: ${lead.name}`)}
                  >
                    <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">
                  No leads match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

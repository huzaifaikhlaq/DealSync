import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import type { DashboardRange, DashboardRecentLead } from "../types/dashboard";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function RecentLeads({
  leads,
  query,
  range,
}: {
  leads: DashboardRecentLead[];
  query: string;
  range: DashboardRange;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleLeads = leads.filter((lead) =>
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.role,
      lead.domain,
      lead.formName,
      lead.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <section className="panel leads-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Leads</h2>
          <p>
            Latest submissions from your forms in the last {range.slice(0, -1)}{" "}
            days.
          </p>
        </div>
        <Link className="text-link" href="/dashboard/leads">
          View all leads <ArrowRight size={16} />
        </Link>
      </div>
      {visibleLeads.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>
            {leads.length === 0
              ? "No submissions in this period."
              : `No recent leads match “${query}”.`}
          </p>
          {leads.length === 0 && (
            <Link className="text-link" href="/dashboard/forms">
              Manage forms <ArrowRight size={16} />
            </Link>
          )}
        </div>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-label="Recent submissions"
          tabIndex={0}
        >
          <table className="leads-table">
            <caption className="sr-only">Recent lead submissions</caption>
            <thead>
              <tr>
                <th scope="col">Lead Contact</th>
                <th scope="col">Source Form</th>
                <th scope="col">Status</th>
                <th scope="col">Submitted</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead, index) => {
                const initials = lead.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0] ?? "")
                  .join("")
                  .toUpperCase();
                const contactDetail =
                  lead.email && lead.email !== lead.name
                    ? lead.email
                    : lead.phone && lead.phone !== lead.name
                      ? lead.phone
                      : lead.company || "Contact details not provided";
                const avatarColor = ["lilac", "blue", "peach"][index % 3];

                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-person">
                        <div className={`avatar ${avatarColor}`}>
                          {initials}
                        </div>
                        <span>
                          <strong>{lead.name}</strong>
                          <small>{contactDetail}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="form-source">
                        <FileText size={14} aria-hidden="true" />
                        {lead.formName}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-chip ${lead.status.toLowerCase()}`}
                      >
                        <i />
                        {lead.status[0] + lead.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="timestamp">
                      <time dateTime={lead.createdAt}>
                        {dateFormatter.format(new Date(lead.createdAt))} UTC
                      </time>
                    </td>
                    <td>
                      <Link
                        className="row-action"
                        href={`/dashboard/leads?leadId=${encodeURIComponent(lead.id)}`}
                        aria-label={`View ${lead.name}`}
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

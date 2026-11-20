import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { DashboardForm, DashboardRange } from "../types/dashboard";

function statusLabel(status: DashboardForm["status"]): string {
  if (status === "ACTIVE") return "Active";
  if (status === "ARCHIVED") return "Archived";
  return "Draft";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function TopPerformingForms({
  forms,
  range,
}: {
  forms: DashboardForm[];
  range: DashboardRange;
}) {
  const visibleForms = forms.slice(0, 4);

  return (
    <section className="panel forms-panel">
      <div className="panel-heading">
        <div>
          <h2>Your Forms</h2>
          <p>
            Submission counts from the last {range.slice(0, -1)} days, sorted by
            volume.
          </p>
        </div>
        <Link className="text-link" href="/dashboard/forms">
          Manage forms <ArrowRight size={16} />
        </Link>
      </div>
      {forms.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>You haven&apos;t created any forms yet.</p>
          <Link className="text-link" href="/dashboard/forms?create=1">
            Create your first form <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="forms-grid">
            {visibleForms.map((form) => (
              <article className="form-card" key={form.id}>
                <div className="form-meta">
                  <span
                    className={`overview-form-status ${form.status.toLowerCase()}`}
                  >
                    <i />
                    {statusLabel(form.status)}
                  </span>
                  <span>Created {formatDate(form.createdAt)} UTC</span>
                </div>
                <h3 title={form.name}>{form.name}</h3>
                <p>
                  {form.submissionCount.toLocaleString("en-US")} submissions
                </p>
              </article>
            ))}
          </div>
          {forms.length > visibleForms.length && (
            <p className="forms-overview-note">
              Showing the four forms with the most submissions in this period.
            </p>
          )}
        </>
      )}
    </section>
  );
}

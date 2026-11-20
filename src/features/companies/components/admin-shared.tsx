import type { LucideIcon } from "lucide-react";
import type { CompanyAccessStatus } from "../types/company-admin";

export function AdminMetricGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone?: "purple" | "blue" | "green" | "amber" | "red";
  }>;
}) {
  return (
    <section className="admin-metric-grid" aria-label="Platform metrics">
      {items.map(({ label, value, description, icon: Icon, tone = "purple" }) => (
        <article className="admin-metric-card" key={label}>
          <div className="admin-metric-heading">
            <span>{label}</span>
            <span className={"admin-metric-icon " + tone}>
              <Icon size={18} aria-hidden="true" />
            </span>
          </div>
          <strong>{value.toLocaleString()}</strong>
          <p>{description}</p>
        </article>
      ))}
    </section>
  );
}

const accessStatusLabels: Record<CompanyAccessStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  NOT_REQUESTED: "Not requested",
};

export function AccessStatusBadge({
  status,
}: {
  status: CompanyAccessStatus;
}) {
  return (
    <span className={"admin-status " + status.toLowerCase().replaceAll("_", "-")}>
      {accessStatusLabels[status]}
    </span>
  );
}

export function FormStatusBadge({
  status,
}: {
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}) {
  return (
    <span className={"admin-status form-" + status.toLowerCase()}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function LeadStatusBadge({
  status,
}: {
  status: "NEW" | "CONTACTED" | "CLOSED";
}) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span className={"admin-status lead-" + status.toLowerCase()}>{label}</span>
  );
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
  label,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
}) {
  return (
    <nav className="admin-pagination" aria-label={label}>
      <span>
        Page {page} of {totalPages}
      </span>
      <div>
        <button
          type="button"
          className="admin-button secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="admin-button secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AdminLoading({ label }: { label: string }) {
  return (
    <div className="admin-state" role="status">
      <span className="admin-loader" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="admin-error" role="alert">
      {message}
    </div>
  );
}

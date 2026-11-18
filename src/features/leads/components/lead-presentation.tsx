import { ArrowRight, Bolt, Eye } from "lucide-react";
import type { ReactNode } from "react";
import type { Lead } from "../types/lead.types";

export function LeadMetric({
  label,
  value,
  note,
  icon,
  change,
  purple = false,
  green = false,
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  change: string;
  purple?: boolean;
  green?: boolean;
}) {
  return (
    <article className="metric-card lead-metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <div
          className={`metric-icon ${green ? "green" : purple ? "purple" : ""}`}
        >
          {icon}
        </div>
      </div>
      <div className="lead-metric-value">
        <strong>{value}</strong>
        <span className={green ? "green-text" : purple ? "purple-text" : ""}>
          {purple && <Bolt size={13} />}{" "}
          {!purple && !green && <ArrowRight size={13} />} {change}
        </span>
      </div>
      <p>{note}</p>
    </article>
  );
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`full-status ${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      <i />
      {status}
    </span>
  );
}
export function LeadCard({
  lead,
  selected,
  toggle,
  onOpen,
}: {
  lead: Lead;
  selected: boolean;
  toggle: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="panel lead-card">
      <div className="lead-card-top">
        <input
          type="checkbox"
          aria-label={`Select ${lead.name}`}
          checked={selected}
          onChange={toggle}
        />
        <StatusBadge status={lead.status} />
      </div>
      <div className="full-lead-person">
        <div className={`avatar lead-avatar ${lead.color}`}>
          {lead.initials}
        </div>
        <span>
          <strong>{lead.name}</strong>
          <small>{lead.role}</small>
          <a href={`mailto:${lead.email}`}>{lead.email}</a>
        </span>
      </div>
      <div className="lead-card-company">
        <strong>{lead.company}</strong>
        <small>{lead.domain}</small>
      </div>
      <span className="source-pill">
        <i />
        {lead.form}
      </span>
      <div className="lead-card-bottom">
        <span>{lead.submitted}</span>
        <button onClick={onOpen}>
          <Eye size={16} /> View lead
        </button>
      </div>
    </article>
  );
}

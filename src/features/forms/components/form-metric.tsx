import type { ReactNode } from "react";

export function FormMetric({
  label,
  value,
  note,
  icon,
  purple = false,
  green = false,
}: {
  label: string;
  value: string;
  note: ReactNode;
  icon: ReactNode;
  purple?: boolean;
  green?: boolean;
}) {
  return (
    <article className="metric-card form-metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <div
          className={`metric-icon ${green ? "green" : purple ? "purple" : ""}`}
        >
          {icon}
        </div>
      </div>
      <strong className="form-metric-value">{value}</strong>
      <div className="form-metric-note">{note}</div>
    </article>
  );
}

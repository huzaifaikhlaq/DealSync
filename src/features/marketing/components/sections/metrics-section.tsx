const metrics = [
  { value: "99.98%", label: "Form ingestion uptime", accent: true },
  { value: "< 200ms", label: "Average webhook delivery" },
  { value: "4.2×", label: "Pipeline velocity increase", accent: true },
  { value: "14M+", label: "Leads processed safely" },
];

export function MetricsSection() {
  return (
    <section className="metrics-section" aria-label="DealSync platform metrics">
      <ul className="metrics-grid content-width">
        {metrics.map(({ value, label, accent }) => (
          <li className="metric-item" key={label}>
            <strong className={accent ? "metric-value accent" : "metric-value"}>
              {value}
            </strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

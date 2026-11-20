import Link from "next/link";

import type {
  DashboardGranularity,
  DashboardRange,
  DashboardTrendPoint,
} from "../types/dashboard";

const groupings: Array<{ value: DashboardGranularity; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function periodLabel(range: DashboardRange): string {
  return `the last ${range.slice(0, -1)} days`;
}

function formatBucket(bucket: string, granularity: DashboardGranularity) {
  const date = new Date(bucket);
  return new Intl.DateTimeFormat("en-US", {
    ...(granularity === "monthly"
      ? { month: "short", year: "numeric" }
      : { month: "short", day: "numeric" }),
    timeZone: "UTC",
  }).format(date);
}

export function LeadsTrendChart({
  points,
  range,
  granularity,
}: {
  points: DashboardTrendPoint[];
  range: DashboardRange;
  granularity: DashboardGranularity;
}) {
  const maxCount = Math.max(0, ...points.map((point) => point.count));
  const axisMax = maxCount === 0 ? 1 : Math.ceil(maxCount / 4) * 4;
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: points.length < 2 ? 360 : (index / (points.length - 1)) * 720,
    y: 228 - (point.count / axisMax) * 208,
  }));
  const linePath = chartPoints
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
    )
    .join(" ");
  const areaPath = chartPoints.length ? `${linePath} L720,238 L0,238 Z` : "";
  const tickValues = Array.from({ length: 5 }, (_, index) =>
    Math.round(axisMax - (axisMax * index) / 4),
  );
  const labelIndexes = Array.from(
    new Set(
      Array.from({ length: Math.min(5, points.length) }, (_, index) =>
        Math.round(
          (index * (points.length - 1)) /
            Math.max(1, Math.min(5, points.length) - 1),
        ),
      ),
    ),
  );
  const empty = points.every((point) => point.count === 0);

  return (
    <section className="panel trend-panel">
      <div className="panel-heading">
        <div>
          <h2>Leads Captured Over Time</h2>
          <p>
            Submissions during {periodLabel(range)}, grouped by {granularity}.
          </p>
        </div>
        <nav className="segmented" aria-label="Chart grouping">
          {groupings.map((item) => (
            <Link
              key={item.value}
              href={`/dashboard?range=${range}&granularity=${item.value}`}
              className={granularity === item.value ? "active" : ""}
              aria-current={granularity === item.value ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {empty && <p className="chart-empty">No submissions in this period.</p>}
      <div className="chart-wrap">
        <div className="chart-y-labels" aria-hidden="true">
          {tickValues.map((value, index) => (
            <span key={index}>{value.toLocaleString("en-US")}</span>
          ))}
        </div>
        <svg
          className="trend-chart"
          viewBox="0 0 720 250"
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="leads-trend-title leads-trend-description"
        >
          <title id="leads-trend-title">Lead submissions over time</title>
          <desc id="leads-trend-description">
            {granularity} submission counts for {periodLabel(range)}.
          </desc>
          <defs>
            <linearGradient id="leads-area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5145e8" stopOpacity=".24" />
              <stop offset="100%" stopColor="#5145e8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="gridline"
            d="M0 20H720 M0 72H720 M0 124H720 M0 176H720 M0 228H720"
          />
          {areaPath && <path className="area" d={areaPath} />}
          {linePath && <path className="line" d={linePath} />}
        </svg>
      </div>
      <div className="chart-x-labels" aria-hidden="true">
        {labelIndexes.map((index) => (
          <span key={points[index]?.bucket}>
            {points[index]
              ? formatBucket(points[index].bucket, granularity)
              : ""}
          </span>
        ))}
      </div>
      <ul className="sr-only" aria-label="Submission counts by period">
        {points.map((point) => (
          <li key={point.bucket}>
            {formatBucket(point.bucket, granularity)}:{" "}
            {point.count.toLocaleString("en-US")} submissions
          </li>
        ))}
      </ul>
    </section>
  );
}

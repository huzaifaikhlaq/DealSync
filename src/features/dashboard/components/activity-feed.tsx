import { Activity, Check, FileText, Plus } from "lucide-react";
import type { ReactNode } from "react";

type ActivityEntry = {
  kind: string;
  title: string;
  detail: ReactNode;
  time: string;
};
const entries: ActivityEntry[] = [
  {
    kind: "submission",
    title: "New form submission",
    detail: (
      <>
        Enterprise Demo by <strong>Sophia Chen</strong> (Stripe)
      </>
    ),
    time: "12 minutes ago",
  },
  {
    kind: "success",
    title: "Status updated to Qualified",
    detail: (
      <>
        Auto-scored ≥ 85 threshold for <strong>Liam G.</strong>
      </>
    ),
    time: "34 minutes ago",
  },
  {
    kind: "note",
    title: "Note added by Sarah J.",
    detail: (
      <em>“Customer requested custom pricing for 500+ seat deployment.”</em>
    ),
    time: "48 minutes ago",
  },
  {
    kind: "sync",
    title: "Webhook sync to Salesforce",
    detail: "3 lead records pushed with zero mapping errors",
    time: "1 hour ago",
  },
];

function ActivityItem({ kind, title, detail, time }: ActivityEntry) {
  const Icon =
    kind === "success"
      ? Check
      : kind === "note"
        ? FileText
        : kind === "sync"
          ? Activity
          : Plus;
  return (
    <article className={`timeline-item ${kind}`}>
      <span className="timeline-icon">
        <Icon size={13} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
        <time>{time}</time>
      </div>
    </article>
  );
}

export function ActivityFeed() {
  return (
    <section className="panel activity-panel">
      <div className="panel-heading">
        <div className="activity-title">
          <h2>Live Activity</h2>
          <i />
        </div>
        <span className="realtime">Real-time</span>
      </div>
      <div className="timeline">
        {entries.map((entry) => (
          <ActivityItem key={entry.title} {...entry} />
        ))}
      </div>
    </section>
  );
}

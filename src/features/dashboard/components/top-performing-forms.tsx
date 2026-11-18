import { ArrowRight } from "lucide-react";
import { performingForms } from "../data/overview-data";

export function TopPerformingForms({ onManage }: { onManage: () => void }) {
  return (
    <section className="panel forms-panel">
      <div className="panel-heading">
        <div>
          <h2>Top Performing Forms</h2>
          <p>
            Forms driving the highest submission volume and qualified pipeline
            conversion
          </p>
        </div>
        <button className="text-link" type="button" onClick={onManage}>
          Manage all forms <ArrowRight size={16} />
        </button>
      </div>
      <div className="forms-grid">
        {performingForms.map((form) => (
          <article className="form-card" key={form.title}>
            <div className="form-meta">
              <span className="active-tag">
                <i />
                Active
              </span>
              <span className={form.best ? "best-tag" : ""}>{form.tag}</span>
            </div>
            <h3>{form.title}</h3>
            <p>{form.detail}</p>
            <div className="form-stats">
              <strong>
                {form.count} <small>subs</small>
              </strong>
              <b className={form.best ? "best-tag" : ""}>{form.rate} conv.</b>
            </div>
            <div className="progress-track">
              <i
                className={form.best ? "green-fill" : ""}
                style={{ width: form.bar }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

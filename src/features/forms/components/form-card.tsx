import {
  Code2,
  Copy,
  Eye,
  FilePlus2,
  Link2,
  MoreHorizontal,
  TrendingUp,
  Upload,
} from "lucide-react";
import type { FormRecord } from "../types/form.types";

export function FormCard({
  form,
  menuOpen,
  onMenu,
  onToggle,
  onCopy,
  onAction,
}: {
  form: FormRecord;
  menuOpen: boolean;
  onMenu: () => void;
  onToggle: () => void;
  onCopy: () => void;
  onAction: (message: string) => void;
}) {
  const active = form.status === "Active";
  const draft = form.status.startsWith("Draft");
  const archived = form.status === "Archived";
  return (
    <article
      className={`form-list-card ${archived ? "archived-form" : ""} ${draft ? "draft-form" : ""}`}
    >
      <div className="form-card-meta">
        <span
          className={`form-status ${active ? "active" : draft ? "draft" : "archived"}`}
        >
          <i />
          {form.status}
        </span>
        <span>Created {form.date}</span>
        <div className="form-menu-wrap">
          <button
            className="form-menu-trigger"
            aria-label={`Options for ${form.title}`}
            aria-expanded={menuOpen}
            onClick={onMenu}
          >
            <MoreHorizontal size={19} />
          </button>
          {menuOpen && (
            <div className="form-menu">
              <button onClick={onToggle}>
                {active
                  ? "Archive form"
                  : archived
                    ? "Restore form"
                    : "Publish form"}
              </button>
              <button onClick={onCopy}>Copy form link</button>
              <button onClick={() => onAction(`Editing ${form.title}`)}>
                Edit details
              </button>
            </div>
          )}
        </div>
      </div>
      <h2>{form.title}</h2>
      <button className="form-url" onClick={onCopy} disabled={archived}>
        <Link2 size={16} />
        <span>/v1/forms/{form.publicId}/submissions</span>
        {archived ? (
          <span className="url-lock">Archived</span>
        ) : (
          <Copy size={15} />
        )}
      </button>
      <div className="form-performance">
        <div>
          <span>Submissions</span>
          <strong>{form.submissions}</strong>
          <small className={draft ? "not-live" : ""}>
            <ClockIcon />
            {form.last}
          </small>
        </div>
        <div>
          <span>Conversion</span>
          <strong>{form.conversion}</strong>
          <div className="form-rate-track">
            <i
              className={
                form.variant === "best"
                  ? "best-rate"
                  : archived
                    ? "archived-rate"
                    : ""
              }
              style={{
                width:
                  form.conversion === "—"
                    ? "0%"
                    : `${Math.min(parseFloat(form.conversion) * 4.3, 98)}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="form-tags">
        {form.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="form-card-actions">
        {active ? (
          <>
            <button
              onClick={() => onAction(`Embed instructions for ${form.title}`)}
            >
              <Code2 size={15} />
              Embed
            </button>
            <button onClick={() => onAction(`Previewing ${form.title}`)}>
              <Eye size={15} />
              Preview
            </button>
            <button
              className="edit-studio"
              onClick={() => onAction(`Opening ${form.title} in Studio`)}
            >
              <FilePlus2 size={15} />
              Edit in Studio
            </button>
          </>
        ) : draft ? (
          <>
            <button onClick={() => onAction(`Previewing ${form.title}`)}>
              <Eye size={15} />
              Preview
            </button>
            <button className="publish-form" onClick={onToggle}>
              <Upload size={15} />
              Publish
            </button>
            <button onClick={() => onAction(`Continue editing ${form.title}`)}>
              Continue Editing
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onAction(`Analytics for ${form.title}`)}>
              <TrendingUp size={15} />
              View Analytics
            </button>
            <button onClick={onToggle}>
              <Upload size={15} />
              Restore
            </button>
          </>
        )}
      </div>
    </article>
  );
}
function ClockIcon() {
  return (
    <svg className="clock-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.5v3.8l2.5 1.4" />
    </svg>
  );
}

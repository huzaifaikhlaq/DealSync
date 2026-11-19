
import {
  Code2,
  Copy,
  FilePenLine,
  Link2,
  MoreHorizontal,
  Settings2,
  Upload,
} from "lucide-react";

import type { FormRecord } from "../types/form.types";

type FormCardProps = {
  form: FormRecord;
  menuOpen: boolean;
  busy?: boolean;
  onMenu: () => void;
  onToggle: () => void;
  onCopy: () => void;
  onRename: () => void;
  onConfigure: () => void;
};

export function FormCard({
  form,
  menuOpen,
  busy = false,
  onMenu,
  onToggle,
  onCopy,
  onRename,
  onConfigure,
}: FormCardProps) {
  const active = form.status === "Active";
  const draft = form.status.startsWith("Draft");
  const archived = form.status === "Archived";

  const actionLabel = active
    ? "Archive form"
    : archived
      ? "Restore form"
      : "Publish form";

  return (
    <article
      className={`form-list-card ${archived ? "archived-form" : ""
        } ${draft ? "draft-form" : ""}`}
    >
      <div className="form-card-meta">
        <span
          className={`form-status ${active ? "active" : draft ? "draft" : "archived"
            }`}
        >
          <i />
          {form.status}
        </span>

        <span>Created {form.date}</span>

        <div className="form-menu-wrap">
          <button
            type="button"
            className="form-menu-trigger"
            aria-label={`Options for ${form.title}`}
            aria-expanded={menuOpen}
            onClick={onMenu}
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <div className="form-menu">
              <button
                type="button"
                disabled={busy}
                onClick={onToggle}
              >
                {actionLabel}
              </button>

              <button
                type="button"
                onClick={onCopy}
              >
                Copy endpoint
              </button>

              <button
                type="button"
                onClick={onRename}
              >
                Rename form
              </button>

              <button
                type="button"
                onClick={onConfigure}
              >
                Allowed origins
              </button>
            </div>
          )}
        </div>
      </div>

      <h2>{form.title}</h2>

      <button
        type="button"
        className="form-url"
        onClick={onCopy}
      >
        <Link2 size={16} />
        <span>
          /v1/forms/{form.publicId}/submissions
        </span>
        <Copy size={15} />
      </button>

      <div className="form-performance">
        <div>
          <span>Submissions</span>
          <strong>{form.submissions}</strong>
          <small>{form.last}</small>
        </div>

        <div>
          <span>Conversion</span>
          <strong>—</strong>
          <div className="form-rate-track">
            <i style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      <div className="form-tags">
        {form.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="form-card-actions">
        <button
          type="button"
          onClick={onCopy}
        >
          <Code2 size={15} />
          Copy API Endpoint
        </button>

        <button
          type="button"
          onClick={onRename}
        >
          <FilePenLine size={15} />
          Rename
        </button>

        <button
          type="button"
          onClick={onConfigure}
        >
          <Settings2 size={15} />
          Origins
        </button>

        <button
          type="button"
          className={draft ? "publish-form" : ""}
          disabled={busy}
          onClick={onToggle}
        >
          <Upload size={15} />
          {actionLabel}
        </button>
      </div>
    </article>
  );
}

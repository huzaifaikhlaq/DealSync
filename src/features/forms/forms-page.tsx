
"use client";

import "./forms.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  FilePlus2,
  Grid2X2,
  List,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";

import {
  useDashboardNewAction,
  useDashboardSearch,
} from "@/components/layout/dashboard/dashboard-context";

import { apiRequest, jsonBody } from "@/lib/http/client";
import { getPageCount, getPageItems } from
  "@/lib/utils/pagination";

import {
  toFormRecord,
  type FormDTO,
} from "./client/form-api";

import { FormCard } from "./components/form-card";
import { FormMetric } from "./components/form-metric";

import {
  countFormStatuses,
  filterAndSortForms,
} from "./utils/forms";

import type { FormRecord } from "./types/form.types";

export function FormsPage() {
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyFormId, setBusyFormId] = useState<string | null>(
    null,
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [layout, setLayout] = useState<"grid" | "list">(
    "grid",
  );
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [notice, setNotice] = useState("");
  const [openMenu, setOpenMenu] = useState<
    string | number | null
  >(null);

  const dashboardSearch = useDashboardSearch();

  const openCreateForm = useCallback(() => {
    setCreateOpen(true);
  }, []);

  useDashboardNewAction(openCreateForm);

  const loadForms = useCallback(async () => {
    try {
      const records = await apiRequest<FormDTO[]>(
        "/api/forms",
      );

      setForms(records.map(toFormRecord));
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Failed to load forms",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadForms();
  }, [loadForms]);

  const filtered = useMemo(
    () =>
      filterAndSortForms(forms, {
        query: `${query} ${dashboardSearch}`,
        status,
        category: "all",
        sort,
      }),
    [forms, query, dashboardSearch, status, sort],
  );

  const pageSize = 6;
  const pageCount = getPageCount(
    filtered.length,
    pageSize,
  );
  const visibleForms = getPageItems(
    filtered,
    page,
    pageSize,
  );

  const {
    active: activeCount,
    draft: draftCount,
    archived: archivedCount,
  } = countFormStatuses(forms);

  const totalSubmissions = forms.reduce(
    (sum, form) =>
      sum + Number(form.submissions.replaceAll(",", "")),
    0,
  );

  function showNotice(message: string) {
    setNotice(message);
  }

  async function copyEndpoint(form: FormRecord) {
    if (!form.publicId) return;

    const endpoint =
      `${window.location.origin}/v1/forms/` +
      `${form.publicId}/submissions`;

    try {
      await navigator.clipboard.writeText(endpoint);
      showNotice("Submission endpoint copied");
    } catch {
      showNotice("Unable to access clipboard");
    }
  }

  async function createForm(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (busy) return;
    setBusy(true);

    try {
      await apiRequest<FormDTO>(
        "/api/forms",
        jsonBody("POST", {
          name: formName.trim(),
        }),
      );

      await loadForms();

      setFormName("");
      setCreateOpen(false);
      setPage(1);
      setStatus("all");
      setQuery("");

      showNotice("Form created as a draft");
    } catch (error) {
      showNotice(
        error instanceof Error
          ? error.message
          : "Failed to create form",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateForm(
    form: FormRecord,
    changes: Record<string, unknown>,
  ) {
    setBusyFormId(String(form.id));

    try {
      await apiRequest(
        `/api/forms/${form.id}`,
        jsonBody("PATCH", changes),
      );

      await loadForms();
      setOpenMenu(null);

      showNotice("Form updated");
    } catch (error) {
      showNotice(
        error instanceof Error
          ? error.message
          : "Failed to update form",
      );
    } finally {
      setBusyFormId(null);
    }
  }

  async function toggleStatus(form: FormRecord) {
    const nextStatus =
      form.status === "Active"
        ? "ARCHIVED"
        : "ACTIVE";

    await updateForm(form, {
      status: nextStatus,
    });
  }

  async function renameForm(form: FormRecord) {
    const name = window.prompt(
      "Rename form",
      form.title,
    );

    if (name === null) return;

    const trimmed = name.trim();

    if (!trimmed || trimmed === form.title) return;

    await updateForm(form, {
      name: trimmed,
    });
  }

  async function configureOrigins(form: FormRecord) {
    const current = (form.allowedOrigins ?? []).join(
      "\n",
    );

    const answer = window.prompt(
      "Allowed website origins (one per line)",
      current,
    );

    if (answer === null) return;

    const allowedOrigins = [
      ...new Set(
        answer
          .split(/\r?\n/)
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];

    await updateForm(form, {
      allowedOrigins,
    });
  }

  return (
    <div className="dashboard-page forms-content">
      <section className="forms-titlebar">
        <div>
          <div className="forms-title">
            <h1>Forms</h1>
            <span className="form-count-pill">
              <i />
              {activeCount} active forms
            </span>
          </div>

          <p>
            Create and manage API forms for your
            website's lead collection.
          </p>
        </div>

        <div className="forms-ctas">
          <button
            type="button"
            className="primary-button"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Create Form
          </button>
        </div>
      </section>

      <section className="metric-grid forms-metrics">
        <FormMetric
          label="Total Forms"
          value={String(forms.length)}
          note="Forms in your account"
          icon={<ClipboardList size={19} />}
        />

        <FormMetric
          label="Total Submissions"
          value={totalSubmissions.toLocaleString()}
          note="All recorded submissions"
          icon={<FilePlus2 size={19} />}
          purple
        />

        <FormMetric
          label="Active Forms"
          value={String(activeCount)}
          note="Accepting visitor submissions"
          icon={<Check size={19} />}
          green
        />

        <FormMetric
          label="Unpublished Forms"
          value={String(draftCount)}
          note={`${archivedCount} archived forms`}
          icon={<ClipboardList size={19} />}
        />
      </section>

      <section className="embed-banner">
        <div className="embed-copy">
          <div className="embed-bolt">
            <Copy size={22} />
          </div>

          <div>
            <h2>Connect your existing website form</h2>
            <p>
              Create a form, publish it, and copy its unique
              submission endpoint to your website.
            </p>
          </div>
        </div>
      </section>

      <section className="form-toolbar panel">
        <div className="form-toolbar-left">
          <label className="form-search">
            <Search size={18} />

            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search forms..."
              aria-label="Search forms"
            />
          </label>

          <label className="form-select">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter forms by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">
                Active ({activeCount})
              </option>
              <option value="draft">
                Draft ({draftCount})
              </option>
              <option value="archived">
                Archived ({archivedCount})
              </option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="form-toolbar-right">
          <label className="form-select sort-select">
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              aria-label="Sort forms"
            >
              <option value="recent">Recently created</option>
              <option value="name">Name A-Z</option>
              <option value="submissions">
                Most submissions
              </option>
            </select>

            <List size={16} />
          </label>

          <div
            className="form-layout-toggle"
            role="group"
            aria-label="Form layout"
          >
            <button
              type="button"
              className={layout === "grid" ? "active" : ""}
              aria-label="Grid view"
              onClick={() => setLayout("grid")}
            >
              <Grid2X2 size={17} />
            </button>

            <button
              type="button"
              className={layout === "list" ? "active" : ""}
              aria-label="List view"
              onClick={() => setLayout("list")}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </section>

      {loading && (
        <p role="status" className="p-4">
          Loading forms...
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="p-6 text-sm text-[#55586c]">
          No forms match your filters.
        </p>
      )}

      <section
        className={`forms-grid-list ${layout}`}
        aria-label="Your forms"
      >
        {visibleForms.map((form) => (
          <FormCard
            key={form.id}
            form={form}
            busy={busyFormId === String(form.id)}
            menuOpen={openMenu === form.id}
            onMenu={() =>
              setOpenMenu(
                openMenu === form.id
                  ? null
                  : form.id,
              )
            }
            onToggle={() => void toggleStatus(form)}
            onCopy={() => void copyEndpoint(form)}
            onRename={() => void renameForm(form)}
            onConfigure={() =>
              void configureOrigins(form)
            }
          />
        ))}
      </section>

      <footer className="forms-footer">
        <div>
          Showing{" "}
          <strong>{visibleForms.length}</strong>
          {" "}of{" "}
          <strong>{filtered.length}</strong> forms
        </div>

        <div className="forms-pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage((value) => Math.max(1, value - 1))
            }
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          <span>{page} / {pageCount}</span>

          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() =>
              setPage((value) =>
                Math.min(pageCount, value + 1),
              )
            }
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      </footer>

      {notice && (
        <div className="dash-toast" role="status">
          <Check size={16} />
          {notice}

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {createOpen && (
        <Modal
          id="create-form-title"
          title="Create a form"
          description="Give your form a name. Every form receives its own public ID."
          onClose={() => setCreateOpen(false)}
        >
          <form onSubmit={createForm}>
            <label className="form-name-field">
              Form name
              <input
                required
                autoFocus
                minLength={2}
                maxLength={120}
                value={formName}
                onChange={(event) =>
                  setFormName(event.target.value)
                }
                placeholder="Contact Form"
              />
            </label>

            <div className="lead-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={busy}
              >
                <Plus size={16} />
                {busy ? "Creating..." : "Create draft"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

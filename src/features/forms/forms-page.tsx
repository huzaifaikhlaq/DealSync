"use client";

import "./forms.css";
import { Modal } from "@/components/ui/modal";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { apiRequest, jsonBody } from "@/lib/http/client";
import {
  toFormRecord,
  type FormDTO,
} from "./client/form-api";

import {
  useDashboardNewAction,
  useDashboardSearch,
} from "@/components/layout/dashboard/dashboard-context";
import { seedForms } from "./data/forms";
import type { FormRecord } from "./types/form.types";
import { FormCard } from "./components/form-card";
import { FormMetric } from "./components/form-metric";
import { filterAndSortForms, countFormStatuses } from "./utils/forms";
import { getPageCount, getPageItems } from "@/lib/utils/pagination";
import {
  ArrowDownToLine,
  ArrowRight,
  Bolt,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code2,
  Copy,
  Grid2X2,
  List,
  Plus,
  Search,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";

const sdkSnippet = '<script src="https://cdn.dealsync.io/v2/embed.js" async></script>';
export function FormsPage() {

  const [forms, setForms] = useState<FormRecord[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);

  const loadForms = useCallback(async () => {
    try {
      const records = await apiRequest<FormDTO[]>("/api/forms");
      setForms(records.map(toFormRecord));
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Failed to load forms",
      );
    } finally {
      setLoadingForms(false);
    }
  }, []);

  useEffect(() => {
    void loadForms();
  }, [loadForms]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState(true);
  const [notice, setNotice] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dashboardSearch = useDashboardSearch();
  const openCreateForm = useCallback(() => setCreateOpen(true), []);
  useDashboardNewAction(openCreateForm);
  const filtered = useMemo(
    () =>
      filterAndSortForms(forms, {
        query: `${query} ${dashboardSearch}`,
        status,
        category,
        sort,
      }),
    [forms, query, dashboardSearch, status, category, sort],
  );
  const pageSize = 6;
  const pageCount = getPageCount(filtered.length, pageSize);
  const visible = getPageItems(filtered, page, pageSize);
  const {
    active: activeCount,
    draft: draftCount,
    archived: archivedCount,
  } = countFormStatuses(forms);
  function toast(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }
  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast(message);
    } catch {
      toast("Clipboard access is unavailable in this browser");
    }
  }

  async function createForm(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await apiRequest<FormDTO>(
        "/api/forms",
        jsonBody("POST", {
          name: formName.trim(),
        }),
      );

      await loadForms();

      setStatus("all");
      setCategory("all");
      setQuery("");
      setSort("recent");
      setPage(1);
      setCreateOpen(false);
      setFormName("");

      toast("Form created successfully");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Unable to create form",
      );
    }
  }


  async function toggleStatus(id: string | number) {
    const form = forms.find(
      (item) => item.id === id,
    );

    if (!form) return;

    const nextStatus =
      form.status === "Active"
        ? "ARCHIVED"
        : "ACTIVE";

    try {
      await apiRequest(
        `/api/forms/${id}`,
        jsonBody("PATCH", {
          status: nextStatus,
        }),
      );

      await loadForms();
      setOpenMenu(null);

      toast("Form status updated");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Unable to update form",
      );
    }
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
            Create, manage and embed high-converting lead capture forms across
            your marketing funnels.
          </p>
        </div>
        <div className="forms-ctas">
          <button
            className="secondary-button"
            onClick={() => setImportOpen(true)}
          >
            <ArrowDownToLine size={17} />
            Import Form
          </button>
          <button
            className="secondary-button embed-sdk-button"
            onClick={() => setBanner(true)}
          >
            <Code2 size={17} />
            Embed SDK
          </button>
          <button
            className="primary-button"
            onClick={() => setCreateOpen(true)}
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
          note={
            <>
              <b className="metric-up">＋ 2</b> created this month
            </>
          }
          icon={<ClipboardList size={19} />}
        />
        <FormMetric
          label="Total Submissions"
          value="18,492"
          note={
            <>
              <b className="metric-up">↑ 14.8%</b> vs last 30d
            </>
          }
          icon={<ArrowRight size={19} />}
          purple
        />
        <FormMetric
          label="Avg Conversion Rate"
          value="14.2%"
          note={
            <>
              <b className="top-ten">Top 10%</b> SaaS benchmark
            </>
          }
          icon={<TrendingUp size={19} />}
          green
        />
        <FormMetric
          label="Active Integrations"
          value="98.9% Health"
          note={
            <>
              <i className="operational-dot" />
              Operational · 6 Webhooks
            </>
          }
          icon={<Check size={19} />}
          green
        />
      </section>
      {banner && (
        <section className="embed-banner">
          <div className="embed-copy">
            <div className="embed-bolt">
              <Bolt size={22} />
            </div>
            <div>
              <h2>Universal 1-Line Embed Script</h2>
              <p>
                Embed DealSync forms on Webflow, Framer, React, or WordPress in
                60 seconds with verified spam protection.
              </p>
            </div>
          </div>
          <div className="embed-actions">
            <code>{sdkSnippet}</code>
            <button
              onClick={() =>
                void copy(sdkSnippet, "SDK script copied to clipboard")
              }
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              className="dismiss-banner"
              aria-label="Dismiss embed instructions"
              onClick={() => setBanner(false)}
            >
              <X size={19} />
            </button>
          </div>
        </section>
      )}
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
              placeholder="Search forms by name, route, or tag..."
              aria-label="Search forms"
            />
            <kbd>⌘K</kbd>
          </label>
          <label className="form-select">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses ({forms.length})</option>
              <option value="active">Active ({activeCount})</option>
              <option value="draft">Draft ({draftCount})</option>
              <option value="archived">Archived ({archivedCount})</option>
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="form-select category-select">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="sales">Enterprise Demo</option>
              <option value="contact">Contact &amp; Sales</option>
              <option value="marketing">Webinars &amp; Content</option>
              <option value="waitlist">Waitlist &amp; Viral</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>
        <div className="form-toolbar-right">
          <label className="form-select sort-select">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort forms"
            >
              <option value="recent">Recently updated</option>
              <option value="name">Name A–Z</option>
              <option value="submissions">Most submissions</option>
            </select>
            <List size={16} />
          </label>
          <div
            className="form-layout-toggle"
            role="group"
            aria-label="Form layout"
          >
            <button
              className={layout === "grid" ? "active" : ""}
              aria-label="Grid view"
              onClick={() => setLayout("grid")}
            >
              <Grid2X2 size={17} />
            </button>
            <button
              className={layout === "list" ? "active" : ""}
              aria-label="List view"
              onClick={() => setLayout("list")}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </section>
      <section className={`forms-grid-list ${layout}`} aria-label="Your forms">
        {visible.map((form) => (
          <FormCard
            key={form.id}
            form={form}
            menuOpen={openMenu === form.id}
            onMenu={() => setOpenMenu(openMenu === form.id ? null : form.id)}
            onToggle={() => toggleStatus(form.id)}
            onCopy={() =>
              void copy(
                `${window.location.origin}/v1/forms/${form.publicId}/submissions`,
                "Form submission endpoint copied",
              )
            }

            onAction={(action) => toast(action)}
          />
        ))}
      </section>
      <footer className="forms-footer">
        <div>
          Showing{" "}
          <strong>
            {filtered.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)}
          </strong>{" "}
          of <strong>{filtered.length}</strong> forms <i />{" "}
          <span>
            <b>{activeCount} Active</b>, {draftCount} Drafts, {archivedCount}{" "}
            Archived
          </span>
        </div>
        <div className="forms-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={15} />
            Previous
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1)
            .slice(0, 3)
            .map((number) => (
              <button
                key={number}
                className={page === number ? "current" : ""}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          {pageCount > 3 && <span>…</span>}
          {pageCount > 3 && (
            <button onClick={() => setPage(pageCount)}>{pageCount}</button>
          )}
          <button
            disabled={page === pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
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
          description="Start with a name. You can add fields and styling next."
          onClose={() => setCreateOpen(false)}
        >
          <form onSubmit={createForm}>
            <label className="form-name-field">
              Form name
              <input
                required
                autoFocus
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="e.g. Product demo request"
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
              <button type="submit" className="primary-button">
                <Plus size={16} />
                Create draft
              </button>
            </div>
          </form>
        </Modal>
      )}
      {importOpen && (
        <Modal
          id="import-form-title"
          title="Import a form"
          description="Choose a JSON form definition to add it as an unpublished draft."
          onClose={() => setImportOpen(false)}
        >
          <button
            type="button"
            className="import-dropzone"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={22} />
            <strong>Select a form definition</strong>
            <span>JSON files up to 10 MB</span>
          </button>
          <input
            ref={fileRef}
            className="file-input-hidden"
            type="file"
            accept=".json,application/json"
            onChange={importFile}
          />
          <div className="lead-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setImportOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}


"use client";

import "./leads.css";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowDownToLine,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  FilePlus2,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";

import {
  useDashboardNewAction,
  useDashboardSearch,
} from "@/components/layout/dashboard/dashboard-context";

import { apiRequest, jsonBody } from
  "@/lib/http/client";

import type { Lead } from "./types/lead.types";
import type { FormDTO } from
  "@/features/forms/client/form-api";

import {
  toLeadRecord,
  type LeadListDTO,
} from "./client/lead-api";

import {
  LeadCard,
  LeadMetric,
  StatusBadge,
} from "./components/lead-presentation";

import { createLeadsCsv } from "./utils/leads";

type LeadStatusValue =
  | "NEW"
  | "CONTACTED"
  | "CLOSED";

type LeadRange =
  | "7d"
  | "30d"
  | "90d"
  | "all";

export function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableForms, setAvailableForms] = useState<
    FormDTO[]
  >([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [query, setQuery] = useState("");
  const [formFilter, setFormFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [range, setRange] = useState<LeadRange>("30d");

  const [view, setView] = useState<
    "table" | "compact" | "cards"
  >("table");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [selected, setSelected] = useState<
    Array<string | number>
  >([]);

  const [openedLead, setOpenedLead] = useState<Lead | null>(
    null,
  );

  const dashboardSearch = useDashboardSearch();

  const navigateToForms = useCallback(() => {
    router.push("/dashboard/forms");
  }, [router]);

  useDashboardNewAction(navigateToForms);

  useEffect(() => {
    let active = true;

    apiRequest<FormDTO[]>("/api/forms")
      .then((forms) => {
        if (active) setAvailableForms(forms);
      })
      .catch((error: unknown) => {
        if (active) {
          setNotice(
            error instanceof Error
              ? error.message
              : "Unable to load forms",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pageSize),
          range,
        });

        if (formFilter !== "all") {
          params.set("formId", formFilter);
        }

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        const search = `${query} ${dashboardSearch}`
          .trim()
          .slice(0, 100);

        if (search) {
          params.set("q", search);
        }

        const response = await apiRequest<LeadListDTO>(
          `/api/leads?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (controller.signal.aborted) return;

        setLeads(response.items.map(toLeadRecord));
        setTotal(response.total);
        setSelected([]);
        setLoading(false);
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoading(false);
        setNotice(
          error instanceof Error
            ? error.message
            : "Unable to load leads",
        );
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    page,
    pageSize,
    formFilter,
    statusFilter,
    range,
    query,
    dashboardSearch,
    refreshVersion,
  ]);

  const pageLeads = leads;

  const pageCount = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const firstVisible =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const lastVisible =
    total === 0
      ? 0
      : firstVisible + pageLeads.length - 1;

  const allOnPageSelected =
    pageLeads.length > 0 &&
    pageLeads.every((lead) =>
      selected.includes(lead.id),
    );

  const pageMetrics = {
    new: leads.filter(
      (lead) => lead.status === "New",
    ).length,

    contacted: leads.filter(
      (lead) => lead.status === "Contacted",
    ).length,

    closed: leads.filter(
      (lead) => lead.status === "Closed",
    ).length,
  };

  function setFilter(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    setPage(1);
  }

  function resetFilters() {
    setQuery("");
    setFormFilter("all");
    setStatusFilter("all");
    setRange("30d");
    setPage(1);
    setSelected([]);
  }

  function toggleLead(id: string | number) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function exportCsv() {
    // Only the currently loaded page is exported.
    const csv = createLeadsCsv(leads);

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      }),
    );

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "dealsync-leads-current-page.csv";
    anchor.click();

    URL.revokeObjectURL(url);

    setNotice(
      `Exported ${leads.length} leads from the current page`,
    );
  }

  async function updateLead(
    leadId: string | number,
    changes: {
      status?: LeadStatusValue;
      notes?: string | null;
    },
  ) {
    try {
      await apiRequest(
        `/api/leads/${leadId}`,
        jsonBody("PATCH", changes),
      );

      setRefreshVersion((value) => value + 1);
      setNotice("Lead updated successfully");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to update lead",
      );
    }
  }

  async function addNote(lead: Lead) {
    const notes = window.prompt(
      `Notes for ${lead.name}`,
      lead.notes ?? "",
    );

    if (notes === null) return;

    await updateLead(lead.id, {
      notes,
    });
  }

  function renderStatusSelect(lead: Lead) {
    const selectedStatus: LeadStatusValue =
      lead.status === "Contacted"
        ? "CONTACTED"
        : lead.status === "Closed"
          ? "CLOSED"
          : "NEW";

    return (
      <select
        aria-label={`Update status for ${lead.name}`}
        value={selectedStatus}
        onChange={(event) =>
          void updateLead(lead.id, {
            status: event.target.value as LeadStatusValue,
          })
        }
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CLOSED">Closed</option>
      </select>
    );
  }

  return (
    <div className="dashboard-page leads-content">
      <section className="leads-titlebar">
        <div>
          <div className="leads-title">
            <h1>Leads</h1>
            <span className="sync-tag">
              <i />
              Live Data
            </span>
          </div>

          <p>
            Track and manage visitor submissions
            across all your website forms.
          </p>
        </div>

        <div className="leads-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={exportCsv}
            disabled={loading || leads.length === 0}
          >
            <ArrowDownToLine size={17} />
            Export Current Page
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={navigateToForms}
          >
            <Plus size={18} />
            Create Form
          </button>
        </div>
      </section>

      <section className="metric-grid leads-metrics">
        <LeadMetric
          label="Matching Leads"
          value={total.toLocaleString()}
          note="Total matching your current filters"
          icon={<FileText size={19} />}
          change="Filtered total"
        />

        <LeadMetric
          label="New on Page"
          value={String(pageMetrics.new)}
          note="Current page only"
          icon={<Sparkles size={19} />}
          change="New"
          purple
        />

        <LeadMetric
          label="Contacted on Page"
          value={String(pageMetrics.contacted)}
          note="Current page only"
          icon={<Activity size={19} />}
          change="Contacted"
        />

        <LeadMetric
          label="Closed on Page"
          value={String(pageMetrics.closed)}
          note="Current page only"
          icon={<Check size={19} />}
          change="Closed"
          green
        />
      </section>

      <section className="lead-filters panel">
        <div className="filter-left">
          <label className="lead-search">
            <Search size={18} />

            <input
              aria-label="Search leads"
              placeholder="Search by name or email..."
              value={query}
              onChange={(event) =>
                setFilter(setQuery, event.target.value)
              }
            />
          </label>

          <label className="filter-select">
            <select
              aria-label="Filter by form"
              value={formFilter}
              onChange={(event) =>
                setFilter(
                  setFormFilter,
                  event.target.value,
                )
              }
            >
              <option value="all">All Forms</option>

              {availableForms.map((form) => (
                <option
                  key={form.id}
                  value={form.id}
                >
                  {form.name}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </label>

          <label className="filter-select status-filter">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                setFilter(
                  setStatusFilter,
                  event.target.value,
                )
              }
            >
              <option value="all">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>

            <ChevronDown size={15} />
          </label>

          <label className="filter-select range-filter">
            <CalendarDays size={16} />

            <select
              aria-label="Filter by date"
              value={range}
              onChange={(event) => {
                setRange(
                  event.target.value as LeadRange,
                );
                setPage(1);
              }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>

            <ChevronDown size={15} />
          </label>
        </div>

        <div className="filter-right">
          <button
            type="button"
            className="clear-filters"
            onClick={resetFilters}
          >
            <Activity size={15} />
            Clear Filters
          </button>

          <div
            className="view-switch"
            role="group"
            aria-label="Lead display mode"
          >
            <button
              type="button"
              aria-label="Comfortable table"
              className={
                view === "table" ? "active" : ""
              }
              onClick={() => setView("table")}
            >
              <ListIcon />
            </button>

            <button
              type="button"
              aria-label="Compact table"
              className={
                view === "compact" ? "active" : ""
              }
              onClick={() => setView("compact")}
            >
              <RowsIcon />
            </button>

            <button
              type="button"
              aria-label="Card view"
              className={
                view === "cards" ? "active" : ""
              }
              onClick={() => setView("cards")}
            >
              <ColumnsIcon />
            </button>
          </div>
        </div>
      </section>

      {loading && (
        <p role="status" className="p-4 text-sm">
          Loading leads...
        </p>
      )}

      {view === "cards" ? (
        <section className="lead-cards">
          {pageLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              selected={selected.includes(lead.id)}
              toggle={() => toggleLead(lead.id)}
              onOpen={() => setOpenedLead(lead)}
            />
          ))}
        </section>
      ) : (
        <section
          className={`panel leads-table-panel ${view === "compact"
              ? "compact-view"
              : ""
            }`}
        >
          <div className="lead-table-scroll">
            <table className="full-leads-table">
              <thead>
                <tr>
                  <th className="check-cell">
                    <input
                      type="checkbox"
                      aria-label="Select all on page"
                      checked={allOnPageSelected}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? pageLeads.map(
                              (lead) => lead.id,
                            )
                            : [],
                        )
                      }
                    />
                  </th>

                  <th>Lead Name &amp; Contact</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Source Form</th>
                  <th>Lead Status</th>
                  <th>Submitted Date</th>
                  <th>
                    <span className="sr-only">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {pageLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="check-cell">
                      <input
                        type="checkbox"
                        aria-label={`Select ${lead.name}`}
                        checked={selected.includes(
                          lead.id,
                        )}
                        onChange={() =>
                          toggleLead(lead.id)
                        }
                      />
                    </td>

                    <td>
                      <div className="full-lead-person">
                        <div
                          className={`avatar lead-avatar ${lead.color}`}
                        >
                          {lead.initials}
                        </div>

                        <span>
                          <strong>
                            {lead.name}
                            {lead.verified && (
                              <ShieldCheck size={15} />
                            )}
                          </strong>

                          <small>{lead.role}</small>

                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                            >
                              {lead.email}
                            </a>
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="company-cell">
                        <strong>
                          {lead.company}
                        </strong>

                        <small>
                          {lead.domain}
                        </small>
                      </div>
                    </td>

                    <td className="lead-phone">
                      {lead.phone}
                    </td>

                    <td>
                      <span className="source-pill">
                        <i />
                        {lead.form}
                      </span>
                    </td>

                    <td>
                      <StatusBadge
                        status={lead.status}
                      />
                      {renderStatusSelect(lead)}
                    </td>

                    <td className="submitted-cell">
                      {lead.submitted}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          aria-label={`View ${lead.name}`}
                          onClick={() =>
                            setOpenedLead(lead)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Edit notes for ${lead.name}`}
                          onClick={() =>
                            void addNote(lead)
                          }
                        >
                          <FilePlus2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading &&
                  pageLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="no-leads"
                      >
                        No leads match these filters.{" "}
                        <button
                          type="button"
                          onClick={resetFilters}
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="result-count">
              Showing{" "}
              <strong>
                {firstVisible}–{lastVisible}
              </strong>{" "}
              of{" "}
              <strong>
                {total.toLocaleString()}
              </strong>{" "}
              leads
              <i />
              <span>
                {selected.length} selected
              </span>
            </div>

            <div className="pagination">
              <label>
                Rows:
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(
                      Number(event.target.value),
                    );
                    setPage(1);
                  }}
                >
                  <option value={8}>
                    8 per page
                  </option>
                  <option value={25}>
                    25 per page
                  </option>
                  <option value={50}>
                    50 per page
                  </option>
                </select>
              </label>

              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((value) =>
                    Math.max(1, value - 1),
                  )
                }
              >
                Previous
              </button>

              <button
                type="button"
                className="page-current"
                aria-current="page"
              >
                {page}
              </button>

              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() =>
                  setPage((value) =>
                    Math.min(
                      pageCount,
                      value + 1,
                    ),
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {notice && (
        <div
          className="dash-toast"
          role="status"
        >
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

      {openedLead && (
        <Modal
          id="lead-details"
          title={openedLead.name}
          description={`Submitted through ${openedLead.form}`}
          onClose={() => setOpenedLead(null)}
        >
          <div className="space-y-3 text-sm">
            <p>
              <strong>Email:</strong>{" "}
              {openedLead.email || "Not supplied"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {openedLead.phone}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {openedLead.company}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {openedLead.status}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {openedLead.notes || "No notes"}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                void addNote(openedLead)
              }
            >
              Edit Notes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

function RowsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1"
      />
      <path d="M7 3v14M7 7h10M7 12h10" />
    </svg>
  );
}

function ColumnsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect
        x="2.5"
        y="3"
        width="15"
        height="14"
        rx="1"
      />
      <path d="M7.5 3v14M12.5 3v14" />
    </svg>
  );
}

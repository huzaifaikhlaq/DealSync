"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import {
  useDashboardNewAction,
  useDashboardSearch,
} from "@/components/layout/dashboard/dashboard-context";
import { Modal } from "@/components/ui/modal";
import "./leads.css";
import { leads as initialLeads } from "./data/leads";
import type { Lead } from "./types/lead.types";
import {
  LeadCard,
  LeadMetric,
  StatusBadge,
} from "./components/lead-presentation";
import { createLeadsCsv, filterLeads } from "./utils/leads";
import { getPageCount, getPageItems } from "@/lib/utils/pagination";
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

export function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [formFilter, setFormFilter] = useState("All Forms (8)");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [range, setRange] = useState("Last 30 Days");
  const [selected, setSelected] = useState<number[]>([]);
  const [view, setView] = useState<"table" | "compact" | "cards">("table");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const dashboardSearch = useDashboardSearch();
  const openAddLead = useCallback(() => setShowForm(true), []);
  useDashboardNewAction(openAddLead);
  const filtered = useMemo(
    () =>
      filterLeads(leads, {
        query: `${query} ${dashboardSearch}`,
        form: formFilter,
        status: statusFilter,
      }),
    [leads, query, dashboardSearch, formFilter, statusFilter],
  );
  const pageCount = getPageCount(filtered.length, pageSize);
  const pageLeads = getPageItems(filtered, page, pageSize);
  const allOnPageSelected =
    pageLeads.length > 0 &&
    pageLeads.every((lead) => selected.includes(lead.id));

  function setFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }
  function resetFilters() {
    setQuery("");
    setFormFilter("All Forms (8)");
    setStatusFilter("All Statuses");
    setRange("Last 30 Days");
    setPage(1);
  }
  function toggleLead(id: number) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function exportCsv() {
    const csv = createLeadsCsv(filtered);
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dealsync-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} leads to CSV`);
    window.setTimeout(() => setNotice(""), 2800);
  }
  function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "New Lead");
    const next: Lead = {
      id: Date.now(),
      name,
      role: String(data.get("role") || "New contact"),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || "Unknown company"),
      domain: String(data.get("domain") || ""),
      phone: String(data.get("phone") || "—"),
      form: "Manually Added",
      status: "New",
      submitted: "Just now",
      initials: name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      color: "lavender",
    };
    setLeads((current) => [next, ...current]);
    setSelected([]);
    setQuery("");
    setStatusFilter("All Statuses");
    setFormFilter("All Forms (8)");
    setPage(1);
    setShowForm(false);
    setNotice(`${name} added to your leads`);
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <div className="dashboard-page leads-content">
      <section className="leads-titlebar">
        <div>
          <div className="leads-title">
            <h1>Leads</h1>
            <span className="sync-tag">
              <i />
              Live Sync
            </span>
          </div>
          <p>
            Track, organize, score, and convert incoming opportunities collected
            across all company forms.
          </p>
        </div>
        <div className="leads-actions">
          <button className="secondary-button" onClick={exportCsv}>
            <ArrowDownToLine size={17} />
            Export CSV
          </button>
          <button className="primary-button" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Lead Manually
          </button>
        </div>
      </section>
      <section className="metric-grid leads-metrics">
        <LeadMetric
          label="Total Leads"
          value="4,892"
          note="All lifetime recorded captures"
          icon={<FileText size={19} />}
          change="+14.2%"
        />
        <LeadMetric
          label="New (Uncontacted)"
          value="342"
          note="Avg response time: 24 mins"
          icon={<Sparkles size={19} />}
          change="Requires SLA"
          purple
        />
        <LeadMetric
          label="In Progress"
          value="1,420"
          note="Active outreach & demos scheduled"
          icon={<Activity size={19} />}
          change="29% pipeline share"
        />
        <LeadMetric
          label="Converted"
          value="614"
          note="$1.84M annualized value"
          icon={<Check size={19} />}
          change="12.5% CR"
          green
        />
      </section>

      <section className="lead-filters panel">
        <div className="filter-left">
          <label className="lead-search">
            <Search size={18} />
            <input
              placeholder="Search by lead name, email, company, or phone..."
              value={query}
              onChange={(event) => setFilter(setQuery, event.target.value)}
              aria-label="Search leads"
            />
          </label>
          <label className="filter-select">
            <select
              aria-label="Filter by form"
              value={formFilter}
              onChange={(event) => setFilter(setFormFilter, event.target.value)}
            >
              <option>All Forms (8)</option>
              {[...new Set(leads.map((lead) => lead.form))].map((form) => (
                <option key={form}>{form}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="filter-select status-filter">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                setFilter(setStatusFilter, event.target.value)
              }
            >
              <option>All Statuses</option>
              {[
                "New",
                "In Progress",
                "Qualified",
                "Attempted to Contact",
                "Converted",
              ].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="filter-select range-filter">
            <CalendarDays size={16} />
            <select
              aria-label="Filter by date"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              {["Last 30 Days", "Last 7 Days", "Last 90 Days", "All Time"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
            <ChevronDown size={15} />
          </label>
        </div>
        <div className="filter-right">
          <button className="clear-filters" onClick={resetFilters}>
            <Activity size={15} />
            Clear Filters
          </button>
          <div
            className="view-switch"
            role="group"
            aria-label="Lead display mode"
          >
            <button
              className={view === "table" ? "active" : ""}
              aria-label="Comfortable table"
              onClick={() => setView("table")}
            >
              <ListIcon />
            </button>
            <button
              className={view === "compact" ? "active" : ""}
              aria-label="Compact table"
              onClick={() => setView("compact")}
            >
              <RowsIcon />
            </button>
            <button
              className={view === "cards" ? "active" : ""}
              aria-label="Card view"
              onClick={() => setView("cards")}
            >
              <ColumnsIcon />
            </button>
          </div>
        </div>
      </section>

      {view === "cards" ? (
        <section className="lead-cards">
          {pageLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              selected={selected.includes(lead.id)}
              toggle={() => toggleLead(lead.id)}
              onOpen={() => setNotice(`Lead profile: ${lead.name}`)}
            />
          ))}
        </section>
      ) : (
        <section
          className={`panel leads-table-panel ${view === "compact" ? "compact-view" : ""}`}
        >
          <div className="lead-table-scroll">
            <table className="full-leads-table">
              <thead>
                <tr>
                  <th className="check-cell">
                    <input
                      type="checkbox"
                      aria-label="Select all leads on this page"
                      checked={allOnPageSelected}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? Array.from(
                                new Set([
                                  ...current,
                                  ...pageLeads.map((lead) => lead.id),
                                ]),
                              )
                            : current.filter(
                                (id) =>
                                  !pageLeads.some((lead) => lead.id === id),
                              ),
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
                    <span className="sr-only">Actions</span>
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
                        checked={selected.includes(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                      />
                    </td>
                    <td>
                      <div className="full-lead-person">
                        <div className={`avatar lead-avatar ${lead.color}`}>
                          {lead.initials}
                        </div>
                        <span>
                          <strong>
                            {lead.name}
                            {lead.verified && <ShieldCheck size={15} />}
                          </strong>
                          <small>{lead.role}</small>
                          <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="company-cell">
                        <strong>{lead.company}</strong>
                        <small>{lead.domain}</small>
                      </div>
                    </td>
                    <td className="lead-phone">{lead.phone}</td>
                    <td>
                      <span className="source-pill">
                        <i />
                        {lead.form}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="submitted-cell">{lead.submitted}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          aria-label={`View ${lead.name}`}
                          onClick={() =>
                            setNotice(`Lead profile: ${lead.name}`)
                          }
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          aria-label={`Add note for ${lead.name}`}
                          onClick={() =>
                            setNotice(`Add a note for ${lead.name}`)
                          }
                        >
                          <FilePlus2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageLeads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="no-leads">
                      No leads match these filters.{" "}
                      <button onClick={resetFilters}>Clear filters</button>
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
                {filtered.length ? (page - 1) * pageSize + 1 : 0}–
                {Math.min(page * pageSize, filtered.length)}
              </strong>{" "}
              of <strong>{filtered.length.toLocaleString()}</strong> leads <i />{" "}
              <span>{selected.length} selected</span>
            </div>
            <div className="pagination">
              <label>
                Rows:
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  <option value={8}>8 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </label>
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </button>
              <button className="page-current">{page}</button>
              {page < pageCount && (
                <button onClick={() => setPage((current) => current + 1)}>
                  {page + 1}
                </button>
              )}
              <span>…</span>
              <button
                disabled={page >= pageCount}
                onClick={() => setPage(pageCount)}
              >
                {pageCount}
              </button>
              <button
                disabled={page >= pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}
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
      {showForm && (
        <Modal
          id="add-lead-title"
          title="Add a lead"
          description="Add a contact to your DealSync lead list."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={addLead}>
            <label>
              Name
              <input name="name" required autoFocus placeholder="Jamie Chen" />
            </label>
            <label>
              Role
              <input name="role" placeholder="VP of Operations" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="jamie@company.com"
              />
            </label>
            <label>
              Company
              <input name="company" placeholder="Acme Inc." />
            </label>
            <label>
              Domain
              <input name="domain" placeholder="acme.com" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" placeholder="+1 555 0100" />
            </label>
            <div className="lead-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                <Plus size={16} />
                Add lead
              </button>
            </div>
          </form>
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
      <rect x="3" y="3" width="14" height="14" rx="1" />
      <path d="M7 3v14M7 7h10M7 12h10" />
    </svg>
  );
}
function ColumnsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.5" y="3" width="15" height="14" rx="1" />
      <path d="M7.5 3v14M12.5 3v14" />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, Bolt, BriefcaseBusiness,
  CalendarDays, Check, ChevronDown, CircleHelp, ClipboardList, Eye, FilePlus2,
  FileText, LayoutDashboard, Menu, Plus, Search, Settings, ShieldCheck, Sparkles,
  Users, X,
} from "lucide-react";

type Lead = { id: number; name: string; role: string; email: string; company: string; domain: string; phone: string; form: string; status: string; submitted: string; initials: string; color: string; verified?: boolean };

const initialLeads: Lead[] = [
  { id: 1, name: "Sophia Chen", role: "VP of Technology", email: "sophia.chen@stripe.com", company: "Stripe, Inc.", domain: "stripe.com", phone: "+1 (415) 892-0192", form: "Enterprise Demo Request", status: "Qualified", submitted: "Today, 10:24 AM", initials: "SC", color: "lilac", verified: true },
  { id: 2, name: "Marcus Thorne", role: "Chief Revenue Officer", email: "m.thorne@cloudscale.io", company: "CloudScale Systems", domain: "cloudscale.io", phone: "+1 (312) 402-9981", form: "Whitepaper Gate 2024", status: "New", submitted: "Today, 09:12 AM", initials: "MT", color: "blue" },
  { id: 3, name: "David Kim", role: "Head of Product Growth", email: "david@nexusflow.dev", company: "NexusFlow AI", domain: "nexusflow.dev", phone: "+1 (206) 774-1920", form: "Enterprise Demo Request", status: "In Progress", submitted: "Yesterday, 4:15 PM", initials: "DK", color: "photo" },
  { id: 4, name: "Elena Rostova", role: "Procurement Director", email: "e.rostova@finovatech.ch", company: "Finova Global AG", domain: "finovatech.ch", phone: "+41 44 289 11 00", form: "Pricing Calculator", status: "Attempted to Contact", submitted: "Yesterday, 1:40 PM", initials: "ER", color: "peach" },
  { id: 5, name: "Sarah Al-Mansoor", role: "Managing Partner", email: "sarah@crescentcap.ae", company: "Crescent Capital", domain: "crescentcap.ae", phone: "+971 4 391 8021", form: "Enterprise Demo Request", status: "Converted", submitted: "Oct 14, 2024", initials: "SA", color: "woman", verified: true },
  { id: 6, name: "Thomas Wright", role: "Infrastructure Architect", email: "twright@datavertex.co.uk", company: "DataVertex UK", domain: "datavertex.co.uk", phone: "+44 20 7946 0912", form: "Webinar Registration", status: "Qualified", submitted: "Oct 13, 2024", initials: "TW", color: "lavender" },
  { id: 7, name: "Camille Dubois", role: "Chief Executive Officer", email: "camille@duboislogistics.fr", company: "Dubois Logistics SA", domain: "duboislogistics.fr", phone: "+33 1 42 68 55 00", form: "Enterprise Demo Request", status: "New", submitted: "Oct 13, 2024", initials: "CD", color: "blue" },
  { id: 8, name: "Liam Gallagher", role: "Operations Lead", email: "liam.g@nordicstream.se", company: "NordicStream Media", domain: "nordicstream.se", phone: "+46 8 123 456 78", form: "Contact Us General", status: "In Progress", submitted: "Oct 12, 2024", initials: "LG", color: "lavender" },
];

const navigation = [
  { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Forms", icon: ClipboardList, href: "/dashboard/forms" },
  { title: "Leads", icon: Users, href: "/dashboard/leads" },
  { title: "Analytics", icon: Activity, href: "/dashboard" },
  { title: "Team", icon: BriefcaseBusiness, href: "/dashboard" },
  { title: "Settings", icon: Settings, href: "/dashboard" },
];

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
  const [mobileNav, setMobileNav] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => leads.filter((lead) => {
    const matchesSearch = `${lead.name} ${lead.email} ${lead.company} ${lead.phone}`.toLowerCase().includes(query.toLowerCase());
    const matchesForm = formFilter === "All Forms (8)" || lead.form === formFilter;
    const matchesStatus = statusFilter === "All Statuses" || lead.status === statusFilter;
    return matchesSearch && matchesForm && matchesStatus;
  }), [leads, query, formFilter, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageLeads = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allOnPageSelected = pageLeads.length > 0 && pageLeads.every((lead) => selected.includes(lead.id));

  function setFilter(setter: (value: string) => void, value: string) { setter(value); setPage(1); }
  function resetFilters() { setQuery(""); setFormFilter("All Forms (8)"); setStatusFilter("All Statuses"); setRange("Last 30 Days"); setPage(1); }
  function toggleLead(id: number) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function exportCsv() {
    const rows = [["Name", "Role", "Email", "Company", "Phone", "Source Form", "Status", "Submitted"], ...filtered.map((lead) => [lead.name, lead.role, lead.email, lead.company, lead.phone, lead.form, lead.status, lead.submitted])];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "dealsync-leads.csv"; anchor.click(); URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} leads to CSV`); window.setTimeout(() => setNotice(""), 2800);
  }
  function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "New Lead");
    const next: Lead = { id: Date.now(), name, role: String(data.get("role") || "New contact"), email: String(data.get("email") || ""), company: String(data.get("company") || "Unknown company"), domain: String(data.get("domain") || ""), phone: String(data.get("phone") || "—"), form: "Manually Added", status: "New", submitted: "Just now", initials: name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(), color: "lavender" };
    setLeads((current) => [next, ...current]); setSelected([]); setQuery(""); setStatusFilter("All Statuses"); setFormFilter("All Forms (8)"); setPage(1); setShowForm(false);
    setNotice(`${name} added to your leads`); window.setTimeout(() => setNotice(""), 2800);
  }

  return <div className="dash-shell">
    <aside className={`dash-sidebar ${mobileNav ? "dash-sidebar-open" : ""}`}>
      <div className="dash-brand"><span className="brand-glyph"><Sparkles size={19}/></span><span>Deal<span>Sync</span></span><button className="sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
      <button className="workspace-switch"><span className="workspace-mark">AC</span><span className="workspace-copy"><strong>Acme Cloud Systems</strong><small><ShieldCheck size={14}/>Enterprise Tier</small></span><ChevronDown size={16}/></button>
      <nav className="dash-nav" aria-label="Main navigation">{navigation.map(({title,icon:Icon,href}) => <Link key={title} href={href} onClick={() => setMobileNav(false)} className={`dash-nav-item ${title === "Leads" ? "selected" : ""}`}><Icon size={19}/><span>{title}</span></Link>)}</nav>
      <div className="sidebar-bottom"><button className="dash-nav-item"><CircleHelp size={19}/><span>Help &amp; Support</span></button><div className="system-status"><i/><span>Systems Operational</span><strong>99.98%</strong></div><div className="sidebar-profile"><div className="avatar avatar-photo">MV</div><span><strong>Marcus Vance</strong><small>Company Admin</small></span></div></div>
    </aside>
    <div className="dash-main">
      <header className="dash-topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumbs"><BriefcaseBusiness size={18}/><span>Acme Cloud Systems</span><b>/</b><strong>Workspace</strong></div><label className="global-search"><Search size={19}/><input aria-label="Search leads, forms, companies" placeholder="Search leads, forms, companies..."/><kbd>⌘ K</kbd></label><div className="top-actions"><button className="new-button" onClick={() => setShowForm(true)}><Plus size={18}/><span>New</span></button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice("You’re all caught up")}><Bell size={19}/><i/></button><button className="icon-button help-button" aria-label="Help"><CircleHelp size={19}/></button><div className="avatar avatar-photo top-avatar">MV</div></div></header>
      <main className="dash-content leads-content">
        <section className="leads-titlebar"><div><div className="leads-title"><h1>Leads</h1><span className="sync-tag"><i/>Live Sync</span></div><p>Track, organize, score, and convert incoming opportunities collected across all company forms.</p></div><div className="leads-actions"><button className="secondary-button" onClick={exportCsv}><ArrowDownToLine size={17}/>Export CSV</button><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18}/>Add Lead Manually</button></div></section>
        <section className="metric-grid leads-metrics"><LeadMetric label="Total Leads" value="4,892" note="All lifetime recorded captures" icon={<FileText size={19}/>} change="+14.2%"/><LeadMetric label="New (Uncontacted)" value="342" note="Avg response time: 24 mins" icon={<Sparkles size={19}/>} change="Requires SLA" purple/><LeadMetric label="In Progress" value="1,420" note="Active outreach & demos scheduled" icon={<Activity size={19}/>} change="29% pipeline share"/><LeadMetric label="Converted" value="614" note="$1.84M annualized value" icon={<Check size={19}/>} change="12.5% CR" green/></section>

        <section className="lead-filters panel"><div className="filter-left"><label className="lead-search"><Search size={18}/><input placeholder="Search by lead name, email, company, or phone..." value={query} onChange={(event) => setFilter(setQuery,event.target.value)} aria-label="Search leads"/></label><label className="filter-select"><select aria-label="Filter by form" value={formFilter} onChange={(event) => setFilter(setFormFilter,event.target.value)}><option>All Forms (8)</option>{[...new Set(leads.map((lead) => lead.form))].map((form) => <option key={form}>{form}</option>)}</select><ChevronDown size={15}/></label><label className="filter-select status-filter"><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setFilter(setStatusFilter,event.target.value)}><option>All Statuses</option>{["New","In Progress","Qualified","Attempted to Contact","Converted"].map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={15}/></label><label className="filter-select range-filter"><CalendarDays size={16}/><select aria-label="Filter by date" value={range} onChange={(event) => setRange(event.target.value)}>{["Last 30 Days","Last 7 Days","Last 90 Days","All Time"].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15}/></label></div><div className="filter-right"><button className="clear-filters" onClick={resetFilters}><Activity size={15}/>Clear Filters</button><div className="view-switch" role="group" aria-label="Lead display mode"><button className={view === "table" ? "active" : ""} aria-label="Comfortable table" onClick={() => setView("table")}><ListIcon/></button><button className={view === "compact" ? "active" : ""} aria-label="Compact table" onClick={() => setView("compact")}><RowsIcon/></button><button className={view === "cards" ? "active" : ""} aria-label="Card view" onClick={() => setView("cards")}><ColumnsIcon/></button></div></div></section>

        {view === "cards" ? <section className="lead-cards">{pageLeads.map((lead) => <LeadCard key={lead.id} lead={lead} selected={selected.includes(lead.id)} toggle={() => toggleLead(lead.id)} onOpen={() => setNotice(`Lead profile: ${lead.name}`)}/>)}</section> : <section className={`panel leads-table-panel ${view === "compact" ? "compact-view" : ""}`}><div className="lead-table-scroll"><table className="full-leads-table"><thead><tr><th className="check-cell"><input type="checkbox" aria-label="Select all leads on this page" checked={allOnPageSelected} onChange={(event) => setSelected((current) => event.target.checked ? Array.from(new Set([...current,...pageLeads.map((lead) => lead.id)])) : current.filter((id) => !pageLeads.some((lead) => lead.id === id)))} /></th><th>Lead Name &amp; Contact</th><th>Company</th><th>Phone</th><th>Source Form</th><th>Lead Status</th><th>Submitted Date</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{pageLeads.map((lead) => <tr key={lead.id}><td className="check-cell"><input type="checkbox" aria-label={`Select ${lead.name}`} checked={selected.includes(lead.id)} onChange={() => toggleLead(lead.id)}/></td><td><div className="full-lead-person"><div className={`avatar lead-avatar ${lead.color}`}>{lead.initials}</div><span><strong>{lead.name}{lead.verified && <ShieldCheck size={15}/>}</strong><small>{lead.role}</small><a href={`mailto:${lead.email}`}>{lead.email}</a></span></div></td><td><div className="company-cell"><strong>{lead.company}</strong><small>{lead.domain}</small></div></td><td className="lead-phone">{lead.phone}</td><td><span className="source-pill"><i/>{lead.form}</span></td><td><StatusBadge status={lead.status}/></td><td className="submitted-cell">{lead.submitted}</td><td><div className="table-actions"><button aria-label={`View ${lead.name}`} onClick={() => setNotice(`Lead profile: ${lead.name}`)}><Eye size={17}/></button><button aria-label={`Add note for ${lead.name}`} onClick={() => setNotice(`Add a note for ${lead.name}`)}><FilePlus2 size={17}/></button></div></td></tr>)}{pageLeads.length === 0 && <tr><td colSpan={8} className="no-leads">No leads match these filters. <button onClick={resetFilters}>Clear filters</button></td></tr>}</tbody></table></div>
          <div className="table-footer"><div className="result-count">Showing <strong>{filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length.toLocaleString()}</strong> leads <i/> <span>{selected.length} selected</span></div><div className="pagination"><label>Rows:<select value={pageSize} onChange={(event) => {setPageSize(Number(event.target.value));setPage(1)}}><option value={8}>8 per page</option><option value={25}>25 per page</option><option value={50}>50 per page</option></select></label><button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1,current-1))}>Previous</button><button className="page-current">{page}</button>{page < pageCount && <button onClick={() => setPage((current) => current+1)}>{page+1}</button>}<span>…</span><button disabled={page >= pageCount} onClick={() => setPage(pageCount)}>{pageCount}</button><button disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount,current+1))}>Next</button></div></div>
        </section>}
      </main>
    </div>
    {mobileNav && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)}/>}
    {showForm && <div className="lead-modal-backdrop" onMouseDown={(event) => {if(event.target === event.currentTarget) setShowForm(false)}}><section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="add-lead-title"><header><div><h2 id="add-lead-title">Add a lead</h2><p>Enter a few details to add a contact to your pipeline.</p></div><button aria-label="Close" onClick={() => setShowForm(false)}><X size={19}/></button></header><form onSubmit={addLead}><label>Full name<input name="name" required placeholder="e.g. Jordan Lee" autoFocus/></label><label>Work email<input name="email" type="email" required placeholder="jordan@company.com"/></label><label>Company<input name="company" required placeholder="Company name"/></label><label>Job title<input name="role" placeholder="e.g. Head of Marketing"/></label><label>Company domain<input name="domain" placeholder="company.com"/></label><label>Phone<input name="phone" type="tel" placeholder="+1 555 0100"/></label><div className="lead-modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={16}/>Add lead</button></div></form></section></div>}
    {notice && <div className="dash-toast" role="status"><Check size={16}/>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15}/></button></div>}
  </div>;
}

function LeadMetric({label,value,note,icon,change,purple=false,green=false}:{label:string;value:string;note:string;icon:ReactNode;change:string;purple?:boolean;green?:boolean}) { return <article className="metric-card lead-metric-card"><div className="metric-top"><span>{label}</span><div className={`metric-icon ${green ? "green" : purple ? "purple" : ""}`}>{icon}</div></div><div className="lead-metric-value"><strong>{value}</strong><span className={green ? "green-text" : purple ? "purple-text" : ""}>{purple && <Bolt size={13}/>} {!purple && !green && <ArrowRight size={13}/>} {change}</span></div><p>{note}</p></article>; }
function StatusBadge({status}:{status:string}) { return <span className={`full-status ${status.toLowerCase().replaceAll(" ","-")}`}><i/>{status}</span>; }
function LeadCard({lead,selected,toggle,onOpen}:{lead:Lead;selected:boolean;toggle:()=>void;onOpen:()=>void}) { return <article className="panel lead-card"><div className="lead-card-top"><input type="checkbox" aria-label={`Select ${lead.name}`} checked={selected} onChange={toggle}/><StatusBadge status={lead.status}/></div><div className="full-lead-person"><div className={`avatar lead-avatar ${lead.color}`}>{lead.initials}</div><span><strong>{lead.name}</strong><small>{lead.role}</small><a href={`mailto:${lead.email}`}>{lead.email}</a></span></div><div className="lead-card-company"><strong>{lead.company}</strong><small>{lead.domain}</small></div><span className="source-pill"><i/>{lead.form}</span><div className="lead-card-bottom"><span>{lead.submitted}</span><button onClick={onOpen}><Eye size={16}/> View lead</button></div></article>; }
function ListIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg>; }
function RowsIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="1"/><path d="M7 3v14M7 7h10M7 12h10"/></svg>; }
function ColumnsIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="15" height="14" rx="1"/><path d="M7.5 3v14M12.5 3v14"/></svg>; }

"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, Bolt, BriefcaseBusiness,
  CalendarDays, Check, ChevronDown, CircleHelp, ClipboardList, FileText,
  Filter, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings,
  ShieldCheck, Sparkles, Trophy, Users, X,
} from "lucide-react";

const leads = [
  { name: "Sophia Chen", role: "VP Tech", company: "Stripe", form: "Enterprise Demo", score: 94, status: "Qualified", time: "12m ago", initials: "SC", color: "lilac" },
  { name: "Liam Gallagher", role: "Director Growth", company: "Vercel", form: "SaaS Free Trial", score: 88, status: "In Progress", time: "34m ago", initials: "LG", color: "blue" },
  { name: "Elena Rostova", role: "Head of Sales", company: "Retool", form: "Q4 Whitepaper", score: 68, status: "Attempted", time: "1h ago", initials: "ER", color: "peach" },
];

const forms = [
  { title: "Enterprise Demo Request", detail: "Multi-step qualification flow", count: "1,942", rate: "18.2%", bar: "88%", tag: "#1 Volume" },
  { title: "Q4 Whitepaper & Product Guide", detail: "Gated technical resource asset", count: "1,420", rate: "14.1%", bar: "64%", tag: "#2 Volume" },
  { title: "SaaS Free Trial Onboarding", detail: "In-app workspace activation", count: "912", rate: "22.8%", bar: "92%", tag: "Highest Conv.", best: true },
  { title: "Contact Sales — Inbound", detail: "Main footer and navigation CTA", count: "618", rate: "9.4%", bar: "48%", tag: "Direct" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Forms", icon: ClipboardList },
  { label: "Leads", icon: Users }, { label: "Analytics", icon: Activity },
  { label: "Team", icon: BriefcaseBusiness }, { label: "Settings", icon: Settings },
];

export function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [period, setPeriod] = useState("Last 30 days");
  const [granularity, setGranularity] = useState("Daily");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const visibleLeads = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.company} ${lead.form} ${lead.status}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function exportReport() {
    const rows = [["Lead", "Role", "Company", "Source form", "Score", "Status", "Received"], ...leads.map((lead) => [lead.name, lead.role, lead.company, lead.form, String(lead.score), lead.status, lead.time])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "dealsync-leads-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    setNotice("Report exported as CSV");
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <div className="dash-shell">
      <aside className={`dash-sidebar ${mobileNav ? "dash-sidebar-open" : ""}`}>
        <div className="dash-brand"><span className="brand-glyph"><Sparkles size={19} /></span><span>Deal<span>Sync</span></span><button className="sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button></div>
        <button className="workspace-switch"><span className="workspace-mark">AC</span><span className="workspace-copy"><strong>Acme Cloud Systems</strong><small><ShieldCheck size={14} /> Enterprise Tier</small></span><ChevronDown size={16} /></button>
        <nav className="dash-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => label === "Leads" || label === "Forms" ? <Link key={label} href={label === "Leads" ? "/dashboard/leads" : "/dashboard/forms"} className="dash-nav-item" onClick={() => setMobileNav(false)}><Icon size={19} strokeWidth={2.2} /><span>{label}</span></Link> : <button key={label} className={`dash-nav-item ${activeNav === label ? "selected" : ""}`} onClick={() => { setActiveNav(label); setMobileNav(false); }}><Icon size={19} strokeWidth={2.2} /><span>{label}</span></button>)}
        </nav>
        <div className="sidebar-bottom"><button className="dash-nav-item"><CircleHelp size={19} /><span>Help &amp; Support</span></button><div className="system-status"><i /> <span>Systems Operational</span><strong>99.98%</strong></div><div className="sidebar-profile"><div className="avatar avatar-photo">MV</div><span><strong>Marcus Vance</strong><small>Company Admin</small></span><button aria-label="Account options"><MoreHorizontal size={18} /></button></div></div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumbs"><BriefcaseBusiness size={18} /><span>Acme Cloud Systems</span><b>/</b><strong>{activeNav}</strong></div><label className="global-search"><Search size={19} /><input aria-label="Search leads, forms, companies" placeholder="Search leads, forms, companies..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label><div className="top-actions"><button className="new-button" onClick={() => setNotice("Your new form is ready to configure") }><Plus size={18} /><span>New</span></button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice("You’re all caught up") }><Bell size={19} /><i /></button><button className="icon-button help-button" aria-label="Help" onClick={() => setNotice("Help center is coming soon") }><CircleHelp size={19} /></button><div className="avatar avatar-photo top-avatar">MV</div></div></header>

        <main className="dash-content" id="overview">
          <section className="welcome-card"><div><div className="welcome-title"><h1>Good morning, Marcus! <span aria-hidden="true">👋</span></h1><span className="live-pill"><i /> Live Sync Active</span></div><p>Here&apos;s what&apos;s happening with your leads and capture forms across <strong>Acme Cloud Systems</strong> today.</p></div><div className="welcome-actions"><label className="select-control"><CalendarDays size={17} /><select aria-label="Reporting date range" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select><ChevronDown size={16} /></label><button className="secondary-button" onClick={exportReport}><ArrowDownToLine size={17} /> Export Report</button><button className="primary-button" onClick={() => setNotice("Your new form is ready to configure")}><Plus size={18} /> Create New Form</button></div></section>

          <section className="metric-grid" aria-label="Lead metrics"><Metric icon={<Users size={20} />} label="Total Captured Leads" value="4,892" change="18.4%" note="Total captured through 8 active forms" progress="78%"/><Metric icon={<Bolt size={20} />} label="New Leads" value="342" change="12.1%" note="Unreviewed in the last 48 hours" progress="42%" tone="blue"/><Metric icon={<ShieldCheck size={20} />} label="Qualified Leads" value="1,280" change="24.8%" note="Score ≥ 75 or high buyer intent" progress="64%" tone="purple"/><Metric icon={<Trophy size={20} />} label="Converted Leads" value="614" change="12.5%" note="$284,500 pipeline ARR value" progress="55%" tone="green"/></section>

          <section className="analytics-grid"><div className="panel trend-panel"><div className="panel-heading"><div><h2>Leads Captured Over Time</h2><p>Aggregated submissions across active forms</p></div><div className="segmented" role="group" aria-label="Chart interval">{["Daily", "Weekly", "Monthly"].map((item) => <button key={item} className={granularity === item ? "active" : ""} onClick={() => setGranularity(item)}>{item}</button>)}</div></div><div className="source-legend"><span><i className="dot dot-indigo"/>Inbound Web (62%)</span><span><i className="dot dot-lavender"/>Direct Links (24%)</span><span><i className="dot dot-mint"/>Partner Embeds (14%)</span></div><div className="chart-wrap"><div className="chart-y-labels"><span>250</span><span>180</span><span>120</span><span>60</span><span>0</span></div><svg className="trend-chart" viewBox="0 0 720 250" preserveAspectRatio="none" role="img" aria-label={`${granularity} lead submissions trend increasing through October`}><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5145e8" stopOpacity=".24"/><stop offset="100%" stopColor="#5145e8" stopOpacity="0"/></linearGradient></defs><path className="gridline" d="M0 20H720 M0 72H720 M0 124H720 M0 176H720 M0 228H720"/><path className="area" d="M0 218 C35 209 52 193 78 180 S125 136 161 130 S203 146 235 131 S282 103 313 77 S365 26 401 38 S454 76 492 88 S548 118 587 99 S632 76 661 88 S697 99 720 67 V238 H0Z"/><path className="line" d="M0 218 C35 209 52 193 78 180 S125 136 161 130 S203 146 235 131 S282 103 313 77 S365 26 401 38 S454 76 492 88 S548 118 587 99 S632 76 661 88 S697 99 720 67"/></svg></div><div className="chart-x-labels"><span>Oct 01</span><span>Oct 08</span><span>Oct 15</span><span>Oct 22</span><span>Oct 29</span></div></div>
            <div className="panel status-panel"><div className="panel-heading"><div><h2>Status Distribution</h2><p>Where your pipeline stands</p></div><button className="icon-button small-icon" aria-label="More status options"><MoreHorizontal size={20}/></button></div><div className="donut-area"><div className="donut"><div className="donut-center"><span>Total Leads</span><strong>4,892</strong><small><Check size={13}/>100% Synced</small></div></div></div><div className="status-legend"><Status color="emerald" label="Converted" count="614" percent="12.5%"/><Status color="indigo-dark" label="Qualified" count="1,280" percent="26.2%"/><Status color="indigo" label="In Progress" count="1,420" percent="29.0%"/><Status color="blue-pale" label="Attempted Contact" count="1,236" percent="25.3%"/><Status color="mint" label="New / Unreviewed" count="342" percent="7.0%"/></div></div>
          </section>

          <section className="panel forms-panel"><div className="panel-heading"><div><h2>Top Performing Forms</h2><p>Forms driving the highest submission volume and qualified pipeline conversion</p></div><button className="text-link" onClick={() => setActiveNav("Forms")}>Manage all forms <ArrowRight size={16}/></button></div><div className="forms-grid">{forms.map((form) => <article className="form-card" key={form.title}><div className="form-meta"><span className="active-tag"><i/>Active</span><span className={form.best ? "best-tag" : ""}>{form.tag}</span></div><h3>{form.title}</h3><p>{form.detail}</p><div className="form-stats"><strong>{form.count} <small>subs</small></strong><b className={form.best ? "best-tag" : ""}>{form.rate} conv.</b></div><div className="progress-track"><i className={form.best ? "green-fill" : ""} style={{width:form.bar}}/></div></article>)}</div></section>

          <section className="bottom-grid"><div className="panel leads-panel"><div className="panel-heading"><div><h2>Recent Incoming Leads</h2><p>Real-time incoming submissions enriched with firmographics</p></div><div className="lead-tools"><button className="icon-button small-icon" aria-label="Filter leads" onClick={() => setNotice("Use the search field to filter leads") }><Filter size={17}/></button><button className="text-link" onClick={() => setActiveNav("Leads")}>View all (4,892)</button></div></div><div className="table-scroll"><table className="leads-table"><thead><tr><th>Lead Contact</th><th>Source Form</th><th>Score</th><th>Status</th><th>Timestamp</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleLeads.map((lead) => <tr key={lead.name}><td><div className="lead-person"><div className={`avatar ${lead.color}`}>{lead.initials}</div><span><strong>{lead.name}</strong><small>{lead.role}, {lead.company}</small></span></div></td><td><span className="form-source"><FileText size={14}/>{lead.form}</span></td><td><span className={`score ${lead.score >= 85 ? "high-score" : ""}`}>{lead.score}</span></td><td><span className={`status-chip ${lead.status.toLowerCase().replaceAll(" ", "-")}`}><i/>{lead.status}</span></td><td className="timestamp">{lead.time}</td><td><button className="row-action" aria-label={`Open ${lead.name}`} onClick={() => setNotice(`Lead profile: ${lead.name}`)}><ArrowRight size={16}/></button></td></tr>)}{visibleLeads.length === 0 && <tr><td colSpan={6} className="empty-row">No leads match “{query}”.</td></tr>}</tbody></table></div></div>
            <div className="panel activity-panel"><div className="panel-heading"><div className="activity-title"><h2>Live Activity</h2><i/></div><span className="realtime">Real-time</span></div><div className="timeline"><ActivityItem kind="submission" title="New form submission" detail={<>Enterprise Demo by <strong>Sophia Chen</strong> (Stripe)</>} time="12 minutes ago"/><ActivityItem kind="success" title="Status updated to Qualified" detail={<>Auto-scored ≥ 85 threshold for <strong>Liam G.</strong></>} time="34 minutes ago"/><ActivityItem kind="note" title="Note added by Sarah J." detail={<em>“Customer requested custom pricing for 500+ seat deployment.”</em>} time="48 minutes ago"/><ActivityItem kind="sync" title="Webhook sync to Salesforce" detail="3 lead records pushed with zero mapping errors" time="1 hour ago"/></div></div>
          </section>
      <footer className="dash-footer"><span>© 2024 DealSync</span><span>All data synced just now <i/></span></footer>
        </main>
      </div>
      {mobileNav && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)}/>}
      {notice && <div className="dash-toast" role="status"><Check size={16}/>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15}/></button></div>}
    </div>
  );
}

function Metric({icon,label,value,change,note,progress,tone="indigo"}:{icon:ReactNode;label:string;value:string;change:string;note:string;progress:string;tone?:string}) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><div className={`metric-icon ${tone}`}>{icon}</div></div><div className="metric-value"><strong>{value}</strong><span><ArrowRight size={13}/>{change}</span></div><p>{note}</p><div className="progress-track"><i className={`${tone}-fill`} style={{width:progress}}/></div></article>;
}

function Status({color,label,count,percent}:{color:string;label:string;count:string;percent:string}) { return <div className="status-row"><span><i className={`dot ${color}`}/>{label}</span><strong>{count}</strong><b>{percent}</b></div>; }

function ActivityItem({kind,title,detail,time}:{kind:string;title:string;detail:ReactNode;time:string}) { return <article className={`timeline-item ${kind}`}><span className="timeline-icon">{kind === "success" ? <Check size={13}/> : kind === "note" ? <FileText size={13}/> : kind === "sync" ? <Activity size={13}/> : <Plus size={13}/>}</span><div><h3>{title}</h3><p>{detail}</p><time>{time}</time></div></article>; }

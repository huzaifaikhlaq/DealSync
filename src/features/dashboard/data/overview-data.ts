import type { DashboardLead, PerformingForm } from "../types/dashboard";

export const dashboardLeads: DashboardLead[] = [
  {
    name: "Sophia Chen",
    role: "VP Tech",
    company: "Stripe",
    form: "Enterprise Demo",
    score: 94,
    status: "Qualified",
    time: "12m ago",
    initials: "SC",
    color: "lilac",
  },
  {
    name: "Liam Gallagher",
    role: "Director Growth",
    company: "Vercel",
    form: "SaaS Free Trial",
    score: 88,
    status: "In Progress",
    time: "34m ago",
    initials: "LG",
    color: "blue",
  },
  {
    name: "Elena Rostova",
    role: "Head of Sales",
    company: "Retool",
    form: "Q4 Whitepaper",
    score: 68,
    status: "Attempted",
    time: "1h ago",
    initials: "ER",
    color: "peach",
  },
];

export const performingForms: PerformingForm[] = [
  {
    title: "Enterprise Demo Request",
    detail: "Multi-step qualification flow",
    count: "1,942",
    rate: "18.2%",
    bar: "88%",
    tag: "#1 Volume",
  },
  {
    title: "Q4 Whitepaper & Product Guide",
    detail: "Gated technical resource asset",
    count: "1,420",
    rate: "14.1%",
    bar: "64%",
    tag: "#2 Volume",
  },
  {
    title: "SaaS Free Trial Onboarding",
    detail: "In-app workspace activation",
    count: "912",
    rate: "22.8%",
    bar: "92%",
    tag: "Highest Conv.",
    best: true,
  },
  {
    title: "Contact Sales — Inbound",
    detail: "Main footer and navigation CTA",
    count: "618",
    rate: "9.4%",
    bar: "48%",
    tag: "Direct",
  },
];

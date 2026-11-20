export type DashboardRange = "7d" | "30d" | "90d";
export type DashboardGranularity = "daily" | "weekly" | "monthly";
export type DashboardLeadStatus = "NEW" | "CONTACTED" | "CLOSED";
export type DashboardFormStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type DashboardMetrics = {
  totalForms: number;
  activeForms: number;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
};

export type DashboardForm = {
  id: string;
  name: string;
  status: DashboardFormStatus;
  submissionCount: number;
  createdAt: string;
};

export type DashboardRecentLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  domain: string;
  formName: string;
  status: DashboardLeadStatus;
  createdAt: string;
};

export type DashboardTrendPoint = {
  bucket: string;
  count: number;
};

export type DashboardOverviewData = {
  metrics: DashboardMetrics;
  statuses: Record<DashboardLeadStatus, number>;
  forms: DashboardForm[];
  recentLeads: DashboardRecentLead[];
  trend: DashboardTrendPoint[];
};

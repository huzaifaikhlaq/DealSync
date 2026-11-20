export type CompanyAccessStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "NOT_REQUESTED";

export type CompanyFormStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type CompanyLeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export type AdminOverviewData = {
  metrics: {
    totalCompanies: number;
    approvedCompanies: number;
    pendingRequests: number;
    rejectedRequests: number;
    totalForms: number;
    totalLeads: number;
  };
  recentCompanies: Array<{
    id: string;
    name: string;
    email: string;
    websiteUrl: string | null;
    accessStatus: CompanyAccessStatus;
    createdAt: string;
  }>;
  recentRequests: Array<{
    id: string;
    user: { id: string; name: string; email: string };
    websiteUrl: string;
    message: string | null;
    createdAt: string;
  }>;
};

export type AdminCompanyListData = {
  items: Array<{
    id: string;
    name: string;
    email: string;
    websiteUrl: string | null;
    accessStatus: CompanyAccessStatus;
    totalForms: number;
    totalLeads: number;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminCompanyDetailsData = {
  owner: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  accessRequest: {
    status: Exclude<CompanyAccessStatus, "NOT_REQUESTED">;
    websiteUrl: string;
    message: string | null;
    reviewNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
  } | null;
  analytics: {
    totalForms: number;
    formStatuses: Record<CompanyFormStatus, number>;
    totalLeads: number;
    leadStatuses: Record<CompanyLeadStatus, number>;
  };
  forms: {
    items: Array<{
      id: string;
      name: string;
      status: CompanyFormStatus;
      submissionCount: number;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  leads: {
    items: Array<{
      id: string;
      name: string;
      email: string;
      company: string;
      formName: string;
      status: CompanyLeadStatus;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

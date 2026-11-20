import "server-only";

import { extractContactDetails } from "@/features/leads/utils/contact-data";
import { ApiError } from "@/lib/http/api-error";

import type {
  CompanyAdminDetailsInput,
  CompanyAdminListInput,
} from "../schemas/company-admin.schema";
import type {
  AdminCompanyDetailsData,
  AdminCompanyListData,
  AdminOverviewData,
  CompanyAccessStatus,
  CompanyFormStatus,
  CompanyLeadStatus,
} from "../types/company-admin";
import { adminCompanyRepository } from "./admin-company.repository";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export function summarizeAdminOverview(input: {
  totalCompanies: number;
  totalForms: number;
  totalLeads: number;
  requestGroups: Array<{ status: RequestStatus; count: number }>;
}) {
  const requests = new Map(
    input.requestGroups.map((group) => [group.status, group.count]),
  );

  return {
    totalCompanies: input.totalCompanies,
    approvedCompanies: requests.get("APPROVED") ?? 0,
    pendingRequests: requests.get("PENDING") ?? 0,
    rejectedRequests: requests.get("REJECTED") ?? 0,
    totalForms: input.totalForms,
    totalLeads: input.totalLeads,
  };
}

function statusCounts<T extends string>(
  values: ReadonlyArray<{ status: T; count: number }>,
  statuses: readonly T[],
): Record<T, number> {
  const result = Object.fromEntries(statuses.map((status) => [status, 0])) as
    Record<T, number>;

  for (const value of values) result[value.status] = value.count;
  return result;
}

function getAccessStatus(
  status: "PENDING" | "APPROVED" | "REJECTED" | null,
): CompanyAccessStatus {
  return status ?? "NOT_REQUESTED";
}

export const adminCompanyService = {
  async getOverview(): Promise<AdminOverviewData> {
    const data = await adminCompanyRepository.getOverview();

    return {
      metrics: summarizeAdminOverview(data),
      recentCompanies: data.recentCompanies.map((company) => ({
        id: company.id,
        name: company.name,
        email: company.email,
        websiteUrl: company.accessRequest?.websiteUrl ?? null,
        accessStatus: getAccessStatus(company.accessRequest?.status ?? null),
        createdAt: company.createdAt.toISOString(),
      })),
      recentRequests: data.recentRequests.map((request) => ({
        id: request.id,
        user: request.user,
        websiteUrl: request.websiteUrl,
        message: request.message,
        createdAt: request.createdAt.toISOString(),
      })),
    };
  },

  async listCompanies(
    input: CompanyAdminListInput,
  ): Promise<AdminCompanyListData> {
    const result = await adminCompanyRepository.listCompanies(input);

    return {
      items: result.items.map((company) => ({
        id: company.id,
        name: company.name,
        email: company.email,
        websiteUrl: company.accessRequest?.websiteUrl ?? null,
        accessStatus: getAccessStatus(company.accessRequest?.status ?? null),
        totalForms: company.totalForms,
        totalLeads: company.totalLeads,
        createdAt: company.createdAt.toISOString(),
      })),
      pagination: {
        page: input.page,
        limit: input.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / input.limit)),
      },
    };
  },

  async getCompanyDetails(
    userId: string,
    input: CompanyAdminDetailsInput,
  ): Promise<AdminCompanyDetailsData> {
    const result = await adminCompanyRepository.getCompanyDetails(userId, input);

    if (!result) {
      throw new ApiError(404, "COMPANY_NOT_FOUND", "Company not found");
    }

    const formStatuses = statusCounts<CompanyFormStatus>(
      result.formGroups,
      ["DRAFT", "ACTIVE", "ARCHIVED"],
    );
    const leadStatuses = statusCounts<CompanyLeadStatus>(
      result.leadGroups,
      ["NEW", "CONTACTED", "CLOSED"],
    );
    const accessRequest = result.owner.accessRequest;

    return {
      owner: {
        id: result.owner.id,
        name: result.owner.name,
        email: result.owner.email,
        createdAt: result.owner.createdAt.toISOString(),
      },
      accessRequest: accessRequest
        ? {
            ...accessRequest,
            createdAt: accessRequest.createdAt.toISOString(),
            reviewedAt: accessRequest.reviewedAt?.toISOString() ?? null,
          }
        : null,
      analytics: {
        totalForms: Object.values(formStatuses).reduce(
          (sum, count) => sum + count,
          0,
        ),
        formStatuses,
        totalLeads: Object.values(leadStatuses).reduce(
          (sum, count) => sum + count,
          0,
        ),
        leadStatuses,
      },
      forms: {
        items: result.forms.map((form) => ({
          id: form.id,
          name: form.name,
          status: form.status,
          submissionCount: form._count.submissions,
          createdAt: form.createdAt.toISOString(),
        })),
        pagination: {
          page: result.formPage,
          limit: result.formLimit,
          total: result.formTotal,
          totalPages: Math.max(1, Math.ceil(result.formTotal / result.formLimit)),
        },
      },
      leads: {
        items: result.submissions.map((submission) => {
          const contact = extractContactDetails(submission.data);

          return {
            id: submission.id,
            name: contact.name,
            email: contact.email,
            company: contact.company,
            formName: submission.form.name,
            status: submission.status,
            createdAt: submission.createdAt.toISOString(),
          };
        }),
        pagination: {
          page: result.leadPage,
          limit: result.leadLimit,
          total: result.leadTotal,
          totalPages: Math.max(1, Math.ceil(result.leadTotal / result.leadLimit)),
        },
      },
    };
  },
};

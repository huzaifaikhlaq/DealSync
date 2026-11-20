"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, ClipboardList, Users } from "lucide-react";

import { useDashboardSearch } from "@/components/layout/dashboard/dashboard-context";
import type {
  AdminCompanyDetailsData,
  CompanyFormStatus,
  CompanyLeadStatus,
} from "../types/company-admin";
import {
  AccessStatusBadge,
  AdminError,
  AdminLoading,
  AdminMetricGrid,
  AdminPagination,
  FormStatusBadge,
  LeadStatusBadge,
  formatAdminDate,
} from "./admin-shared";

type DetailsResponse = {
  success: boolean;
  data?: AdminCompanyDetailsData;
  error?: { message?: string };
};

type FilterStatus<T extends string> = "ALL" | T;

export function AdminCompanyDetails({ userId }: { userId: string }) {
  const searchQuery = useDashboardSearch();
  const [formStatus, setFormStatus] =
    useState<FilterStatus<CompanyFormStatus>>("ALL");
  const [leadStatus, setLeadStatus] =
    useState<FilterStatus<CompanyLeadStatus>>("ALL");
  const [formPagination, setFormPagination] = useState({
    filterKey: "",
    page: 1,
  });
  const [leadPagination, setLeadPagination] = useState({
    filterKey: "",
    page: 1,
  });
  const formFilterKey = userId + "\u0000" + formStatus;
  const leadFilterKey =
    userId + "\u0000" + leadStatus + "\u0000" + searchQuery.trim();
  const formPage =
    formPagination.filterKey === formFilterKey ? formPagination.page : 1;
  const leadPage =
    leadPagination.filterKey === leadFilterKey ? leadPagination.page : 1;
  const queryKey = [
    userId,
    formStatus,
    formPage,
    leadStatus,
    leadPage,
    searchQuery.trim(),
  ].join("\u0000");
  const [result, setResult] = useState<{
    queryKey: string;
    data?: AdminCompanyDetailsData;
    error?: string;
  } | null>(null);
  const currentResult = result?.queryKey === queryKey ? result : null;
  const data = currentResult?.data ?? null;
  const loading = currentResult === null;
  const error = currentResult?.error ?? "";

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const params = new URLSearchParams({
      formPage: String(formPage),
      formLimit: "10",
      leadPage: String(leadPage),
      leadLimit: "25",
    });
    if (formStatus !== "ALL") params.set("formStatus", formStatus);
    if (leadStatus !== "ALL") params.set("leadStatus", leadStatus);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    void fetch(
      "/api/admin/companies/" +
        encodeURIComponent(userId) +
        "?" +
        params.toString(),
      {
        cache: "no-store",
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        const result = (await response.json()) as DetailsResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.error?.message ?? "Unable to load company details",
          );
        }
        if (active) setResult({ queryKey, data: result.data });
      })
      .catch((cause: unknown) => {
        if (active && !controller.signal.aborted) {
          setResult({
            queryKey,
            error:
              cause instanceof Error
                ? cause.message
                : "Unable to load company details",
          });
        }
      })

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    formPage,
    formStatus,
    leadPage,
    leadStatus,
    queryKey,
    searchQuery,
    userId,
  ]);

  function changeFormPage(page: number) {
    setFormPagination({ filterKey: formFilterKey, page });
  }

  function changeLeadPage(page: number) {
    setLeadPagination({ filterKey: leadFilterKey, page });
  }

  if (loading && !data) {
    return <AdminLoading label="Loading company details…" />;
  }

  return (
    <div className="dashboard-page admin-page">
      <div className="admin-page-heading">
        <div>
          <Link className="admin-back-link" href="/admin/companies">
            <ArrowLeft size={15} aria-hidden="true" />
            Companies
          </Link>
          <p className="admin-eyebrow">COMPANY DETAILS</p>
          <h1>{data?.owner.name ?? "Company details"}</h1>
          <p>
            Read-only view of owner access, forms, and lead activity.
          </p>
        </div>
      </div>

      {error && <AdminError message={error} />}
      {data && (
        <>
          <section className="admin-owner-panel">
            <div className="admin-owner-heading">
              <span className="admin-owner-icon">
                <Building2 size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="admin-eyebrow">OWNER ACCOUNT</p>
                <h2>{data.owner.name}</h2>
                <a href={"mailto:" + data.owner.email}>{data.owner.email}</a>
              </div>
              <AccessStatusBadge
                status={data.accessRequest?.status ?? "NOT_REQUESTED"}
              />
            </div>
            <dl className="admin-owner-facts">
              <div>
                <dt>Registered</dt>
                <dd>
                  <time dateTime={data.owner.createdAt}>
                    {formatAdminDate(data.owner.createdAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Website</dt>
                <dd>
                  {data.accessRequest ? (
                    <a
                      href={data.accessRequest.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.accessRequest.websiteUrl}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
              <div>
                <dt>Request submitted</dt>
                <dd>
                  {data.accessRequest ? (
                    <time dateTime={data.accessRequest.createdAt}>
                      {formatAdminDate(data.accessRequest.createdAt)}
                    </time>
                  ) : (
                    "No access request"
                  )}
                </dd>
              </div>
              <div>
                <dt>Reviewed</dt>
                <dd>
                  {data.accessRequest?.reviewedAt ? (
                    <time dateTime={data.accessRequest.reviewedAt}>
                      {formatAdminDate(data.accessRequest.reviewedAt)}
                    </time>
                  ) : (
                    "Not reviewed"
                  )}
                </dd>
              </div>
            </dl>
            {data.accessRequest?.message && (
              <div className="admin-request-copy">
                <h3>Request message</h3>
                <p>{data.accessRequest.message}</p>
              </div>
            )}
            {data.accessRequest?.reviewNote && (
              <div className="admin-review-note">
                <h3>Admin review note</h3>
                <p>{data.accessRequest.reviewNote}</p>
              </div>
            )}
          </section>

          <AdminMetricGrid
            items={[
              {
                label: "Total forms",
                value: data.analytics.totalForms,
                description:
                  data.analytics.formStatuses.DRAFT +
                  " draft · " +
                  data.analytics.formStatuses.ARCHIVED +
                  " archived",
                icon: ClipboardList,
                tone: "purple",
              },
              {
                label: "Active forms",
                value: data.analytics.formStatuses.ACTIVE,
                description: "Currently available forms",
                icon: ClipboardList,
                tone: "green",
              },
              {
                label: "Total leads",
                value: data.analytics.totalLeads,
                description: "Submissions across this company",
                icon: Users,
                tone: "blue",
              },
              {
                label: "New leads",
                value: data.analytics.leadStatuses.NEW,
                description:
                  data.analytics.leadStatuses.CONTACTED +
                  " contacted · " +
                  data.analytics.leadStatuses.CLOSED +
                  " closed",
                icon: Users,
                tone: "amber",
              },
            ]}
          />

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Forms</h2>
                <p>Form status and the number of submissions each received.</p>
              </div>
              <label className="admin-filter compact">
                <span>Form status</span>
                <select
                  value={formStatus}
                  onChange={(event) =>
                    setFormStatus(
                      event.target.value as FilterStatus<CompanyFormStatus>,
                    )
                  }
                >
                  <option value="ALL">All forms</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>
            </div>

            {data.forms.items.length === 0 ? (
              <p className="admin-empty">No forms match this status.</p>
            ) : (
              <>
                <div
                  className="admin-table-scroll"
                  role="region"
                  aria-label="Company forms"
                  tabIndex={0}
                >
                  <table className="admin-table">
                    <caption className="sr-only">Company forms</caption>
                    <thead>
                      <tr>
                        <th scope="col">Form</th>
                        <th scope="col">Status</th>
                        <th scope="col">Submissions</th>
                        <th scope="col">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.forms.items.map((form) => (
                        <tr key={form.id}>
                          <th scope="row">{form.name}</th>
                          <td>
                            <FormStatusBadge status={form.status} />
                          </td>
                          <td>{form.submissionCount.toLocaleString()}</td>
                          <td>
                            <time dateTime={form.createdAt}>
                              {formatAdminDate(form.createdAt)}
                            </time>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AdminPagination
                  page={data.forms.pagination.page}
                  totalPages={data.forms.pagination.totalPages}
                  label="Form pages"
                  onPageChange={changeFormPage}
                />
              </>
            )}
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Leads and submissions</h2>
                <p>Lead summaries and current status. Records are read-only.</p>
              </div>
              <label className="admin-filter compact">
                <span>Lead status</span>
                <select
                  value={leadStatus}
                  onChange={(event) =>
                    setLeadStatus(
                      event.target.value as FilterStatus<CompanyLeadStatus>,
                    )
                  }
                >
                  <option value="ALL">All leads</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
            </div>

            {data.leads.items.length === 0 ? (
              <p className="admin-empty">
                No leads match this status or search.
              </p>
            ) : (
              <>
                <div
                  className="admin-table-scroll"
                  role="region"
                  aria-label="Company leads and submissions"
                  tabIndex={0}
                >
                  <table className="admin-table">
                    <caption className="sr-only">
                      Company leads and submissions
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Lead</th>
                        <th scope="col">Email</th>
                        <th scope="col">Company</th>
                        <th scope="col">Form</th>
                        <th scope="col">Status</th>
                        <th scope="col">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leads.items.map((lead) => (
                        <tr key={lead.id}>
                          <th scope="row">{lead.name}</th>
                          <td>{lead.email || "—"}</td>
                          <td>{lead.company || "—"}</td>
                          <td>{lead.formName}</td>
                          <td>
                            <LeadStatusBadge status={lead.status} />
                          </td>
                          <td>
                            <time dateTime={lead.createdAt}>
                              {formatAdminDate(lead.createdAt)}
                            </time>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AdminPagination
                  page={data.leads.pagination.page}
                  totalPages={data.leads.pagination.totalPages}
                  label="Lead pages"
                  onPageChange={changeLeadPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

import { useDashboardSearch } from "@/components/layout/dashboard/dashboard-context";
import type {
  AdminCompanyListData,
  CompanyAccessStatus,
} from "../types/company-admin";
import {
  AccessStatusBadge,
  AdminError,
  AdminLoading,
  AdminPagination,
  formatAdminDate,
} from "./admin-shared";

type CompaniesResponse = {
  success: boolean;
  data?: AdminCompanyListData;
  error?: { message?: string };
};

export function AdminCompanies() {
  const searchQuery = useDashboardSearch();
  const [status, setStatus] = useState<"ALL" | CompanyAccessStatus>("ALL");
  const [pagination, setPagination] = useState({ filterKey: "", page: 1 });
  const filterKey = status + "\u0000" + searchQuery.trim();
  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const queryKey = filterKey + "\u0000" + page;
  const [result, setResult] = useState<{
    queryKey: string;
    data?: AdminCompanyListData;
    error?: string;
  } | null>(null);
  const currentResult = result?.queryKey === queryKey ? result : null;
  const data = currentResult?.data ?? null;
  const loading = currentResult === null;
  const error = currentResult?.error ?? "";

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (status !== "ALL") params.set("status", status);

      void fetch("/api/admin/companies?" + params.toString(), {
        cache: "no-store",
        signal: controller.signal,
      })
        .then(async (response) => {
          const result = (await response.json()) as CompaniesResponse;
          if (!response.ok || !result.success || !result.data) {
            throw new Error(result.error?.message ?? "Unable to load companies");
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
                  : "Unable to load companies",
            });
          }
        })
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [page, queryKey, searchQuery, status]);

  function changePage(nextPage: number) {
    setPagination({ filterKey, page: nextPage });
  }

  return (
    <div className="dashboard-page admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">COMPANY DIRECTORY</p>
          <h1>Companies</h1>
          <p>Browse registered owners and review their platform activity.</p>
        </div>
        <div className="admin-directory-total">
          <Building2 size={17} aria-hidden="true" />
          <span>
            {data?.pagination.total.toLocaleString() ?? "—"} companies
          </span>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-filter-row">
          <label className="admin-filter">
            <span>Access status</span>
            <select
              value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "ALL" | CompanyAccessStatus)
                }
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="NOT_REQUESTED">Not requested</option>
            </select>
          </label>
          <p className="admin-filter-hint">
            Search by company name, owner email, or registered website.
          </p>
        </div>

        {error && <AdminError message={error} />}
        {loading && <AdminLoading label="Loading companies…" />}
        {!loading && data && data.items.length === 0 && (
          <p className="admin-empty">
            No companies match this search and access status.
          </p>
        )}

        {data && data.items.length > 0 && (
          <>
            <div
              className="admin-table-scroll"
              role="region"
              aria-label="Registered companies"
              tabIndex={0}
            >
              <table className="admin-table">
                <caption className="sr-only">Registered companies</caption>
                <thead>
                  <tr>
                    <th scope="col">Company / owner</th>
                    <th scope="col">Email address</th>
                    <th scope="col">Website</th>
                    <th scope="col">Access status</th>
                    <th scope="col">Forms</th>
                    <th scope="col">Leads</th>
                    <th scope="col">Registered</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((company) => (
                    <tr key={company.id}>
                      <th scope="row">
                        <Link
                          className="admin-company-link"
                          href={"/admin/companies/" + company.id}
                        >
                          {company.name}
                        </Link>
                      </th>
                      <td>{company.email}</td>
                      <td className="admin-url-cell">
                        {company.websiteUrl ?? "—"}
                      </td>
                      <td>
                        <AccessStatusBadge status={company.accessStatus} />
                      </td>
                      <td>{company.totalForms.toLocaleString()}</td>
                      <td>{company.totalLeads.toLocaleString()}</td>
                      <td>
                        <time dateTime={company.createdAt}>
                          {formatAdminDate(company.createdAt)}
                        </time>
                      </td>
                      <td>
                        <Link
                          className="admin-view-link"
                          href={"/admin/companies/" + company.id}
                        >
                          View details
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              label="Company pages"
              onPageChange={changePage}
            />
          </>
        )}
      </section>
    </div>
  );
}

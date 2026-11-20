"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileCheck2,
  Users,
} from "lucide-react";

import type { AdminOverviewData } from "../types/company-admin";
import {
  AccessStatusBadge,
  AdminError,
  AdminLoading,
  AdminMetricGrid,
  formatAdminDate,
} from "./admin-shared";

type OverviewResponse = {
  success: boolean;
  data?: AdminOverviewData;
  error?: { message?: string };
};

export function AdminOverview() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setError("");
      try {
        const response = await fetch("/api/admin/overview", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as OverviewResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error?.message ?? "Unable to load overview");
        }
        if (active) setData(result.data);
      } catch (cause) {
        if (active && !controller.signal.aborted) {
          setError(
            cause instanceof Error ? cause.message : "Unable to load overview",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (loading) return <AdminLoading label="Loading platform overview…" />;

  return (
    <div className="dashboard-page admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">DEALSYNC CONTROL</p>
          <h1>Platform overview</h1>
          <p>Company access, forms, and incoming leads across DealSync.</p>
        </div>
        <Link className="admin-button primary" href="/admin/requests">
          <FileCheck2 size={16} aria-hidden="true" />
          Review company requests
        </Link>
      </div>

      {error && <AdminError message={error} />}
      {data && (
        <>
          <AdminMetricGrid
            items={[
              {
                label: "Registered companies",
                value: data.metrics.totalCompanies,
                description: "All OWNER accounts",
                icon: Building2,
                tone: "purple",
              },
              {
                label: "Approved companies",
                value: data.metrics.approvedCompanies,
                description: "Access requests approved",
                icon: CheckCircle2,
                tone: "green",
              },
              {
                label: "Pending requests",
                value: data.metrics.pendingRequests,
                description: "Waiting for review",
                icon: Clock3,
                tone: "amber",
              },
              {
                label: "Rejected requests",
                value: data.metrics.rejectedRequests,
                description: "Access requests rejected",
                icon: FileCheck2,
                tone: "red",
              },
              {
                label: "Forms",
                value: data.metrics.totalForms,
                description: "Across registered companies",
                icon: ClipboardList,
                tone: "blue",
              },
              {
                label: "Submissions",
                value: data.metrics.totalLeads,
                description: "Across registered companies",
                icon: Users,
                tone: "purple",
              },
            ]}
          />

          <div className="admin-two-column">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Recent company registrations</h2>
                  <p>Newest owner accounts across the platform.</p>
                </div>
                <Link href="/admin/companies">View all</Link>
              </div>
              {data.recentCompanies.length === 0 ? (
                <p className="admin-empty">No companies are registered yet.</p>
              ) : (
                <ul className="admin-record-list">
                  {data.recentCompanies.map((company) => (
                    <li key={company.id}>
                      <div className="admin-record-copy">
                        <Link href={"/admin/companies/" + company.id}>
                          {company.name}
                        </Link>
                        <span>{company.email}</span>
                        <small>
                          {company.websiteUrl ?? "Website not provided"}
                        </small>
                      </div>
                      <div className="admin-record-meta">
                        <AccessStatusBadge status={company.accessStatus} />
                        <time dateTime={company.createdAt}>
                          {formatAdminDate(company.createdAt)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Recent pending requests</h2>
                  <p>Company access requests that need review.</p>
                </div>
                <Link href="/admin/requests">Open queue</Link>
              </div>
              {data.recentRequests.length === 0 ? (
                <p className="admin-empty">No pending company requests.</p>
              ) : (
                <ul className="admin-record-list">
                  {data.recentRequests.map((request) => (
                    <li key={request.id}>
                      <div className="admin-record-copy">
                        <strong>{request.user.name}</strong>
                        <span>{request.user.email}</span>
                        <small>{request.websiteUrl}</small>
                      </div>
                      <time dateTime={request.createdAt}>
                        {formatAdminDate(request.createdAt)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type RequestRecord = {
  id: string;
  websiteUrl: string;
  message: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

type RequestListResponse = {
  success: boolean;
  data: RequestRecord[];
  error?: {
    message?: string;
  };
};

async function fetchPendingRequests(signal?: AbortSignal) {
  const response = await fetch("/api/admin/account-requests", {
    cache: "no-store",
    signal,
  });
  const result = (await response.json()) as RequestListResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message ?? "Unable to load requests");
  }

  return result.data;
}

export function AdminRequests() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      setRequests(await fetchPendingRequests());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load requests",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    void fetchPendingRequests(controller.signal)
      .then((records) => {
        if (active) setRequests(records);
      })
      .catch((cause: unknown) => {
        if (active && !controller.signal.aborted) {
          setError(
            cause instanceof Error ? cause.message : "Unable to load requests",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function review(
    request: RequestRecord,
    decision: "APPROVED" | "REJECTED",
  ) {
    setBusyId(request.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/account-requests/" + request.id,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            decision,
            note: notes[request.id] ?? "",
          }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message ?? "Review failed");
      }

      setRequests((current) => current.filter((item) => item.id !== request.id));
      setSuccess(
        decision === "APPROVED"
          ? "Access approved for " + request.user.name + "."
          : "Access request rejected for " + request.user.name + ".",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Review failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="dashboard-page admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ACCESS REVIEW</p>
          <h1>Company Requests</h1>
          <p>Review website owners requesting access to DealSync.</p>
        </div>
        <span className="admin-directory-total">
          {loading ? "…" : requests.length.toLocaleString()} pending requests
        </span>
        <button
          className="admin-button secondary"
          type="button"
          disabled={loading}
          onClick={() => void load()}
        >
          <RefreshCw size={15} aria-hidden="true" />
          Refresh requests
        </button>
      </div>

      {error && (
        <div className="admin-error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <p className="admin-success" role="status">
          {success}
        </p>
      )}
      {loading && (
        <div className="admin-state" role="status">
          <span className="admin-loader" aria-hidden="true" />
          <p>Loading company requests…</p>
        </div>
      )}
      {!loading && !error && requests.length === 0 && (
        <div className="admin-panel">
          <p className="admin-empty">No pending company requests.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <section className="admin-request-list" aria-label="Pending company requests">
          {requests.map((item) => (
            <article className="admin-request-card" key={item.id}>
              <h2>{item.user.name}</h2>
              <p>{item.user.email}</p>
              <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                {item.websiteUrl}
              </a>
              <time dateTime={item.createdAt}>
                Requested {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(item.createdAt))}
              </time>
              {item.message && (
                <p className="admin-request-message">{item.message}</p>
              )}

              <label className="admin-request-note">
                <span>Admin review note (optional)</span>
                <textarea
                  value={notes[item.id] ?? ""}
                  maxLength={1000}
                  onChange={(event) =>
                    setNotes((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="admin-request-actions">
                <button
                  className="admin-button approve"
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void review(item, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="admin-button reject"
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void review(item, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

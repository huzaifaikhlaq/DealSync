
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export function AdminRequests() {
    const [requests, setRequests] = useState<RequestRecord[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState("");

    async function load() {
        setError("");

        try {
            const response = await fetch(
                "/api/admin/account-requests",
                { cache: "no-store" },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error?.message ?? "Unable to load requests",
                );
            }

            setRequests(result.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to load requests",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    async function review(
        requestId: string,
        decision: "APPROVED" | "REJECTED",
    ) {
        setBusyId(requestId);
        setError("");

        try {
            const response = await fetch(
                `/api/admin/account-requests/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        decision,
                        note: notes[requestId] ?? "",
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error?.message ?? "Review failed",
                );
            }

            await load();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Review failed",
            );
        } finally {
            setBusyId(null);
        }
    }

    return (
        <main className="min-h-screen bg-[#faf8ff] px-5 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/"
                            className="text-sm font-semibold text-[#4f46e5]"
                        >
                            DealSync
                        </Link>
                        <h1 className="mt-2 text-3xl font-semibold">
                            Account approvals
                        </h1>
                        <p className="mt-2 text-sm text-[#55586c]">
                            Review website owners requesting access.
                        </p>
                    </div>

                    <button
                        className="rounded-lg border bg-white px-4 py-2 text-sm"
                        onClick={() => void load()}
                    >
                        Refresh
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mt-6 text-red-600">
                        {error}
                    </p>
                )}

                {loading && (
                    <p className="mt-6 text-sm">Loading requests...</p>
                )}

                {!loading && requests.length === 0 && (
                    <p className="mt-8 rounded-xl border bg-white p-8 text-center text-[#55586c]">
                        No pending account requests.
                    </p>
                )}

                <div className="mt-8 grid gap-4">
                    {requests.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-xl border border-[#e8e6f2] bg-white p-6 shadow-sm"
                        >
                            <h2 className="text-lg font-semibold">
                                {item.user.name}
                            </h2>

                            <p className="text-sm text-[#55586c]">
                                {item.user.email}
                            </p>

                            <a
                                href={item.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block break-all text-sm text-[#4f46e5] underline"
                            >
                                {item.websiteUrl}
                            </a>

                            {item.message && (
                                <p className="mt-4 whitespace-pre-wrap text-sm">
                                    {item.message}
                                </p>
                            )}

                            <textarea
                                aria-label={`Review note for ${item.user.name}`}
                                placeholder="Review note (optional)"
                                value={notes[item.id] ?? ""}
                                maxLength={1000}
                                onChange={(event) =>
                                    setNotes((current) => ({
                                        ...current,
                                        [item.id]: event.target.value,
                                    }))
                                }
                                className="mt-5 w-full rounded-lg border p-3 text-sm"
                                rows={2}
                            />

                            <div className="mt-4 flex gap-3">
                                <button
                                    disabled={busyId !== null}
                                    onClick={() => void review(item.id, "APPROVED")}
                                    className="rounded-lg bg-[#4f46e5] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                                >
                                    Approve
                                </button>

                                <button
                                    disabled={busyId !== null}
                                    onClick={() => void review(item.id, "REJECTED")}
                                    className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-700 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}

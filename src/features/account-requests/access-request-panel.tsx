
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

type AccountRequest = {
    status: RequestStatus;
    websiteUrl: string;
    reviewNote: string | null;
};

export function AccessRequestPanel({
    initialRequest,
}: {
    initialRequest: AccountRequest | null;
}) {
    const [request, setRequest] = useState(initialRequest);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setPending(true);
        setError("");

        try {
            const response = await fetch(
                "/api/account-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        websiteUrl,
                        message,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error?.message ?? "Request failed",
                );
            }

            setRequest(result.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-4 py-12">
            <section className="w-full max-w-lg rounded-2xl border border-[#e8e6f2] bg-white p-8 shadow-sm">
                <Link
                    href="/"
                    className="text-xl font-bold text-[#4f46e5]"
                >
                    DealSync
                </Link>

                <h1 className="mt-7 text-2xl font-semibold">
                    Account access
                </h1>

                {!request && (
                    <>
                        <p className="mt-2 text-sm text-[#55586c]">
                            Submit your website to request access.
                            Once approved, you can create multiple forms
                            without requesting permission again.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <label className="block text-sm font-medium">
                                Website URL
                                <input
                                    type="url"
                                    required
                                    maxLength={500}
                                    value={websiteUrl}
                                    onChange={(event) =>
                                        setWebsiteUrl(event.target.value)
                                    }
                                    placeholder="https://example.com"
                                    className="mt-2 w-full rounded-lg border border-[#d9d6e7] px-4 py-3"
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Message (optional)
                                <textarea
                                    value={message}
                                    maxLength={1000}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    rows={4}
                                    className="mt-2 w-full rounded-lg border border-[#d9d6e7] px-4 py-3"
                                />
                            </label>

                            {error && (
                                <p role="alert" className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <button
                                disabled={pending}
                                className="w-full rounded-lg bg-[#4f46e5] px-4 py-3 font-medium text-white disabled:opacity-60"
                            >
                                {pending ? "Submitting..." : "Request access"}
                            </button>
                        </form>
                    </>
                )}

                {request?.status === "PENDING" && (
                    <div className="mt-6 rounded-xl bg-amber-50 p-5">
                        <h2 className="font-semibold text-amber-900">
                            Waiting for approval
                        </h2>
                        <p className="mt-2 text-sm text-amber-800">
                            Your request for {request.websiteUrl} is
                            being reviewed by the DealSync admin.
                        </p>
                        <Link
                            href="/access"
                            className="mt-4 inline-block text-sm font-semibold underline"
                        >
                            Refresh status
                        </Link>
                    </div>
                )}

                {request?.status === "REJECTED" && (
                    <div className="mt-6 rounded-xl bg-red-50 p-5">
                        <h2 className="font-semibold text-red-800">
                            Request rejected
                        </h2>
                        <p className="mt-2 text-sm">
                            {request.reviewNote ??
                                "Your account request was not approved."}
                        </p>
                    </div>
                )}

                {request?.status === "APPROVED" && (
                    <Link
                        href="/dashboard"
                        className="mt-6 inline-block rounded-lg bg-[#4f46e5] px-5 py-3 text-white"
                    >
                        Open dashboard
                    </Link>
                )}
            </section>
        </main>
    );
}

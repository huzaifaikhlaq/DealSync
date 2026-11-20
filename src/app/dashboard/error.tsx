"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dashboard-page">
      <section className="panel dashboard-error" role="alert">
        <h1>Dashboard data could not be loaded</h1>
        <p>Try again. If the problem continues, contact your administrator.</p>
        <button className="primary-button" type="button" onClick={reset}>
          Retry
        </button>
      </section>
    </div>
  );
}

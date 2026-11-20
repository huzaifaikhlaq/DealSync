"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";

import type { DashboardGranularity, DashboardRange } from "../types/dashboard";

export function ReportingPeriodSelect({
  range,
  granularity,
}: {
  range: DashboardRange;
  granularity: DashboardGranularity;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateRange(nextRange: DashboardRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", nextRange);
    params.set("granularity", granularity);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <label className="select-control">
      <CalendarDays size={17} aria-hidden="true" />
      <select
        aria-label="Reporting date range"
        value={range}
        disabled={isPending}
        onChange={(event) => updateRange(event.target.value as DashboardRange)}
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </label>
  );
}

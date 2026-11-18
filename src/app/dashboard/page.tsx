import { OverviewContent } from "@/features/dashboard/components/overview-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Overview | DealSync",
  description:
    "Track lead capture, pipeline performance, and team activity in DealSync.",
};

export default function DashboardPage() {
  return <OverviewContent />;
}

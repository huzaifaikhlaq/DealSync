import { Dashboard } from "@/features/dashboard/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Overview | DealSync",
  description: "Track lead capture, pipeline performance, and team activity in DealSync.",
};

export default function DashboardPage() {
  return <Dashboard />;
}

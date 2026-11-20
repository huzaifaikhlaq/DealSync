import type { Metadata } from "next";
import { AdminOverview } from "@/features/companies/components/admin-overview";

export const metadata: Metadata = {
  title: "Admin Overview | DealSync",
  description: "Company access and platform activity across DealSync.",
};

export default function AdminPage() {
  return <AdminOverview />;
}


import type { Metadata } from "next";
import { AdminRequests } from "@/features/account-requests/admin-requests";

export const metadata: Metadata = {
  title: "Company Requests | DealSync",
};

export default async function AdminRequestsPage() {
  return <AdminRequests />;
}

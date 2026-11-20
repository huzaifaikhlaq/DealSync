import type { Metadata } from "next";
import { AdminCompanies } from "@/features/companies/components/admin-companies";

export const metadata: Metadata = {
  title: "Companies | DealSync",
};

export default function AdminCompaniesPage() {
  return <AdminCompanies />;
}

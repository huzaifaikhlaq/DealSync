import type { Metadata } from "next";
import { AdminCompanyDetails } from "@/features/companies/components/admin-company-details";

export const metadata: Metadata = {
  title: "Company Details | DealSync",
};

export default async function AdminCompanyDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminCompanyDetails userId={userId} />;
}

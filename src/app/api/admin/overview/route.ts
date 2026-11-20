import { adminCompanyController } from "@/features/companies/server/admin-company.controller";

export const runtime = "nodejs";

export async function GET() {
  return adminCompanyController.overview();
}

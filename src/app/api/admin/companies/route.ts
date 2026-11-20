import type { NextRequest } from "next/server";

import { adminCompanyController } from "@/features/companies/server/admin-company.controller";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return adminCompanyController.list(request);
}

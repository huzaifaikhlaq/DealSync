import type { NextRequest } from "next/server";

import { adminCompanyController } from "@/features/companies/server/admin-company.controller";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  return adminCompanyController.details(request, userId);
}

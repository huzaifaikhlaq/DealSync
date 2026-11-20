import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, successResponse } from "@/lib/http/response";
import { requireAdmin } from "@/lib/security/authorize";

import {
  companyAdminDetailsSchema,
  companyAdminListSchema,
} from "../schemas/company-admin.schema";
import { adminCompanyService } from "./admin-company.service";

function queryValues(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const adminCompanyController = {
  async overview() {
    try {
      await requireAdmin();
      return successResponse(await adminCompanyService.getOverview());
    } catch (error) {
      return errorResponse(error);
    }
  },

  async list(request: NextRequest) {
    try {
      await requireAdmin();
      const input = companyAdminListSchema.parse(queryValues(request));
      return successResponse(await adminCompanyService.listCompanies(input));
    } catch (error) {
      return errorResponse(error);
    }
  },

  async details(request: NextRequest, userId: string) {
    try {
      await requireAdmin();
      const id = z.uuid().parse(userId);
      const input = companyAdminDetailsSchema.parse(queryValues(request));
      return successResponse(
        await adminCompanyService.getCompanyDetails(id, input),
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};

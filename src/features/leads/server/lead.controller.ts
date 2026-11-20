import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApprovedOwner } from "@/lib/security/authorize";
import { assertSameOrigin } from "@/lib/security/origin";
import { readJson } from "@/lib/http/read-json";
import { errorResponse, successResponse } from "@/lib/http/response";

import { listLeadsSchema, updateLeadSchema } from "../schemas/lead.schema";
import { createLeadReport } from "../utils/export-report";

import { leadService } from "./lead.service";

export const leadController = {
  async list(request: NextRequest) {
    try {
      const user = await requireApprovedOwner();

      const query = request.nextUrl.searchParams;

      const input = listLeadsSchema.parse({
        formId: query.get("formId") || undefined,
        status: query.get("status") || undefined,
        q: query.get("q") || undefined,
        range: query.get("range") || undefined,
        page: query.get("page") || undefined,
        limit: query.get("limit") || undefined,
      });

      const result = await leadService.list(user.id, input);

      return successResponse(result);
    } catch (error) {
      return errorResponse(error);
    }
  },

  async get(leadId: string) {
    try {
      z.uuid().parse(leadId);
      const user = await requireApprovedOwner();
      return successResponse(await leadService.get(user.id, leadId));
    } catch (error) {
      return errorResponse(error);
    }
  },

  async export(request: NextRequest) {
    try {
      const user = await requireApprovedOwner();
      const query = request.nextUrl.searchParams;
      const filters = listLeadsSchema.omit({ page: true, limit: true }).parse({
        formId: query.get("formId") || undefined,
        status: query.get("status") || undefined,
        q: query.get("q") || undefined,
        range: query.get("range") || undefined,
      });
      const leads = await leadService.export(user.id, filters);
      const csv = createLeadReport(
        leads.map((lead) => ({
          data: lead.data,
          formName: lead.form.name,
          status: lead.status,
          createdAt: lead.createdAt,
        })),
      );

      return new NextResponse(csv, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="dealsync-leads-${filters.range}.csv"`,
          "cache-control": "private, no-store",
        },
      });
    } catch (error) {
      return errorResponse(error);
    }
  },

  async update(request: NextRequest, leadId: string) {
    try {
      assertSameOrigin(request);
      z.uuid().parse(leadId);

      const user = await requireApprovedOwner();

      const input = updateLeadSchema.parse(await readJson(request));

      const updated = await leadService.update(user.id, leadId, input);

      return successResponse(updated);
    } catch (error) {
      return errorResponse(error);
    }
  },
};

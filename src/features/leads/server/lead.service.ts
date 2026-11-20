import "server-only";

import { ApiError } from "@/lib/http/api-error";

import { leadRepository } from "./lead.repository";

import type { ListLeadsInput, UpdateLeadInput } from "../schemas/lead.schema";

export const leadService = {
  list(userId: string, filters: ListLeadsInput) {
    return leadRepository.list(userId, filters);
  },

  export(userId: string, filters: Omit<ListLeadsInput, "page" | "limit">) {
    return leadRepository.export(userId, filters);
  },

  async get(userId: string, leadId: string) {
    const lead = await leadRepository.findOwned(userId, leadId);

    if (!lead) {
      throw new ApiError(404, "LEAD_NOT_FOUND", "Lead not found");
    }

    return lead;
  },

  async update(userId: string, leadId: string, data: UpdateLeadInput) {
    const lead = await leadRepository.updateOwned(userId, leadId, data);

    if (!lead) {
      throw new ApiError(404, "LEAD_NOT_FOUND", "Lead not found");
    }

    return lead;
  },
};

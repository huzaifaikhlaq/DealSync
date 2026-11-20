import type { NextRequest } from "next/server";
import { leadController } from "@/features/leads/server/lead.controller";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ leadId: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { leadId } = await context.params;
  return leadController.get(leadId);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { leadId } = await context.params;

  return leadController.update(request, leadId);
}

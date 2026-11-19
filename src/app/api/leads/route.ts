import type { NextRequest } from "next/server";
import { leadController } from "@/features/leads/server/lead.controller";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return leadController.list(request);
}

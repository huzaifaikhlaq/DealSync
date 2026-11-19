
import type { NextRequest } from "next/server";
import { accountRequestController } from
  "@/features/account-requests/account-request.controller";

export const runtime = "nodejs";

export async function GET() {
  return accountRequestController.mine();
}

export async function POST(request: NextRequest) {
  return accountRequestController.create(request);
}

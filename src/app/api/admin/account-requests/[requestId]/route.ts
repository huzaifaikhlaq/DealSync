
import type { NextRequest } from "next/server";
import { accountRequestController } from
  "@/features/account-requests/account-request.controller";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ requestId: string }>;
  },
) {
  const { requestId } = await context.params;

  return accountRequestController.review(
    request,
    requestId,
  );
}

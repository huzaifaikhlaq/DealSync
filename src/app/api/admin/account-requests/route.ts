
import { accountRequestController } from
  "@/features/account-requests/account-request.controller";

export const runtime = "nodejs";

export async function GET() {
  return accountRequestController.listPending();
}

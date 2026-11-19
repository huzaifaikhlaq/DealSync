import type { NextRequest } from "next/server";
import { authController } from "@/features/auth/server/auth.controller";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return authController.me(request);
}

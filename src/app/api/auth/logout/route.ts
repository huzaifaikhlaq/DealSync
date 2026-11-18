import { logoutController } from "@/features/auth/server/auth.controller";

export function POST(request: Request): Promise<Response> {
  return logoutController(request);
}

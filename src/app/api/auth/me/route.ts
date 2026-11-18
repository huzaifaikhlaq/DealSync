import { meController } from "@/features/auth/server/auth.controller";

export function GET(): Promise<Response> {
  return meController();
}


import type { NextRequest } from "next/server";
import { formController } from
  "@/features/forms/server/form.controller";

export const runtime = "nodejs";

export async function GET() {
  return formController.list();
}

export async function POST(request: NextRequest) {
  return formController.create(request);
}

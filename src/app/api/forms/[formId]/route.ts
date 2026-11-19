import type { NextRequest } from "next/server";
import { formController } from "@/features/forms/server/form.controller";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ formId: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { formId } = await context.params;
  return formController.get(formId);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { formId } = await context.params;
  return formController.update(request, formId);
}

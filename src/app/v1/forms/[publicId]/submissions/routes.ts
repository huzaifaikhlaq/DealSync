import type { NextRequest } from "next/server";

import { submissionController } from "@/features/submissions/server/submission.controller";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ publicId: string }>;
};

export async function OPTIONS(request: NextRequest, context: Context) {
  const { publicId } = await context.params;

  return submissionController.preflight(request, publicId);
}

export async function POST(request: NextRequest, context: Context) {
  const { publicId } = await context.params;

  return submissionController.submit(request, publicId);
}

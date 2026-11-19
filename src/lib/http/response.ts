
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

export function noStore<T extends NextResponse>(response: T): T {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function successResponse(
  data: unknown,
  status = 200,
): NextResponse {
  return noStore(
    NextResponse.json(
      { success: true, data },
      { status },
    ),
  );
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return noStore(
      NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.statusCode },
      ),
    );
  }

  if (error instanceof ZodError) {
    return noStore(
      NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            fields: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        { status: 422 },
      ),
    );
  }

  // Log internally, without returning database or stack details.
  console.error("Unhandled API error:", error);

  return noStore(
    NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    ),
  );
}

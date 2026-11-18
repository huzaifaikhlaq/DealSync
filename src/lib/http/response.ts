import { ApiError } from "./api-error";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export function successResponse<T>(data: T, status = 200): Response {
  return Response.json(data, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

export function errorResponse(error: unknown): Response {
  const apiError =
    error instanceof ApiError
      ? error
      : new ApiError(
          500,
          "internal_error",
          "Something went wrong. Please try again.",
        );

  return Response.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
        ...(apiError.details === undefined ? {} : { details: apiError.details }),
      },
    },
    {
      status: apiError.status,
      headers: NO_STORE_HEADERS,
    },
  );
}

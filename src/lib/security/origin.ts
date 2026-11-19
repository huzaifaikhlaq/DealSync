
import { ApiError } from "@/lib/http/api-error";

export function assertSameOrigin(request: Request): void {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }

  const trustedOrigin = new URL(appUrl).origin;
  const requestOrigin = request.headers.get("origin");

  if (requestOrigin !== trustedOrigin) {
    throw new ApiError(
      403,
      "INVALID_ORIGIN",
      "Request origin is not allowed",
    );
  }
}

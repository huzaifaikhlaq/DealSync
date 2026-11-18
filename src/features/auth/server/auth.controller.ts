import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { errorResponse, successResponse } from "@/lib/http/response";
import { readJson } from "@/lib/http/read-json";
import { isSameOriginRequest } from "@/lib/security/origin";
import { safeRedirect } from "@/lib/security/safe-redirect";
import type { AuthUser } from "../types/auth.types";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createAuthSession, deleteAuthSession, getAuthenticatedUser } from "./auth.session";
import { loginAccount, registerAccount } from "./auth.service";
import { consumeRateLimit, requestRateLimitKey } from "./auth.rate-limit";

type AuthSchema = typeof loginSchema | typeof registerSchema;

function isHtmlFormRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  return (
    !contentType.startsWith("application/json") &&
    request.headers.get("accept")?.includes("text/html") === true
  );
}

async function readFormPayload(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 16 * 1024) {
    throw new ApiError(413, "request_too_large", "The request is too large.");
  }

  try {
    const formData = await request.formData();
    const payload: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") payload[key] = value;
    }
    return payload;
  } catch {
    throw new ApiError(400, "invalid_form", "The submitted form could not be read.");
  }
}

async function parseInput<TSchema extends AuthSchema>(
  request: Request,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  const rawInput = isHtmlFormRequest(request)
    ? await readFormPayload(request)
    : await readJson(request);
  const parsed = schema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= [];
      fieldErrors[field].push(issue.message);
    }
    throw new ApiError(
      400,
      "invalid_input",
      "Check the highlighted fields and try again.",
      fieldErrors,
    );
  }

  return parsed.data as z.output<TSchema>;
}

function assertSameOrigin(request: Request): void {
  if (!isSameOriginRequest(request)) {
    throw new ApiError(403, "invalid_origin", "This request could not be verified.");
  }
}

function checkRateLimit(request: Request, action: string, limit: number, windowMs: number) {
  const result = consumeRateLimit(
    requestRateLimitKey(request, action),
    { limit, windowMs },
  );

  if (!result.allowed) {
    throw new ApiError(
      429,
      "rate_limited",
      "Too many attempts. Wait a little and try again.",
      { retryAfterSeconds: result.retryAfterSeconds },
    );
  }
}

function redirectForForm(request: Request, path: string): Response {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(path, request.url).toString(),
      "Cache-Control": "no-store",
    },
  });
}

function htmlErrorCode(error: unknown): string {
  if (!(error instanceof ApiError)) return "try-again";
  if (error.code === "account_exists") return "exists";
  if (error.code === "invalid_credentials") return "invalid";
  if (error.code === "rate_limited") return "rate-limited";
  return "invalid";
}

function formFailure(request: Request, mode: "login" | "register", error: unknown) {
  const page = mode === "register" ? "/register" : "/login";
  return redirectForForm(request, page + "?error=" + htmlErrorCode(error));
}

async function authenticate(
  request: Request,
  mode: "login" | "register",
): Promise<Response> {
  const isHtml = isHtmlFormRequest(request);

  try {
    assertSameOrigin(request);
    checkRateLimit(
      request,
      mode,
      mode === "login" ? 8 : 5,
      mode === "login" ? 15 * 60_000 : 60 * 60_000,
    );

    if (mode === "register") {
      const input = await parseInput(request, registerSchema);
      const user = await registerAccount(input);
      await createAuthSession(user.id);

      if (isHtml) return redirectForForm(request, safeRedirect(input.redirectTo));
      return successResponse({ user } satisfies { user: AuthUser }, 201);
    }

    const input = await parseInput(request, loginSchema);
    const user = await loginAccount(input);
    await createAuthSession(user.id);

    if (isHtml) return redirectForForm(request, safeRedirect(input.redirectTo));
    return successResponse({ user } satisfies { user: AuthUser });
  } catch (error) {
    if (isHtml) return formFailure(request, mode, error);
    return errorResponse(error);
  }
}

export function registerController(request: Request): Promise<Response> {
  return authenticate(request, "register");
}

export function loginController(request: Request): Promise<Response> {
  return authenticate(request, "login");
}

export async function logoutController(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    await deleteAuthSession();

    if (isHtmlFormRequest(request)) return redirectForForm(request, "/login");
    return successResponse({ success: true });
  } catch (error) {
    if (isHtmlFormRequest(request)) return formFailure(request, "login", error);
    return errorResponse(error);
  }
}

export async function meController(): Promise<Response> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      throw new ApiError(401, "unauthenticated", "Sign in to continue.");
    }
    return successResponse({ user });
  } catch (error) {
    return errorResponse(error);
  }
}

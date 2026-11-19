
import "server-only";

import type { NextRequest } from "next/server";

import { ApiError } from "@/lib/http/api-error";
import { readJson } from "@/lib/http/read-json";
import {
  errorResponse,
  successResponse,
} from "@/lib/http/response";
import { assertSameOrigin } from "@/lib/security/origin";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema";

import { authService } from "./auth.service";
import { enforceAuthRateLimit } from "./auth.rate-limit";

import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  setSessionCookie,
  validateSession,
} from "./auth.session";

export const authController = {
  async register(request: NextRequest) {
    try {
      assertSameOrigin(request);

      await enforceAuthRateLimit(
        request,
        "register",
        "ip",
      );

      const body = await readJson(request);
      const input = registerSchema.parse(body);

      await enforceAuthRateLimit(
        request,
        "register",
        "email",
        input.email,
      );

      const result = await authService.register(input);

      const response = successResponse(
        { user: result.user },
        201,
      );

      setSessionCookie(response, result.session);

      return response;
    } catch (error) {
      return errorResponse(error);
    }
  },

  async login(request: NextRequest) {
    try {
      assertSameOrigin(request);

      await enforceAuthRateLimit(
        request,
        "login",
        "ip",
      );

      const body = await readJson(request);
      const input = loginSchema.parse(body);

      await enforceAuthRateLimit(
        request,
        "login",
        "email",
        input.email,
      );

      const result = await authService.login(input);

      const response = successResponse({
        user: result.user,
      });

      setSessionCookie(response, result.session);

      return response;
    } catch (error) {
      return errorResponse(error);
    }
  },

  async logout(request: NextRequest) {
    try {
      assertSameOrigin(request);

      const token = request.cookies.get(
        SESSION_COOKIE_NAME,
      )?.value;

      await authService.logout(token);

      const response = successResponse({
        message: "Logged out successfully",
      });

      clearSessionCookie(response);

      return response;
    } catch (error) {
      return errorResponse(error);
    }
  },

  async me(request: NextRequest) {
    try {
      const token = request.cookies.get(
        SESSION_COOKIE_NAME,
      )?.value;

      const user = await validateSession(token);

      if (!user) {
        throw new ApiError(
          401,
          "UNAUTHENTICATED",
          "Authentication required",
        );
      }

      return successResponse({ user });
    } catch (error) {
      return errorResponse(error);
    }
  },
};

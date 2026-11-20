
import type { UserRole } from "@/features/auth/types/auth.types";

export function safeDashboardPath(value: unknown): string {
  if (typeof value !== "string") {
    return "/dashboard";
  }

  if (
    !/^\/dashboard(?:\/|$)/.test(value) ||
    value.includes("\\") ||
    value.includes("//") ||
    /[\r\n]/.test(value)
  ) {
    return "/dashboard";
  }

  return value;
}

export function getLoginRedirectPath(
  role: UserRole,
  requestedPath: unknown,
): string {
  return role === "SUPER_ADMIN"
    ? "/admin"
    : safeDashboardPath(requestedPath);
}

export function getRoleLandingPath(
  role: UserRole,
  hasApprovedAccess: boolean,
): string {
  if (role === "SUPER_ADMIN") return "/admin";
  return hasApprovedAccess ? "/dashboard" : "/access";
}

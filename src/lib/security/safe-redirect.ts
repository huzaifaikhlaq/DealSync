
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
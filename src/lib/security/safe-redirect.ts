const DEFAULT_REDIRECT = "/dashboard";
const REDIRECT_BASE = "https://dealsync.invalid";

export function safeRedirect(
  destination: unknown,
  fallback = DEFAULT_REDIRECT,
): string {
  if (
    typeof destination !== "string" ||
    !destination.startsWith("/") ||
    destination.startsWith("//") ||
    destination.includes("\\") ||
    destination.includes("\0")
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(destination, REDIRECT_BASE);
    if (parsed.origin !== REDIRECT_BASE) return fallback;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

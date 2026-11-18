type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type WindowState = {
  startedAt: number;
  count: number;
};

const windows = new Map<string, WindowState>();

export function consumeRateLimit(
  key: string,
  options: RateLimitOptions,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  let state = windows.get(key);

  if (!state || now - state.startedAt >= options.windowMs) {
    state = { startedAt: now, count: 0 };
    windows.set(key, state);
  }

  if (state.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((options.windowMs - (now - state.startedAt)) / 1000),
      ),
    };
  }

  state.count += 1;

  if (windows.size > 10_000) {
    for (const [candidate, entry] of windows) {
      if (now - entry.startedAt >= options.windowMs) windows.delete(candidate);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimits(): void {
  windows.clear();
}

export function requestRateLimitKey(request: Request, action: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientAddress =
    forwardedFor?.split(",").at(-1)?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return action + ":" + clientAddress;
}

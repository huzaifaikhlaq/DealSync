type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
  });

  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Request failed");
  }

  return body.data;
}

export function jsonBody(method: "POST" | "PATCH", data: unknown): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

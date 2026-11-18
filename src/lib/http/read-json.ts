import { ApiError } from "./api-error";

const MAX_BODY_BYTES = 16 * 1024;

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    throw new ApiError(415, "unsupported_media_type", "Send a JSON request.");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new ApiError(413, "request_too_large", "The request is too large.");
  }

  const reader = request.body?.getReader();
  if (!reader) {
    throw new ApiError(400, "invalid_json", "The request body is required.");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new ApiError(413, "request_too_large", "The request is too large.");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "invalid_json", "The request body could not be read.");
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new ApiError(400, "invalid_json", "The request body must be valid JSON.");
  }
}

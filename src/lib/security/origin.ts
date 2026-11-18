export function isSameOriginRequest(request: Request): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader || originHeader === "null") return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    const suppliedOrigin = new URL(originHeader).origin;
    const fetchSite = request.headers.get("sec-fetch-site");

    return (
      suppliedOrigin === requestOrigin &&
      (fetchSite === null || fetchSite === "same-origin" || fetchSite === "none")
    );
  } catch {
    return false;
  }
}

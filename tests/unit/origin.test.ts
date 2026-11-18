import { describe, expect, it } from "vitest";
import { isSameOriginRequest } from "@/lib/security/origin";

describe("isSameOriginRequest", () => {
  it("accepts a request with the matching origin", () => {
    const request = new Request("https://app.example.test/api/auth/login", {
      method: "POST",
      headers: { origin: "https://app.example.test" },
    });

    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("rejects a cross-origin request", () => {
    const request = new Request("https://app.example.test/api/auth/login", {
      method: "POST",
      headers: { origin: "https://evil.example.test" },
    });

    expect(isSameOriginRequest(request)).toBe(false);
  });

  it("requires an origin header on mutations", () => {
    const request = new Request("https://app.example.test/api/auth/logout", {
      method: "POST",
    });

    expect(isSameOriginRequest(request)).toBe(false);
  });

  it("rejects a same-site request sent from another origin", () => {
    const request = new Request("https://app.example.test/api/auth/login", {
      method: "POST",
      headers: {
        origin: "https://other.example.test",
        "sec-fetch-site": "same-site",
      },
    });

    expect(isSameOriginRequest(request)).toBe(false);
  });
});

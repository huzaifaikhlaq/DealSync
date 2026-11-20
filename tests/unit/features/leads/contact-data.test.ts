import { describe, expect, it } from "vitest";

import { extractContactDetails } from "@/features/leads/utils/contact-data";

describe("extractContactDetails", () => {
  it("reads common contact fields from nested and differently named keys", () => {
    expect(
      extractContactDetails({
        contact: {
          "First Name": "Ada",
          last_name: "Lovelace",
          "Email Address": "ada@example.com",
          phoneNumber: 4412345,
        },
        organization: { companyName: "Analytical Engines" },
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "4412345",
      company: "Analytical Engines",
      role: "",
      domain: "",
    });
  });

  it("uses an available identifier or a neutral fallback", () => {
    expect(
      extractContactDetails({ contact_email: "visitor@example.com" }).name,
    ).toBe("visitor@example.com");
    expect(extractContactDetails({}).name).toBe("Unknown visitor");
    expect(extractContactDetails(null).name).toBe("Unknown visitor");
  });
});

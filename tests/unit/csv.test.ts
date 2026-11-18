import { describe, expect, it } from "vitest";
import { serializeCsv } from "@/lib/utils/csv";

describe("serializeCsv", () => {
  it("quotes fields and escapes embedded quotes", () => {
    expect(
      serializeCsv([
        ["Name", "Company"],
        ["Ada", 'Acme "North"'],
      ]),
    ).toBe('"Name","Company"\n"Ada","Acme ""North"""');
  });
});

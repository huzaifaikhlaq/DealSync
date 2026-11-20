export type ContactDetails = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  domain: string;
};

type ContactField = "name" | "email" | "phone" | "company" | "role" | "domain";

const aliases: Record<ContactField, readonly string[]> = {
  name: ["name", "fullname", "contactname", "clientname", "yourname"],
  email: [
    "email",
    "emailaddress",
    "emailid",
    "contactemail",
    "useremail",
    "youremail",
  ],
  phone: [
    "phone",
    "phonenumber",
    "telephone",
    "contactphone",
    "userphone",
    "mobile",
    "mobilephone",
    "cellphone",
  ],
  company: ["company", "companyname", "organization", "organisation"],
  role: ["role", "title", "jobtitle", "position"],
  domain: ["domain", "website", "companywebsite", "url"],
};

function normalizeKey(key: string): string {
  return key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return "";
}

function flattenEntries(value: unknown, depth = 0): Array<[string, unknown]> {
  if (depth > 5 || value === null || typeof value !== "object") return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenEntries(item, depth + 1));
  }

  return Object.entries(value).flatMap(([key, child]) => [
    [key, child] as [string, unknown],
    ...flattenEntries(child, depth + 1),
  ]);
}

export function extractContactDetails(data: unknown): ContactDetails {
  const entries = flattenEntries(data);
  const valueFor = (field: ContactField): string => {
    const accepted = aliases[field];
    const found = entries.find(
      ([key, value]) => accepted.includes(normalizeKey(key)) && asText(value),
    );
    return found ? asText(found[1]) : "";
  };

  const firstName = entries.find(
    ([key, value]) =>
      ["firstname", "givenname"].includes(normalizeKey(key)) && asText(value),
  );
  const lastName = entries.find(
    ([key, value]) =>
      ["lastname", "surname", "familyname"].includes(normalizeKey(key)) &&
      asText(value),
  );

  const email = valueFor("email");
  const phone = valueFor("phone");
  const submittedName =
    valueFor("name") ||
    [firstName, lastName]
      .filter(Boolean)
      .map((entry) => asText(entry?.[1]))
      .join(" ");

  return {
    name: submittedName || email || phone || "Unknown visitor",
    email,
    phone,
    company: valueFor("company"),
    role: valueFor("role"),
    domain: valueFor("domain"),
  };
}

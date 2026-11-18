import { expect, test } from "@playwright/test";

test("keeps the marketing home page available", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("DealSync");
});

test("renders dashboard routes inside the shared workspace", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /good morning/i }),
  ).toBeVisible();

  await page.goto("/dashboard/forms");
  await expect(page.getByRole("heading", { name: "Forms" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();

  await page.goto("/dashboard/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Forms" })).toBeVisible();
});

test("redirects legacy forms and leads URLs to dashboard routes", async ({
  page,
}) => {
  await page.goto("/forms");
  await expect(page).toHaveURL(/\/dashboard\/forms$/);

  await page.goto("/leads");
  await expect(page).toHaveURL(/\/dashboard\/leads$/);
});

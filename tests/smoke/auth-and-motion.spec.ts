import { expect, test } from "@playwright/test";

const adminEmail = process.env.QA_ADMIN_EMAIL;
const adminPassword = process.env.QA_ADMIN_PASSWORD;

test.describe("Auth and motion smoke", () => {
  test("home and work motion surfaces render without runtime regressions", async ({ page }) => {
    const issues: string[] = [];

    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        message.text() !== "Failed to load resource: the server responded with a status of 404 (Not Found)"
      ) {
        issues.push(`console:${message.text()}`);
      }
    });

    page.on("pageerror", (error) => {
      issues.push(`pageerror:${error.message}`);
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        const url = response.url();
        if (!url.endsWith("/favicon.ico")) {
          issues.push(`response:${response.status()} ${url}`);
        }
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page.getByRole("heading", { name: /We craft digital experiences that move people/i })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(1200);

    await page.goto("/work");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(800);

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("admin route redirects to auth, then signs in with rotated QA credentials", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, "QA admin credentials are required for the smoke auth flow.");

    const issues: string[] = [];

    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        message.text() !== "Failed to load resource: the server responded with a status of 404 (Not Found)"
      ) {
        issues.push(`console:${message.text()}`);
      }
    });

    page.on("pageerror", (error) => {
      issues.push(`pageerror:${error.message}`);
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        const url = response.url();
        if (!url.endsWith("/favicon.ico")) {
          issues.push(`response:${response.status()} ${url}`);
        }
      }
    });

    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/auth/);

    await page.locator("#auth-email").fill(adminEmail ?? "");
    await page.locator("#auth-password").fill(adminPassword ?? "");
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await page.waitForURL("**/admin", { timeout: 15_000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page.getByRole("heading", { name: /Admin visibility/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Invite a new account/i })).toBeVisible();

    expect(issues, issues.join("\n")).toEqual([]);
  });
});

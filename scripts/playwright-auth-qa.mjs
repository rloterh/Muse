import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const credentials = {
  email: "admin@muse.agency",
  password: "MuseAdmin!2026#Ops",
};

async function run() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  const issues = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      if (message.text() !== "Failed to load resource: the server responded with a status of 404 (Not Found)") {
        issues.push(`console:${message.text()}`);
      }
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

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const heroCanvasVisible = await page.locator("canvas").first().isVisible();
  if (!heroCanvasVisible) {
    throw new Error("Hero canvas did not render on the home page.");
  }

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(1200);

  await page.goto(`${baseUrl}/work`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const workHeading = await page.locator("h1").first().textContent();
  if (!workHeading) {
    throw new Error("Work page heading did not render.");
  }

  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(800);

  await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  if (!page.url().includes("/auth")) {
    throw new Error("Unauthenticated admin request did not redirect to /auth.");
  }

  await page.locator('input[type="email"]').fill(credentials.email);
  await page.locator('input[type="password"]').fill(credentials.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/admin", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  const moderationHeading = await page.getByRole("heading", { name: /Admin visibility/i }).isVisible();
  if (!moderationHeading) {
    throw new Error("Admin moderation heading did not render after sign-in.");
  }

  if (issues.length > 0) {
    throw new Error(`QA detected runtime issues:\n${issues.join("\n")}`);
  }

  console.log("Playwright QA passed.");
  await browser.close();
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

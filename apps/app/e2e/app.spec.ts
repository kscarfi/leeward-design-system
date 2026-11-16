// Every screen in every brand and mode: no axe violations, no sideways scroll at 360 px, no runtime errors.
// Then the transfer flow from start to finish.
import { createRequire } from "node:module";
import { expect, test, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const SCREENS = ["home", "transactions", "activity/t2", "payments", "send", "cards", "savings", "profile", "notifications"];
const THEMES = ["leeward", "business", "harbor"].flatMap((brand) => ["light", "dark"].map((mode) => ({ brand, mode })));

async function axe(page: Page) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async () => {
    // @ts-expect-error axe is injected above
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
    return r.violations.map((v: { id: string; nodes: { target: string[] }[] }) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  });
}

for (const { brand, mode } of THEMES) {
  for (const screen of SCREENS) {
    test(`${screen} in ${brand} ${mode}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/?embed&brand=${brand}&mode=${mode}#/${screen}`);
      await expect(page.locator("main h1, main h2").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
      // A tall viewport, so the sticky tab bar does not cover rows; axe counts covered rows as too small to tap.
      await page.setViewportSize({ width: 360, height: 3000 });
      expect(await axe(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("sends money, and the balance and activity follow", async ({ page }) => {
  await page.goto("/?embed#/payments");
  await page.getByRole("button", { name: "Send money" }).click();
  await page.getByLabel("Who are you paying?").fill("deniz");
  await page.getByRole("button", { name: /Deniz Yılmaz/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter how much you want to send.")).toBeVisible();
  await page.getByLabel("Amount").fill("250");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Check the details" })).toBeVisible();
  await page.getByRole("button", { name: "Send TRY 250.00" }).click();
  await page.getByLabel("Verification code").fill("111111");
  await expect(page.getByText("This code does not match.", { exact: false })).toBeVisible();
  await page.getByLabel("Verification code").fill("123456");
  await expect(page.getByRole("heading", { name: "TRY 250.00 is on its way" })).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  // 24,580.35 + 120,000.00 - 250.00
  await expect(page.getByText("TRY 144,330.35")).toBeVisible();
  await expect(page.getByRole("button", { name: /Deniz Yılmaz/ }).first()).toBeVisible();
});

test("a new recipient needs a valid Turkish IBAN", async ({ page }) => {
  await page.goto("/?embed#/send");
  await page.getByRole("button", { name: /New recipient/ }).click();
  await page.getByLabel("Full name").fill("Ali Veli");
  await page.getByLabel("IBAN").fill("TR00 1234");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("A Turkish IBAN starts with TR and has 26 characters.")).toBeVisible();
  await page.getByLabel("IBAN").fill("TR21 0001 0000 1234 5678 9012 35");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("This IBAN is not valid. Check each digit.")).toBeVisible();
  await page.getByLabel("IBAN").fill("TR21 0001 0000 1234 5678 9012 34");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Ziraat Bankası").first()).toBeVisible();
  await expect(page.getByText(/Fee TRY 4.50/)).toBeVisible();
});

test("freezing the card shows everywhere on the card screen", async ({ page }) => {
  await page.goto("/?embed#/cards");
  await page.getByRole("button", { name: "Freeze" }).click();
  await expect(page.getByText("Your card is frozen.", { exact: false })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Online payments" })).toBeDisabled();
});

test("the showcase passes the brand and mode into the phone frame", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const app = page.frameLocator("iframe");
  await expect(app.getByRole("heading", { name: "Kemal" })).toBeVisible();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect.poll(() => page.locator("iframe").evaluate((f: HTMLIFrameElement) => f.contentDocument?.documentElement.dataset.theme)).toBe("dark");
  expect(await axe(page)).toEqual([]);
});

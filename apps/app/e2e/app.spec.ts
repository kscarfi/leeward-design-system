// Every screen in every brand and mode: no axe violations, no sideways scroll at 360 px, no runtime errors.
// Then the transfer flow from start to finish.
import { createRequire } from "node:module";
import { expect, test, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const SCREENS = ["home", "activity/t1", "payments", "cards", "savings"];
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

test("sends money from search to the success screen", async ({ page }) => {
  await page.goto("/?embed#/payments");
  await page.getByLabel("Who are you paying?").fill("deniz");
  await page.getByRole("button", { name: /Deniz Yılmaz/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter how much you want to send.")).toBeVisible();
  await page.getByLabel("Amount").fill("250");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Check the details" })).toBeVisible();
  await page.getByRole("button", { name: "Send money" }).click();
  await page.getByLabel("Verification code").fill("111111");
  await expect(page.getByText("This code does not match.", { exact: false })).toBeVisible();
  await page.getByLabel("Verification code").fill("123456");
  await expect(page.getByRole("heading", { name: "TRY 250.00 is on its way" })).toBeVisible();
});

test("the showcase passes the brand and mode into the phone frame", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const app = page.frameLocator("iframe");
  await expect(app.getByRole("heading", { name: "Ece Kaya" })).toBeVisible();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect.poll(() => page.locator("iframe").evaluate((f: HTMLIFrameElement) => f.contentDocument?.documentElement.dataset.theme)).toBe("dark");
  expect(await axe(page)).toEqual([]);
});

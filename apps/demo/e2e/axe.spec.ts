// Renders each run alone and records axe results and a screenshot. Used by scripts/compare.ts.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const out = new URL("../results/", import.meta.url).pathname;

for (const id of ["a-without-system", "b-with-system"]) {
  test(id, async ({ page }) => {
    test.skip(!existsSync(new URL(`../runs/${id}/TransferScreen.tsx`, import.meta.url)), "no output yet");
    mkdirSync(out, { recursive: true });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/?run=${id}`);
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}${id}.png`, fullPage: true });
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      // @ts-expect-error axe is injected above
      const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
      return r.violations.map((v: { id: string; impact: string; nodes: unknown[]; help: string }) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
    });
    const rendered = await page.locator("[data-run] *").count();
    writeFileSync(`${out}${id}.axe.json`, JSON.stringify({ rendered: rendered > 3, errors, violations: result }, null, 2));
  });
}

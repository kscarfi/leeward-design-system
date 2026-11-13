import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

interface IndexEntry {
  id: string;
  type: "story" | "docs";
  title: string;
  name: string;
}

const index = JSON.parse(readFileSync(new URL("../storybook-static/index.json", import.meta.url), "utf8")) as { entries: Record<string, IndexEntry> };
const stories = Object.values(index.entries).filter((e) => e.type === "story");

for (const theme of ["light", "dark"] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} ${story.name}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
        await page.locator("#storybook-root").waitFor();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${theme}/${story.id}.png`, { fullPage: true });
      });
    }
  });
}

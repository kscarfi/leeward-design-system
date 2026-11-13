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

const themes = [
  { name: "light", brand: "leeward", mode: "light" },
  { name: "dark", brand: "leeward", mode: "dark" },
  { name: "business", brand: "business", mode: "light" },
] as const;

for (const { name: theme, brand, mode } of themes) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} ${story.name}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=brand:${brand};mode:${mode}`);
        await page.locator("#storybook-root").waitFor();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${theme}/${story.id}.png`, { fullPage: true });
      });
    }
  });
}

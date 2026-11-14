// Every story at a 360 px phone width: nothing may overflow sideways.
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const index = JSON.parse(readFileSync(new URL("../storybook-static/index.json", import.meta.url), "utf8")) as { entries: Record<string, { id: string; type: string; title: string; name: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === "story");

test.describe("no horizontal overflow at 360 px", () => {
  test.use({ viewport: { width: 360, height: 780 } });
  for (const story of stories) {
    test(`${story.title} ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.locator("#storybook-root").waitFor();
      await page.waitForTimeout(150);
      const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(scroll, `${story.id} is ${scroll - client}px wider than the screen`).toBeLessThanOrEqual(client);
    });
  }
});

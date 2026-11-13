import { defineConfig, devices } from "@playwright/test";

// Visual regression for every story, in light and dark. Baselines are per platform;
// CI baselines are Linux and come from the "Update visual baselines" workflow.
export default defineConfig({
  testDir: "./visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" } },
  use: { baseURL: "http://localhost:6007", ...devices["Desktop Chrome"], viewport: { width: 800, height: 600 } },
  webServer: { command: "node visual/serve.ts", url: "http://localhost:6007/index.json", reuseExistingServer: !process.env.CI },
});

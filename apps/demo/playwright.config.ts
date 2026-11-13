import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  use: { baseURL: "http://localhost:5180", ...devices["Desktop Chrome"], viewport: { width: 430, height: 932 } },
  webServer: { command: "node_modules/.bin/vite --port 5180 --strictPort", url: "http://localhost:5180", reuseExistingServer: !process.env.CI },
});

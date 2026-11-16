import { defineConfig, devices } from "@playwright/test";

// The app inside the frame, at the width of a small phone.
export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  use: { baseURL: "http://localhost:5190", ...devices["Desktop Chrome"], viewport: { width: 360, height: 780 } },
  webServer: { command: "node_modules/.bin/vite --port 5190 --strictPort", url: "http://localhost:5190", reuseExistingServer: !process.env.CI },
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Relative base: the app is served from /leeward-design-system/app/ on GitHub Pages.
// The logo and favicon are imported from docs/assets/brand, so there is one copy of each.
export default defineConfig({ base: "./", publicDir: false, plugins: [react()], server: { port: 5190 } });

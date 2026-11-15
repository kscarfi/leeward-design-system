// Figma runs a plugin as one script, so everything (code, token JSON, icons, manifest) is bundled into dist/code.js.
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    target: "es2017",
    lib: { entry: "src/code.ts", formats: ["iife"], name: "LeewardBuilder", fileName: () => "code.js" },
  },
});

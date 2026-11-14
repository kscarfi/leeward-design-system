// Library build for npm: one ES module, with every component's CSS collected into one file.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Readable output: apps minify on their own, and stack traces stay useful.
    minify: false,
    cssMinify: true,
    cssCodeSplit: false,
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index", cssFileName: "components" },
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui($|\/)/, /^@leeward\/tokens($|\/)/],
      // Components use state and effects, so frameworks with server components need this directive.
      output: { banner: '"use client";' },
    },
  },
});

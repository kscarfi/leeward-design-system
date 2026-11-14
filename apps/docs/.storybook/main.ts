import remarkGfm from "remark-gfm";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx", "../../../packages/react/src/**/*.stories.tsx"],
  addons: [
    // GitHub flavored Markdown (tables) in MDX pages, as the Storybook docs recommend.
    { name: "@storybook/addon-docs", options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  core: { disableTelemetry: true },
  // Logo, favicon and README artwork, served at /assets.
  staticDirs: [{ from: "../../../docs/assets", to: "/assets" }],
  managerHead: (head) => `${head}\n<link rel="icon" type="image/svg+xml" href="./assets/brand/favicon.svg">`,
  typescript: { reactDocgen: "react-docgen-typescript" },
};

export default config;

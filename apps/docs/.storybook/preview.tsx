import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import "@leeward/tokens/partners/harbor.css";
import "./preview.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";
import { ToastProvider, TooltipProvider } from "@leeward/react";

const withTheme: Decorator = (Story, context) => {
  const brand = context.globals.brand ?? "leeward";
  const mode = context.globals.mode ?? "light";
  const layout = context.parameters.layout;
  // Paint the whole page in the chosen brand and mode so screenshots have no stray canvas.
  if (typeof document !== "undefined") {
    document.documentElement.dataset.brand = brand;
    document.documentElement.dataset.theme = mode === "both" ? "light" : mode;
  }
  const frame = (m: string) => (
    <div data-brand={brand} data-theme={m} className={layout === "fullscreen" ? "lw-frame lw-frame-full" : "lw-frame"}>
      <Story />
    </div>
  );
  return (
    <TooltipProvider>
      <ToastProvider>{mode === "both" ? <div className="lw-split">{frame("light")}{frame("dark")}</div> : frame(mode)}</ToastProvider>
    </TooltipProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    brand: {
      description: "Brand",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "leeward", title: "Leeward" },
          { value: "business", title: "Leeward Business" },
          { value: "harbor", title: "Harbor (generated partner)" },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Mode",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "both", title: "Side by side" },
        ],
        dynamicTitle: true,
      },
    },
  },
  // CI runs every story test per brand and mode: VITE_LW_BRAND and VITE_LW_MODE.
  initialGlobals: { brand: import.meta.env.VITE_LW_BRAND ?? "leeward", mode: import.meta.env.VITE_LW_MODE ?? "light" },
  parameters: {
    layout: "padded",
    // Any axe violation fails the story test in the UI and in CI. Rules: WCAG 2.0, 2.1 and 2.2, levels A and AA.
    a11y: {
      test: "error",
      options: { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } },
    },
    docs: {
      toc: { headingSelector: "h2, h3", title: "On this page" },
      // Docs pages use the system's own fonts, not Storybook's default Nunito Sans.
      theme: create({ base: "light", fontBase: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif', fontCode: '"IBM Plex Mono", ui-monospace, monospace' }),
    },
    controls: { expanded: true, sort: "requiredFirst" },
    viewport: {
      options: {
        mobile: { name: "Mobile 375", styles: { width: "375px", height: "812px" } },
        tablet: { name: "Tablet 768", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop 1280", styles: { width: "1280px", height: "800px" } },
      },
    },
    options: {
      storySort: { order: ["Introduction", "Guides", "Foundations", "Components", "Patterns", "Screens", "Themes"] },
    },
  },
  tags: ["autodocs"],
};

export default preview;

import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import "./preview.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { ToastProvider, TooltipProvider } from "@leeward/react";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  const layout = context.parameters.layout;
  const frame = (name: string) => (
    <div data-theme={name} className={layout === "fullscreen" ? "lw-frame lw-frame-full" : "lw-frame"}>
      <Story />
    </div>
  );
  const content =
    theme === "both" ? (
      <div className="lw-split">
        {frame("light")}
        {frame("dark")}
      </div>
    ) : (
      frame(theme)
    );
  return (
    <TooltipProvider>
      <ToastProvider>{content}</ToastProvider>
    </TooltipProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
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
  // CI runs every story test twice: VITE_LW_THEME=light and VITE_LW_THEME=dark.
  initialGlobals: { theme: import.meta.env.VITE_LW_THEME ?? "light" },
  parameters: {
    layout: "padded",
    // Any axe violation fails the story test in the UI and in CI.
    a11y: { test: "error" },
    controls: { expanded: true, sort: "requiredFirst" },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components", "Patterns", "Screens"] },
    },
  },
  tags: ["autodocs"],
};

export default preview;

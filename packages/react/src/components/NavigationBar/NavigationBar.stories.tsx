import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import docsMd from "./NavigationBar.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { NavigationBar } from "./NavigationBar.tsx";

const meta = {
  title: "Components/NavigationBar",
  component: NavigationBar,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    current: "Home",
    items: [
      { label: "Home", icon: "home", href: "#home" },
      { label: "Payments", icon: "arrows-left-right", href: "#payments" },
      { label: "Cards", icon: "card", href: "#cards" },
      { label: "Inbox", icon: "inbox", href: "#inbox", count: 2 },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: "420px" }}><Story /></div>],
} satisfies Meta<typeof NavigationBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name: "Main" });
    await expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: "Inbox, 2 new" })).toBeVisible();
  },
};
export const Turkish: Story = { args: { locale: "tr-TR", current: "Kartlar", items: [{ label: "Ana sayfa", icon: "home", href: "#a" }, { label: "Ödemeler", icon: "arrows-left-right", href: "#b" }, { label: "Kartlar", icon: "card", href: "#c" }, { label: "Profil", icon: "user", href: "#d" }] } };

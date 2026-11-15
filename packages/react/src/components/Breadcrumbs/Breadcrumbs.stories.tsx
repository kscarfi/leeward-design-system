import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import docsMd from "./Breadcrumbs.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Breadcrumbs } from "./Breadcrumbs.tsx";

const meta = { title: "Components/Breadcrumbs", component: Breadcrumbs, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { items: [{ label: "Accounts", href: "#accounts", icon: "home" }, { label: "Everyday", href: "#everyday" }, { label: "Statements" }] } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name: "Breadcrumb" });
    await expect(within(nav).getByText("Statements")).toHaveAttribute("aria-current", "page");
  },
};
export const Collapsed: Story = {
  args: { items: [{ label: "Accounts", href: "#a" }, { label: "Everyday", href: "#b" }, { label: "Statements", href: "#c" }, { label: "2026", href: "#d" }, { label: "November" }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText("Everyday")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Show full path" }));
    await expect(canvas.getByText("Everyday")).toBeVisible();
  },
};
export const Turkish: Story = { args: { locale: "tr-TR", items: [{ label: "Hesaplar", href: "#a" }, { label: "Günlük", href: "#b" }, { label: "Hesap özetleri" }] } };

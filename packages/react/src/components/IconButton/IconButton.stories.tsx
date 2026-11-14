import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, fn } from "storybook/test";
import { IconButton } from "./IconButton.tsx";
import docsMd from "./IconButton.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { iconNames } from "../Icon/icons.ts";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  argTypes: { icon: { control: "select", options: iconNames } },
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onClick: fn(), icon: "settings", label: "Settings" },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Settings" })).toBeVisible();
  },
};
export const Secondary: Story = { args: { variant: "secondary", icon: "bell", label: "Notifications" } };
export const Primary: Story = { args: { variant: "primary", icon: "plus", label: "Add account" } };
export const Small: Story = { args: { size: "sm", icon: "close", label: "Close" } };
export const Disabled: Story = { args: { disabled: true } };

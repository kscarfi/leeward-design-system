import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Text } from "../Text/Text.tsx";
import { Link } from "./Link.tsx";
import docsMd from "./Link.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { href: "#fees", children: "See all fees", onClick: fn() },
  argTypes: { variant: { control: "inline-radio", options: ["inline", "standalone"] }, external: { control: "boolean" } },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = { args: { variant: "standalone" } };
export const WithIcons: Story = {
  args: { variant: "standalone", iconStart: "download", children: "Download statement", href: "#statement" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("link", { name: "Download statement" })).toBeVisible();
  },
};
export const SeeAll: Story = { args: { variant: "standalone", iconEnd: "arrow-right", children: "See all transactions", href: "#all" } };
export const Inline: Story = { render: (args) => <Text>Transfers are free. <Link {...args}>See all fees</Link> for card payments abroad.</Text> };
export const External: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: /opens in a new tab/ });
    await expect(link).toHaveAttribute("target", "_blank");
  }, args: { variant: "standalone", external: true, href: "https://example.com", children: "Deposit insurance details" } };

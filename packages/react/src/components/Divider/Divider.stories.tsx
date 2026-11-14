import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "../Card/Card.tsx";
import { Text } from "../Text/Text.tsx";
import { Divider } from "./Divider.tsx";
import docsMd from "./Divider.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { orientation: "horizontal", decorative: true },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    label: { control: "text" },
    decorative: { control: "boolean" },
  },
  // Dividers sit on surfaces, so the playground shows one on a card between real content.
  render: (args) => (
    <Card style={{ maxWidth: "420px" }}>
      <div style={{ display: "flex", flexDirection: args.orientation === "vertical" ? "row" : "column", gap: "var(--lw-space-md)", minHeight: args.orientation === "vertical" ? "var(--lw-size-control-xl)" : undefined }}>
        <Text>Available balance</Text>
        <Divider {...args} />
        <Text tone="secondary">Pending payments</Text>
      </div>
    </Card>
  ),
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  },
};
export const WithLabel: Story = { args: { label: "or" } };
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Semantic: Story = {
  args: { decorative: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("separator")).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge.tsx";
import docsMd from "./Badge.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { children: "Pending", tone: "warning" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-xs)", flexWrap: "wrap" }}>
      <Badge tone="neutral">Card</Badge>
      <Badge tone="info">New</Badge>
      <Badge tone="success">Paid</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger">Declined</Badge>
    </div>
  ),
};
export const Solid: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-xs)", flexWrap: "wrap" }}>
      <Badge appearance="solid" tone="neutral">Card</Badge>
      <Badge appearance="solid" tone="info">New</Badge>
      <Badge appearance="solid" tone="success">Paid</Badge>
      <Badge appearance="solid" tone="warning">Pending</Badge>
      <Badge appearance="solid" tone="danger">Declined</Badge>
    </div>
  ),
};
export const Small: Story = { args: { size: "sm" } };
export const WithoutIcon: Story = { args: { tone: "info", icon: null, children: "Beta" } };

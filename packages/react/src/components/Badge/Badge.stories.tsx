import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge.tsx";

const meta = {
  title: "Components/Badge",
  component: Badge,
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
export const WithoutIcon: Story = { args: { tone: "info", icon: null, children: "Beta" } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton.tsx";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const Paragraph: Story = { args: { lines: 3 } };
export const Rect: Story = { args: { shape: "rect" } };
export const Circle: Story = { args: { shape: "circle" } };

export const TransactionLoading: Story = {
  render: () => (
    <div role="status" aria-busy="true" aria-label="Loading transactions" style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "center" }}>
          <Skeleton shape="circle" />
          <div style={{ flex: 1 }}><Skeleton lines={2} /></div>
          <Skeleton width="72px" />
        </div>
      ))}
    </div>
  ),
};

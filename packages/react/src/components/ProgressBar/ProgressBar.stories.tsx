import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar.tsx";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  args: { label: "Holiday fund", value: 4500, max: 10000 },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { valueText: "₺4.500 of ₺10.000" } };
export const Percentage: Story = { args: { label: "Profile complete", value: 80, max: 100 } };
export const Success: Story = { args: { label: "Holiday fund", value: 10000, tone: "success", valueText: "Goal reached: ₺10.000" } };
export const NearLimit: Story = { args: { label: "Daily card limit", value: 9200, tone: "warning", valueText: "92% used, ₺800 left" } };
export const OverLimit: Story = { args: { label: "Monthly budget", value: 100, max: 100, tone: "danger", valueText: "Over budget by ₺320" } };

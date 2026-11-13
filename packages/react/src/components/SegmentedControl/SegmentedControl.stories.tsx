import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SegmentedControl } from "./SegmentedControl.tsx";

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  args: { label: "Period", options: [{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }], defaultValue: "month" },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const week = within(canvasElement).getByRole("radio", { name: "Week" });
    await userEvent.click(week);
    await expect(week).toHaveAttribute("aria-checked", "true");
  },
};
export const Small: Story = { args: { size: "sm" } };
export const WithIcons: Story = { args: { label: "View", options: [{ value: "list", label: "List", icon: "menu" }, { value: "chart", label: "Chart", icon: "pie-chart" }], defaultValue: "list" } };
export const FullWidth: Story = { args: { fullWidth: true }, decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>] };

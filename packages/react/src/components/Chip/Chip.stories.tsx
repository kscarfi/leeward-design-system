import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Chip } from "./Chip.tsx";

const meta = {
  title: "Components/Chip",
  component: Chip,
  args: { children: "Groceries" },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const WithIcon: Story = { args: { icon: "coffee", children: "Eating out" } };
export const Disabled: Story = { args: { disabled: true } };

export const FilterGroup: Story = {
  render: () => {
    const filters = ["All", "Money in", "Money out", "Pending"];
    const [active, setActive] = useState<string[]>(["All"]);
    return (
      <div role="group" aria-label="Filter transactions" style={{ display: "flex", gap: "var(--lw-space-xs)", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <Chip key={f} selected={active.includes(f)} onSelectedChange={(s) => setActive((cur) => (s ? [...cur, f] : cur.filter((x) => x !== f)))}>
            {f}
          </Chip>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByRole("button", { name: "Pending" });
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  },
};

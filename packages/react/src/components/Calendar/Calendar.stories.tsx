import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import docsMd from "./Calendar.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Calendar } from "./Calendar.tsx";

const meta = { title: "Components/Calendar", component: Calendar, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { defaultMonth: new Date(2026, 10, 1), value: new Date(2026, 10, 18), onValueChange: fn(), showToday: false } } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole("grid", { name: "November 2026" });
    const selected = within(grid).getByRole("button", { name: "Wednesday, November 18, 2026" });
    selected.focus();
    await userEvent.keyboard("{ArrowRight}");
    // Focus moves on the next frame.
    await waitFor(() => expect(within(grid).getByRole("button", { name: "Thursday, November 19, 2026" })).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await userEvent.keyboard("{PageDown}");
    await expect(await canvas.findByRole("grid", { name: "December 2026" })).toBeVisible();
  },
};
export const WithLimits: Story = { args: { min: new Date(2026, 10, 10), max: new Date(2026, 10, 25), isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6 } };
export const Turkish: Story = { args: { locale: "tr-TR" } };

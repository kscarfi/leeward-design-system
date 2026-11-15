import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./Slider.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Slider } from "./Slider.tsx";
import { formatAmount } from "../../utils/format.ts";

const meta = { title: "Components/Slider", component: Slider, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Save each month", min: 0, max: 10000, step: 250, defaultValue: 2000, onValueChange: fn(), formatValue: (v: number) => formatAmount(v, { currency: "TRY", locale: "tr-TR", minimumFractionDigits: 0 }) }, decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>] } satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const thumb = within(canvasElement).getByRole("slider", { name: "Save each month" });
    await expect(thumb).toHaveAttribute("aria-valuetext", "₺2.000");
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(2250);
  },
};
export const WithHint: Story = { args: { hint: "You can change this any time" } };
export const Disabled: Story = { args: { disabled: true } };

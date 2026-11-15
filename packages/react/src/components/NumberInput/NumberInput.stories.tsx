import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./NumberInput.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { NumberInput } from "./NumberInput.tsx";

const meta = { title: "Components/NumberInput", component: NumberInput, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Loan term", unit: "months", min: 3, max: 36, step: 3, defaultValue: 12, hint: "Between 3 and 36 months", onValueChange: fn() }, decorators: [(Story) => <div style={{ maxWidth: "280px" }}><Story /></div>] } satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("spinbutton", { name: "Loan term" });
    await expect(input).toHaveAttribute("aria-valuetext", "12 months");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(15);
    await userEvent.keyboard("{End}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(36);
    await expect(canvas.getByRole("button", { name: "Increase" })).toBeDisabled();
  },
};
export const Empty: Story = { args: { defaultValue: null } };
export const WithError: Story = { args: { error: "Choose between 3 and 36 months" } };
export const Turkish: Story = { args: { locale: "tr-TR", label: "Vade", unit: "ay", hint: "3 ile 36 ay arası" } };

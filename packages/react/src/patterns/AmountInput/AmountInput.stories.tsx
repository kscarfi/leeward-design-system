import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { AmountInput } from "./AmountInput.tsx";
import docsMd from "./AmountInput.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/AmountInput",
  component: AmountInput,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onValueChange: fn(), label: "Amount", currency: "TRY", locale: "tr-TR", max: 24580.35, hint: "Available: ₺24.580,35" },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof AmountInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Amount");
    await userEvent.type(input, "1250,5");
    await userEvent.tab();
    await expect(input).toHaveValue("1.250,50");
  },
};
export const OverBalance: Story = { args: { defaultValue: 30000 } };
export const English: Story = { args: { locale: "en-US", hint: "Available: TRY 24,580.35", defaultValue: 1250 } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { OTPInput } from "./OTPInput.tsx";
import docsMd from "./OTPInput.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/OTPInput",
  component: OTPInput,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onChange: fn(), label: "Verification code", hint: "We sent a 6-digit code to •••• 4821", onComplete: fn() },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof OTPInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByLabelText("Verification code");
    await userEvent.click(input);
    await userEvent.paste("482 913");
    await expect(input).toHaveValue("482913");
    await expect(args.onComplete).toHaveBeenCalledWith("482913");
  },
};
export const Partial: Story = { args: { defaultValue: "482" } };
export const WithError: Story = { args: { defaultValue: "482913", error: "This code does not match. Check the SMS and try again." } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "482913" } };
export const FourDigits: Story = { args: { length: 4, label: "Card PIN check", hint: undefined } };

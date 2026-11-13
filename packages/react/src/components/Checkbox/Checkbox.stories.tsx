import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox.tsx";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "Save this person as a recipient" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("checkbox", { name: /Save this person/ });
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { checked: "indeterminate", label: "Select all transactions" } };
export const WithHint: Story = { args: { hint: "You can find saved recipients under Payments" } };
export const WithError: Story = { args: { label: "I accept the account terms", error: "Accept the terms to open your account" } };
export const Disabled: Story = { args: { disabled: true } };

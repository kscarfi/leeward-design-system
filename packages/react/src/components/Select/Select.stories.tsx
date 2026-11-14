import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { Select } from "./Select.tsx";
import docsMd from "./Select.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const options = [
  { value: "everyday", label: "Everyday account" },
  { value: "savings", label: "Savings" },
  { value: "business", label: "Business account" },
  { value: "closed", label: "Old account (closed)", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onValueChange: fn(), label: "Pay from", options },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox", { name: "Pay from" }));
    await userEvent.click(await screen.findByRole("option", { name: "Savings" }));
    await expect(args.onValueChange).toHaveBeenCalledWith("savings");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  },
};
export const WithValue: Story = { args: { defaultValue: "savings" } };
export const Pill: Story = {
  args: { shape: "pill", size: "sm", label: "Category" },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", { name: "Category" });
    await expect(parseFloat(getComputedStyle(trigger).borderTopLeftRadius)).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().height / 2);
  },
};
export const WithHint: Story = { args: { hint: "Money leaves this account today" } };
export const WithError: Story = { args: { error: "Choose an account to continue" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "everyday" } };

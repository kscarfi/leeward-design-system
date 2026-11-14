import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { TextField } from "./TextField.tsx";
import docsMd from "./TextField.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/TextField",
  component: TextField,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onChange: fn(), onFocus: fn(), onBlur: fn(), label: "Recipient name" },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Recipient name");
    await userEvent.type(input, "Deniz Yılmaz");
    await expect(input).toHaveValue("Deniz Yılmaz");
  },
};
export const Pill: Story = {
  args: { label: "Search transactions", placeholder: "Merchant or amount", shape: "pill", type: "search" },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByLabelText("Search transactions").parentElement as HTMLElement;
    await expect(parseFloat(getComputedStyle(box).borderTopLeftRadius)).toBeGreaterThanOrEqual(box.getBoundingClientRect().height / 2);
  },
};
export const WithHint: Story = { args: { label: "IBAN", hint: "26 characters, starts with TR", placeholder: "TR00 0000 0000 0000 0000 0000 00" } };
export const WithError: Story = {
  args: { label: "IBAN", defaultValue: "TR12 3456", error: "This IBAN is too short. Check it and try again." },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("IBAN");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(/too short/);
  },
};
export const Amount: Story = { args: { label: "Amount", prefix: "₺", inputMode: "decimal", numeric: true, placeholder: "0,00" } };
export const WithSuffix: Story = { args: { label: "Interest rate", suffix: "%", numeric: true, defaultValue: "42,5" } };
export const Optional: Story = { args: { label: "Note", optional: true, hint: "Only you can see this" } };
export const Disabled: Story = { args: { label: "Account holder", defaultValue: "Deniz Yılmaz", disabled: true } };

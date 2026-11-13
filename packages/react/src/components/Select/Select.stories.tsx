import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select.tsx";

const options = [
  { value: "everyday", label: "Everyday account" },
  { value: "savings", label: "Savings" },
  { value: "business", label: "Business account" },
  { value: "closed", label: "Old account (closed)", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  args: { label: "Pay from", options },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "savings" } };
export const WithHint: Story = { args: { hint: "Money leaves this account today" } };
export const WithError: Story = { args: { error: "Choose an account to continue" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "everyday" } };

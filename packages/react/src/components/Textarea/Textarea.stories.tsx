import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea.tsx";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { label: "Payment note", hint: "The recipient sees this", optional: true, maxLength: 140, showCount: true },
  decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>],
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "Rent for November" } };
export const WithError: Story = { args: { optional: false, error: "Add a note so you can find this payment later" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked" } };

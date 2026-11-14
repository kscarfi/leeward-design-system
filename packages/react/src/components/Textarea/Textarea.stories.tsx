import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Textarea } from "./Textarea.tsx";
import docsMd from "./Textarea.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onChange: fn(), onFocus: fn(), onBlur: fn(), label: "Payment note", hint: "The recipient sees this", optional: true, maxLength: 140, showCount: true },
  decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>],
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/Payment note/), "Rent");
    await expect(canvas.getByText("4 of 140")).toBeInTheDocument();
  },
};
export const WithValue: Story = { args: { defaultValue: "Rent for November" } };
export const WithError: Story = { args: { optional: false, error: "Add a note so you can find this payment later" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked" } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { RadioGroup } from "./RadioGroup.tsx";
import docsMd from "./RadioGroup.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onValueChange: fn(),
    label: "When should it arrive?",
    options: [
      { value: "now", label: "Now", description: "Free, arrives in seconds" },
      { value: "date", label: "On a date", description: "Choose a day in the next 12 months" },
      { value: "monthly", label: "Every month", description: "Sends on the same day each month" },
    ],
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: "now" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Now" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "On a date" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(canvas.getByRole("radio", { name: "On a date" })).toBeChecked();
  },
};
export const Horizontal: Story = {
  args: { label: "Statement format", orientation: "horizontal", options: [{ value: "pdf", label: "PDF" }, { value: "csv", label: "CSV" }], defaultValue: "pdf" },
};
export const WithError: Story = { args: { error: "Choose when the money should arrive" } };
export const DisabledOption: Story = {
  args: { options: [{ value: "now", label: "Now" }, { value: "date", label: "On a date", disabled: true, description: "Not available for this recipient" }] },
};

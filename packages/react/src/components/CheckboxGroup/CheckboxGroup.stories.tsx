import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CheckboxGroup } from "./CheckboxGroup.tsx";
import docsMd from "./CheckboxGroup.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    label: "Include these accounts",
    onValueChange: fn(),
    options: [
      { value: "everyday", label: "Everyday" },
      { value: "savings", label: "Rainy day savings" },
      { value: "travel", label: "Travel" },
    ],
  },
} satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Include these accounts" })).toBeVisible();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Travel" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["travel"]);
  },
};
export const SelectAll: Story = {
  args: { selectAllLabel: "All accounts", defaultValue: ["everyday"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole("checkbox", { name: "All accounts" });
    await expect(all).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(all);
    await expect(canvas.getByRole("checkbox", { name: "Travel" })).toBeChecked();
    await expect(all).toHaveAttribute("aria-checked", "true");
  },
};
export const WithError: Story = { args: { error: "Choose at least one account", hint: "Your statement lists these accounts" } };
export const Horizontal: Story = { args: { orientation: "horizontal", label: "Notify me about" , options: [{ value: "in", label: "Money in" }, { value: "out", label: "Money out" }, { value: "cards", label: "Card payments" }] } };
export const WithDisabled: Story = { args: { options: [{ value: "everyday", label: "Everyday" }, { value: "business", label: "Business", disabled: true, hint: "Statements for business accounts come from Leeward Business" }] } };

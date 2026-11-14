import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stepper } from "./Stepper.tsx";
import docsMd from "./Stepper.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { steps: ["Recipient", "Amount", "Review", "Confirm"], current: 1, label: "Transfer progress" },
  decorators: [(Story) => <div style={{ maxWidth: "560px" }}><Story /></div>],
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Transfer progress" })).toBeVisible();
    await expect(canvas.getByText("Amount").closest("li")).toHaveAttribute("aria-current", "step");
  },
};
export const LastStep: Story = { args: { current: 3 } };
export const Compact: Story = { args: { variant: "compact" } };

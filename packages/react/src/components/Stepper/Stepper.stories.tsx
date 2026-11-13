import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper.tsx";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  args: { steps: ["Recipient", "Amount", "Review", "Confirm"], current: 1, label: "Transfer progress" },
  decorators: [(Story) => <div style={{ maxWidth: "560px" }}><Story /></div>],
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};
export const LastStep: Story = { args: { current: 3 } };
export const Compact: Story = { args: { variant: "compact" } };

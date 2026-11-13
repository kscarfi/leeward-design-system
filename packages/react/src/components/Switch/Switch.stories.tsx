import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch.tsx";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { label: "Online card payments" },
  decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>],
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("switch", { name: "Online card payments" });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};
export const On: Story = { args: { defaultChecked: true } };
export const WithHint: Story = { args: { label: "Round up payments", hint: "We move the change to your savings", defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true, hint: "Your card is frozen" } };

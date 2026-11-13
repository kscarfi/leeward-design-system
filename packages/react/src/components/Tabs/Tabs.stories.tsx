import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Text } from "../Text/Text.tsx";
import { Tabs } from "./Tabs.tsx";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    label: "Account views",
    items: [
      { value: "activity", label: "Activity", content: <Text>Your last 30 days of payments.</Text> },
      { value: "statements", label: "Statements", content: <Text>Monthly statements as PDF.</Text> },
      { value: "details", label: "Details", content: <Text>IBAN, account number and branch.</Text> },
    ],
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Activity" }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Statements" })).toHaveAttribute("aria-selected", "true");
  },
};
export const FullWidth: Story = { args: { fullWidth: true }, decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>] };
export const DisabledTab: Story = {
  args: {
    items: [
      { value: "a", label: "Cards", content: <Text>Your cards.</Text> },
      { value: "b", label: "Loans", content: <Text>Coming soon.</Text>, disabled: true },
    ],
  },
};

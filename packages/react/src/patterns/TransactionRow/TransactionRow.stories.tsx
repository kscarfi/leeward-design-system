import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Card } from "../../components/Card/Card.tsx";
import { TransactionRow } from "./TransactionRow.tsx";
import docsMd from "./TransactionRow.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { iconNames } from "../../components/Icon/icons.ts";

const date = new Date("2026-11-12T10:30:00");

const meta = {
  title: "Patterns/TransactionRow",
  component: TransactionRow,
  argTypes: { icon: { control: "select", options: iconNames } },
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { merchant: "Coffee Lab", category: "Eating out", date, amount: 85, direction: "outgoing", currency: "TRY", locale: "tr-TR" },
  decorators: [(Story) => <Card padding="none" style={{ maxWidth: "420px" }}><ul style={{ margin: 0, padding: 0 }}><Story /></ul></Card>],
} satisfies Meta<typeof TransactionRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Outgoing: Story = { args: { icon: "coffee" } };
export const Incoming: Story = { args: { merchant: "Salary, Acme Studio", category: "Income", amount: 52000, direction: "incoming", icon: "bank" } };
export const Pending: Story = { args: { merchant: "City Transit", category: "Transport", amount: 42.5, status: "pending", icon: "transport" } };
export const Declined: Story = { args: { merchant: "Online Store", category: "Shopping", amount: 1299, status: "declined", icon: "shopping-bag" } };
export const Interactive: Story = {
  args: { icon: "coffee", onClick: fn() },
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole("button");
    await expect(row).toHaveAccessibleName(/Coffee Lab, Eating out, 12 Kasım 2026, Para çıkışı 85,00/);
  },
};
export const English: Story = { args: { icon: "coffee", locale: "en-US", onClick: fn() } };
export const Initials: Story = { args: { merchant: "Deniz Yılmaz", category: "Transfer", amount: 250, direction: "incoming" } };

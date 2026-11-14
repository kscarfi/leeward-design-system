import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PaymentCard } from "./PaymentCard.tsx";
import docsMd from "./PaymentCard.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/PaymentCard",
  component: PaymentCard,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { name: "Everyday debit", last4: "4821", expiry: "08/28", holder: "Ece Kaya", type: "Debit" },
  decorators: [(Story) => <div style={{ maxWidth: "340px" }}><Story /></div>],
} satisfies Meta<typeof PaymentCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("article", { name: "Everyday debit, Card ending in 4 8 2 1, Expires 08/28" })).toBeVisible();
  },
};
export const Frozen: Story = {
  args: { frozen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("article", { name: /Frozen$/ })).toBeVisible();
    await expect(canvas.getByText("Frozen")).toBeVisible();
  },
};
export const Virtual: Story = { args: { name: "Online shopping", type: "Virtual", last4: "0937", expiry: "02/27" } };
export const Turkish: Story = { args: { locale: "tr-TR", name: "Günlük banka kartı", type: "Banka kartı", frozen: true } };

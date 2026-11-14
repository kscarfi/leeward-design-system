import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SpendingBreakdown } from "./SpendingBreakdown.tsx";
import docsMd from "./SpendingBreakdown.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/SpendingBreakdown",
  component: SpendingBreakdown,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    title: "Spending in November",
    currency: "TRY",
    locale: "en-US",
    categories: [
      { name: "Bills", amount: 3100, icon: "bill" },
      { name: "Groceries", amount: 4200, icon: "cart" },
      { name: "Eating out", amount: 1850, icon: "restaurant" },
      { name: "Transport", amount: 960, icon: "transport" },
      { name: "Shopping", amount: 640, icon: "shopping-bag" },
      { name: "Gifts", amount: 0, icon: "gift" },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: "440px" }}><Story /></div>],
} satisfies Meta<typeof SpendingBreakdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = within(within(canvasElement).getByRole("region", { name: "Spending in November" })).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    // Sorted by amount, zero left out.
    await expect(items).toHaveLength(5);
    await expect(items[0]).toHaveTextContent("Groceries");
    await expect(items[0]).toHaveTextContent("39% of total");
  },
};
export const Turkish: Story = { args: { locale: "tr-TR", title: "Kasım harcamaları", categories: [{ name: "Market", amount: 4200, icon: "cart" }, { name: "Faturalar", amount: 3100, icon: "bill" }, { name: "Ulaşım", amount: 960, icon: "transport" }] } };

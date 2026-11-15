import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import docsMd from "./Table.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Table } from "./Table.tsx";
import { AmountDisplay } from "../../patterns/AmountDisplay/AmountDisplay.tsx";

interface Row { id: string; date: Date; merchant: string; category: string; amount: number }
const rows: Row[] = [
  { id: "1", date: new Date("2026-11-12"), merchant: "Coffee Lab", category: "Eating out", amount: -85 },
  { id: "2", date: new Date("2026-11-11"), merchant: "Salary", category: "Income", amount: 52000 },
  { id: "3", date: new Date("2026-11-10"), merchant: "Migros", category: "Groceries", amount: -642.4 },
  { id: "4", date: new Date("2026-11-08"), merchant: "Istanbulkart", category: "Transport", amount: -150 },
];

const meta = {
  title: "Components/Table",
  component: Table<Row>,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    caption: "Transactions in November",
    rows,
    rowKey: (r: Row) => r.id,
    defaultSort: { key: "date", direction: "descending" },
    columns: [
      { key: "date", header: "Date", sortable: true, render: (r: Row) => r.date.toLocaleDateString("en-US", { day: "numeric", month: "short" }), sortValue: (r: Row) => r.date },
      { key: "merchant", header: "Merchant", sortable: true },
      { key: "category", header: "Category" },
      { key: "amount", header: "Amount", align: "end", sortable: true, render: (r: Row) => <AmountDisplay value={r.amount} currency="TRY" size="sm" direction={r.amount < 0 ? "outgoing" : "incoming"} /> },
    ],
  },
} satisfies Meta<typeof Table<Row>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table", { name: "Transactions in November" });
    await expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Coffee Lab");
    await userEvent.click(canvas.getByRole("button", { name: /^Merchant/ }));
    await expect(canvas.getByRole("columnheader", { name: /Merchant/ })).toHaveAttribute("aria-sort", "ascending");
    await expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Coffee Lab");
    await userEvent.click(canvas.getByRole("button", { name: /^Merchant/ }));
    await expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Salary");
  },
};
export const Empty: Story = { args: { rows: [], emptyText: "No transactions in November" } };
export const Narrow: Story = { decorators: [(Story) => <div style={{ maxWidth: "320px" }}><Story /></div>] };

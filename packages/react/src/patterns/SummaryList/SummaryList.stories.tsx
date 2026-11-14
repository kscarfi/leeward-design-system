import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SummaryList } from "./SummaryList.tsx";
import { AmountDisplay } from "../AmountDisplay/AmountDisplay.tsx";
import docsMd from "./SummaryList.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/SummaryList",
  component: SummaryList,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    items: [
      { label: "Recipient", value: "Deniz Yılmaz", hint: "TR•• •••• •••• •••• •••• ••13 26" },
      { label: "Amount", value: <AmountDisplay value={250} currency="TRY" locale="tr-TR" /> },
      { label: "Fee", value: <AmountDisplay value={0} currency="TRY" locale="tr-TR" />, hint: "Free for Leeward accounts" },
      { label: "Arrives", value: "In a few seconds" },
    ],
    total: { label: "Total", value: <AmountDisplay value={250} currency="TRY" locale="tr-TR" /> },
  },
  decorators: [(Story) => <div style={{ maxWidth: "420px" }}><Story /></div>],
} satisfies Meta<typeof SummaryList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TransferReview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelectorAll("dt")).toHaveLength(5);
    await expect(canvas.getByText("Free for Leeward accounts")).toBeVisible();
    await expect(canvas.getByText("Total").tagName).toBe("DT");
  },
};
export const Receipt: Story = {
  args: {
    items: [
      { label: "Date", value: "12 November 2026, 14:32" },
      { label: "Reference", value: "LW-2026-11-12-0042" },
      { label: "From", value: "Everyday account" },
    ],
  },
};

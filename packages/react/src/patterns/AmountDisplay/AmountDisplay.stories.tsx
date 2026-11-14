import type { Meta, StoryObj } from "@storybook/react-vite";
import { AmountDisplay } from "./AmountDisplay.tsx";
import docsMd from "./AmountDisplay.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/AmountDisplay",
  component: AmountDisplay,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { value: 1250, currency: "TRY", locale: "tr-TR" },
} satisfies Meta<typeof AmountDisplay>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Balance: Story = { args: { size: "lg" } };
export const Incoming: Story = { args: { direction: "incoming" } };
export const Outgoing: Story = { args: { direction: "outgoing" } };
export const Pending: Story = { args: { direction: "outgoing", pending: true } };
export const Masked: Story = { args: { masked: true, size: "lg" } };
export const EnglishLocale: Story = { args: { locale: "en-US", direction: "incoming" } };
export const ForeignCurrency: Story = { args: { currency: "EUR", locale: "tr-TR", direction: "outgoing", value: 89.9 } };

export const Comparison: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
      <AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="incoming" />
      <AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="outgoing" />
      <AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="outgoing" pending />
      <AmountDisplay value={1250} currency="TRY" locale="en-US" direction="incoming" />
      <AmountDisplay value={1250} currency="TRY" locale="en-US" direction="outgoing" />
    </div>
  ),
};

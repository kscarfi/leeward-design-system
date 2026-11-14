import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountCard } from "./AccountCard.tsx";
import docsMd from "./AccountCard.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/AccountCard",
  component: AccountCard,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    name: "Everyday",
    type: "Current account",
    iban: "TR33 0006 1005 1978 6457 8413 26",
    balance: 24580.35,
    currency: "TRY",
    locale: "tr-TR",
    actions: [
      { label: "Send", icon: "arrow-up-right", onClick: fn() },
      { label: "Add money", icon: "plus", onClick: fn() },
      { label: "Details", onClick: fn() },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>],
} satisfies Meta<typeof AccountCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("article", { name: "Everyday, Current account" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Send" }));
    await expect(args.actions?.[0]?.onClick).toHaveBeenCalledOnce();
  },
};
export const Savings: Story = { args: { name: "Rainy day", type: "Savings", balance: 120000, footer: "Earns 42% a year, paid monthly", actions: [{ label: "Add money", icon: "plus", onClick: fn() }] } };
export const Masked: Story = { args: { masked: true } };
export const English: Story = { args: { locale: "en-US" } };

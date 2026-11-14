import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { RecipientRow } from "./RecipientRow.tsx";
import { List } from "../../components/ListItem/ListItem.tsx";
import docsMd from "./RecipientRow.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/RecipientRow",
  component: RecipientRow,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { name: "Deniz Yılmaz", bank: "Leeward", iban: "TR33 0006 1005 1978 6457 8413 26" },
  decorators: [(Story) => <div style={{ maxWidth: "420px" }}><List aria-label="Recipients"><Story /></List></div>],
} satisfies Meta<typeof RecipientRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Choosable: Story = {
  args: { onClick: fn(), favorite: true },
  play: async ({ canvasElement, args }) => {
    const row = within(canvasElement).getByRole("button", { name: /Deniz Yılmaz, Favorite/ });
    await expect(row).toHaveAccessibleName(/IBAN ending in 1 3 2 6/);
    await userEvent.click(row);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
export const Static: Story = {};
export const OtherBank: Story = { args: { name: "Ece Kaya", bank: "Ziraat Bankası", iban: "TR12 0001 0012 3456 7890 1234 56", onClick: fn() } };
export const Turkish: Story = { args: { locale: "tr-TR", favorite: true, onClick: fn() } };

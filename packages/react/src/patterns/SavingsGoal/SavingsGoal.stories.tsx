import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SavingsGoal } from "./SavingsGoal.tsx";
import docsMd from "./SavingsGoal.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/SavingsGoal",
  component: SavingsGoal,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { name: "Tatil fonu", saved: 18500, target: 30000, currency: "TRY", locale: "tr-TR", targetDate: new Date("2027-06-01"), icon: "airplane" },
  decorators: [(Story) => <div style={{ maxWidth: "400px" }}><Story /></div>],
} satisfies Meta<typeof SavingsGoal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: { onAddMoney: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("progressbar", { name: "İlerleme" })).toHaveAttribute("aria-valuenow", "18500");
    await expect(canvas.getByText("%61 biriktirildi")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Para ekle" }));
    await expect(args.onAddMoney).toHaveBeenCalledOnce();
  },
};
export const Reached: Story = {
  args: { saved: 31200, locale: "en-US", currency: "USD", name: "New laptop", icon: "laptop" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Goal reached")).toBeVisible();
  },
};
export const NoDate: Story = { render: ({ name, target, currency, locale }) => <SavingsGoal name={name} saved={2000} target={target} currency={currency} {...(locale ? { locale } : {})} /> };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { Button } from "../../components/Button/Button.tsx";
import { BalanceHeader } from "./BalanceHeader.tsx";
import docsMd from "./BalanceHeader.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/BalanceHeader",
  component: BalanceHeader,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onMaskedChange: fn(), label: "Available balance", balance: 24580.35, currency: "TRY", locale: "tr-TR", meta: "Updated 2 minutes ago" },
} satisfies Meta<typeof BalanceHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Bakiyeyi gizle" });
    await userEvent.click(toggle);
    await expect(canvas.getByRole("button", { name: "Bakiyeyi göster" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("Bakiye gizli")).toBeInTheDocument();
  },
};
export const Hidden: Story = { args: { defaultMasked: true } };
export const English: Story = { args: { locale: "en-US" } };
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button iconStart="arrow-up-right">Send</Button>
        <Button variant="secondary" iconStart="arrow-down-left">Request</Button>
      </>
    ),
  },
};

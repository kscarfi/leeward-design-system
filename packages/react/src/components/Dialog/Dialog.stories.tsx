import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { Text } from "../Text/Text.tsx";
import { Dialog, DialogClose } from "./Dialog.tsx";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: {
    title: "Freeze your card?",
    description: "Card payments and cash withdrawals stop until you unfreeze it. Direct debits keep working.",
    trigger: <Button variant="secondary">Freeze card</Button>,
    actions: (
      <>
        <DialogClose asChild><Button variant="ghost">Keep it active</Button></DialogClose>
        <DialogClose asChild><Button>Freeze card</Button></DialogClose>
      </>
    ),
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Freeze card" }));
    const dialog = await screen.findByRole("dialog", { name: "Freeze your card?" });
    // Wait for the entry animation to finish.
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

export const Open: Story = { args: { defaultOpen: true } };

export const Destructive: Story = {
  args: {
    defaultOpen: true,
    title: "Close your account?",
    description: "This cannot be undone. Move your money out first: the balance must be ₺0,00.",
    actions: (
      <>
        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
        <Button variant="danger">Close account</Button>
      </>
    ),
  },
};

export const WithContent: Story = {
  args: {
    defaultOpen: true,
    title: "Transfer details",
    description: undefined,
    children: <Text tone="secondary">Reference: LW-2026-11-13-0042</Text>,
  },
};

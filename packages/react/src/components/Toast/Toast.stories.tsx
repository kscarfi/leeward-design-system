import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { useToast, type ToastOptions } from "./Toast.tsx";

function Demo(props: ToastOptions) {
  const toast = useToast();
  return <Button variant="secondary" onClick={() => toast.show(props)}>Show toast</Button>;
}

const meta = {
  title: "Components/Toast",
  component: Demo,
  args: { title: "Money sent", tone: "success" },
} satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { description: "Deniz gets ₺250,00 in a few seconds." },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Show toast" }));
    const title = await screen.findByText("Money sent");
    await waitFor(() => expect(title).toBeVisible());
  },
};
export const Neutral: Story = { args: { tone: "neutral", title: "IBAN copied" } };
export const Warning: Story = { args: { tone: "warning", title: "You are close to your daily limit", description: "₺1.500 left today." } };
export const Danger: Story = { args: { tone: "danger", title: "Payment failed", description: "Nothing left your account. Try again." } };
export const WithAction: Story = {
  args: { tone: "neutral", title: "Recipient removed", action: { label: "Undo", altText: "Undo removing the recipient", onClick: () => {} } },
};

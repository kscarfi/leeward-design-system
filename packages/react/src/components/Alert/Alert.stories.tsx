import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { Alert } from "./Alert.tsx";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: { tone: "info", title: "Transfers to other banks take up to one working day", children: "Money sent after 16:00 arrives the next working day." },
  decorators: [(Story) => <div style={{ maxWidth: "520px" }}><Story /></div>],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: "success", title: "Your card is active", children: "You can pay online and in shops." } };
export const Warning: Story = { args: { tone: "warning", title: "You are close to your daily limit", children: "₺1.500 left today. Limits reset at midnight." } };
export const Danger: Story = { args: { tone: "danger", title: "This payment failed", children: "Nothing left your account. Check the IBAN and try again.", live: "alert" } };
export const WithActions: Story = { args: { tone: "warning", actions: <><Button size="sm">Raise limit</Button><Button size="sm" variant="ghost">Not now</Button></> } };
export const Dismissible: Story = { args: { onDismiss: fn() } };
export const TitleOnly: Story = { args: { children: undefined, tone: "neutral", title: "Statements for November are ready" } };

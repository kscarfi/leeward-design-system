import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { QuickActions } from "./QuickActions.tsx";

const meta = {
  title: "Patterns/QuickActions",
  component: QuickActions,
  args: {
    label: "Quick actions",
    actions: [
      { label: "Send", icon: "send", onClick: fn() },
      { label: "Request", icon: "hand-money", onClick: fn() },
      { label: "Top up", icon: "wallet-money", onClick: fn() },
      { label: "Pay bills", icon: "bill", onClick: fn(), badge: 2 },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: "440px" }}><Story /></div>],
} satisfies Meta<typeof QuickActions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

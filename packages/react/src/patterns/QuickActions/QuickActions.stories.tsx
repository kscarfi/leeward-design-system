import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { QuickActions } from "./QuickActions.tsx";
import docsMd from "./QuickActions.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Patterns/QuickActions",
  component: QuickActions,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Send" }));
    await expect(args.actions[0]?.onClick).toHaveBeenCalledOnce();
  },
};

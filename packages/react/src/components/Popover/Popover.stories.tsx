import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import docsMd from "./Popover.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Popover } from "./Popover.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";
import { Link } from "../Link/Link.tsx";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: { docs: { description: { component: docsDescription(docsMd) } }, layout: "centered" },
  args: {
    title: "How is this fee calculated?",
    trigger: <IconButton icon="info" size="sm" label="About this fee" />,
    children: (
      <>
        <p>Transfers to other banks cost ₺4,50. Transfers between Leeward accounts are free.</p>
        <Link href="#fees">See all fees</Link>
      </>
    ),
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "About this fee" }));
    const dialog = await screen.findByRole("dialog", { name: "How is this fee calculated?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};
export const Open: Story = { args: { defaultOpen: true } };

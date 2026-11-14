import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { IconButton } from "../IconButton/IconButton.tsx";
import { DropdownMenu } from "./DropdownMenu.tsx";
import docsMd from "./DropdownMenu.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  args: {
    trigger: <IconButton icon="more-vertical" label="More actions" variant="outline" />,
    actions: [
      { label: "Copy IBAN", icon: "copy", onSelect: fn() },
      { label: "Download statement", icon: "download", onSelect: fn() },
      { label: "Freeze card", icon: "lock", onSelect: fn() },
      { label: "Close account", icon: "trash", onSelect: fn(), destructive: true },
    ],
  },
  parameters: { docs: { description: { component: docsDescription(docsMd) } }, layout: "centered" },
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "More actions" }));
    await expect(await screen.findByRole("menuitem", { name: "Copy IBAN" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    // Wait until Radix restores the page, so axe checks the settled state.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(document.querySelector("[data-aria-hidden]")).toBeNull());
  },
};

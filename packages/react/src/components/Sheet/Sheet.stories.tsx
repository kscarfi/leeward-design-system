import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within, fn } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { Checkbox } from "../Checkbox/Checkbox.tsx";
import { Icon } from "../Icon/Icon.tsx";
import { List, ListItem } from "../ListItem/ListItem.tsx";
import { Sheet, SheetClose } from "./Sheet.tsx";
import docsMd from "./Sheet.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { onOpenChange: fn(),
    title: "Filter transactions",
    trigger: <Button variant="outline" iconStart="filter">Filter</Button>,
    children: (
      <>
        <Checkbox label="Money in" defaultChecked />
        <Checkbox label="Money out" defaultChecked />
        <Checkbox label="Pending only" />
      </>
    ),
    footer: (
      <>
        <SheetClose asChild><Button variant="ghost">Clear</Button></SheetClose>
        <SheetClose asChild><Button>Show results</Button></SheetClose>
      </>
    ),
  },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Filter" }));
    const dialog = await screen.findByRole("dialog", { name: "Filter transactions" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};
export const End: Story = { args: { side: "end", defaultOpen: true } };
export const Start: Story = {
  args: {
    side: "start",
    defaultOpen: true,
    title: "Menu",
    footer: undefined,
    children: (
      <nav aria-label="Main">
        <List>
          <ListItem title="Home" href="#home" leading={<Icon name="home" />} />
          <ListItem title="Payments" href="#payments" leading={<Icon name="arrows-left-right" />} />
          <ListItem title="Cards" href="#cards" leading={<Icon name="card" />} />
          <ListItem title="Settings" href="#settings" leading={<Icon name="settings" />} />
        </List>
      </nav>
    ),
  },
  play: async () => {
    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getByRole("link", { name: "Cards" })).toBeVisible();
  },
};

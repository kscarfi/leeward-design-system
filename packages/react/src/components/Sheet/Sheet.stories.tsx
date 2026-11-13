import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { Checkbox } from "../Checkbox/Checkbox.tsx";
import { Sheet, SheetClose } from "./Sheet.tsx";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  args: {
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

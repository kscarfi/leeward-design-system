import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./PageHeader.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { PageHeader } from "./PageHeader.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";

const meta = { title: "Components/PageHeader", component: PageHeader, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { title: "Send money", onBack: fn() } } satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { actions: <IconButton icon="help" label="Help" /> },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Send money" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};
export const TopLevel: Story = { render: () => <PageHeader title="Home" actions={<IconButton icon="bell" label="Notifications" />} /> };
export const LongTitle: Story = { args: { title: "Statements for the Everyday account in November 2026" }, decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>] };

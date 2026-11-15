import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./Banner.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Banner } from "./Banner.tsx";
import { Link } from "../Link/Link.tsx";

const meta = { title: "Components/Banner", component: Banner, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { tone: "warning", children: "Card payments may fail between 02:00 and 04:00 on Sunday." } } satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { action: <Link href="#schedule">See the schedule</Link>, onDismiss: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Card payments may fail");
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};
export const Info: Story = { args: { tone: "info", children: "Our terms change on 1 January 2027." } };
export const Outage: Story = { args: { tone: "danger", live: "alert", children: "Transfers to other banks are delayed. Your money is safe." } };
export const Success: Story = { args: { tone: "success", children: "Card payments work normally again." } };

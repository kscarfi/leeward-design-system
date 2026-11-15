import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import docsMd from "./Indicator.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Indicator } from "./Indicator.tsx";
import { Avatar } from "../Avatar/Avatar.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";

const meta = { title: "Components/Indicator", component: Indicator, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { count: 3, label: "3 unread notifications", children: <IconButton icon="bell" label="Notifications" variant="outline" /> } } satisfies Meta<typeof Indicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("3 unread notifications")).toBeInTheDocument();
    await expect(canvas.getByText("3")).toBeVisible();
  },
};
export const Dot: Story = { render: () => <Indicator dot label="New messages"><IconButton icon="chat" label="Messages" variant="outline" /></Indicator> };
export const OverMax: Story = { args: { count: 120, label: "120 unread notifications" } };
export const OnAvatar: Story = {
  render: () => (
    <Indicator dot tone="success" placement="bottom" label="Online">
      <Avatar name="Deniz Yılmaz" />
    </Indicator>
  ),
  play: async ({ canvasElement }) => {
    // The dot's center sits on the avatar's circle, not outside it.
    const box = (canvasElement.querySelector("[class*='wrap']") as HTMLElement).getBoundingClientRect();
    const dot = (canvasElement.querySelector("[class*='dot']") as HTMLElement).getBoundingClientRect();
    const r = box.width / 2;
    const distance = Math.hypot(dot.x + dot.width / 2 - (box.x + r), dot.y + dot.height / 2 - (box.y + r));
    await expect(Math.abs(distance - r)).toBeLessThan(2);
  },
};
export const OnRoundedButton: Story = { render: () => <Indicator dot anchor="rectangle" label="New"><IconButton icon="bell" label="Notifications" variant="outline" shape="rounded" /></Indicator> };

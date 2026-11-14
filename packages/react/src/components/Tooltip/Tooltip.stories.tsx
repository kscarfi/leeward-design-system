import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { IconButton } from "../IconButton/IconButton.tsx";
import { Tooltip } from "./Tooltip.tsx";
import docsMd from "./Tooltip.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "The fee is the same for every amount.",
    children: <IconButton icon="info" label="About the fee" />,
  },
  parameters: { docs: { description: { component: docsDescription(docsMd) } }, layout: "centered" },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button", { name: "About the fee" })).toHaveFocus();
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("The fee is the same for every amount.");
  },
};
export const Bottom: Story = { args: { side: "bottom" } };

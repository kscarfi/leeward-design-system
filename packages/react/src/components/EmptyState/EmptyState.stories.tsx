import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../Button/Button.tsx";
import { EmptyState } from "./EmptyState.tsx";
import docsMd from "./EmptyState.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { iconNames } from "../Icon/icons.ts";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  argTypes: { icon: { control: "select", options: iconNames } },
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { icon: "wallet-money", title: "No payments yet", description: "Your payments and transfers show up here as soon as you make them.", action: <Button iconStart="send">Send money</Button> },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 3, name: "No payments yet" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Send money" })).toBeEnabled();
  },
};
export const Search: Story = { args: { icon: "search", title: "No results for “coffe”", description: "Check the spelling or search by amount.", action: undefined } };

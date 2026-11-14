import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Spinner } from "./Spinner.tsx";
import docsMd from "./Spinner.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { label: "Loading your accounts", size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent("Loading your accounts");
  },
};
export const Sizes: Story = { render: () => <div style={{ display: "flex", gap: "var(--lw-space-md)", color: "var(--lw-icon-primary)" }}><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" label="Loading" /></div> };

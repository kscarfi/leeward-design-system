import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import docsMd from "./SkipLink.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { SkipLink } from "./SkipLink.tsx";

const meta = { title: "Components/SkipLink", component: SkipLink, parameters: { docs: { description: { component: docsDescription(docsMd) } } } } satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div>
      <SkipLink {...args} />
      <p>Press Tab to show the link.</p>
      <main id="main" tabIndex={-1}>Main content</main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const link = within(canvasElement).getByRole("link", { name: "Skip to main content" });
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("href", "#main");
  },
};
export const Turkish: Story = { args: { locale: "tr-TR" } };

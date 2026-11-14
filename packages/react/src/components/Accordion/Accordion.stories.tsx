import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Accordion } from "./Accordion.tsx";
import docsMd from "./Accordion.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: {
    items: [
      { value: "fees", title: "What does a transfer cost?", content: "Transfers to Leeward accounts are free. Transfers to other banks cost ₺6,50." },
      { value: "time", title: "How long does it take?", content: "Seconds for Leeward and FAST transfers. Up to one working day for EFT." },
      { value: "limit", title: "What is my daily limit?", content: "₺50.000 by default. You can change it in Settings." },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: "560px" }}><Story /></div>],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "What does a transfer cost?" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};
export const Multiple: Story = { args: { type: "multiple", defaultValue: ["fees", "time"] } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import docsMd from "./Image.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Image } from "./Image.tsx";

// A small inline SVG keeps the story offline and deterministic. It is test data, not interface color.
// eslint-disable-next-line leeward/no-raw-color
const art = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#4F46E5"/><circle cx="11" cy="4" r="2" fill="#A78BFA"/></svg>')}`;

const meta = { title: "Components/Image", component: Image, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { src: art, alt: "Abstract travel offer artwork", ratio: "16 / 9" }, decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>] } satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("img", { name: "Abstract travel offer artwork" })).toBeVisible();
  },
};
export const Fallback: Story = {
  args: { src: "/does-not-exist.png", alt: "Merchant logo" },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByText("Image unavailable")).toBeVisible());
  },
};
export const Square: Story = { args: { ratio: "1" } };

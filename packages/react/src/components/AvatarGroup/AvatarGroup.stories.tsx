import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import docsMd from "./AvatarGroup.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { AvatarGroup } from "./AvatarGroup.tsx";

const meta = { title: "Components/AvatarGroup", component: AvatarGroup, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { people: [{ name: "Deniz Yılmaz" }, { name: "Ece Kaya" }, { name: "Can Öztürk" }, { name: "Elif Şahin" }, { name: "Mert Aydın" }] } } satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("img", { name: "Deniz Yılmaz, Ece Kaya, Can Öztürk and 2 more" })).toBeVisible();
  },
};
export const Two: Story = { args: { people: [{ name: "Deniz Yılmaz" }, { name: "Ece Kaya" }] } };
export const Sizes: Story = { render: (args) => <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>{(["xs", "sm", "md", "lg"] as const).map((s) => <AvatarGroup key={s} {...args} size={s} />)}</div> };
export const Turkish: Story = { args: { locale: "tr-TR" } };

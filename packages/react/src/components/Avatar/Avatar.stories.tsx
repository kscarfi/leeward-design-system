import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar.tsx";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "Deniz Yılmaz" },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const WithIcon: Story = { args: { name: "Groceries", icon: "shopping-bag" } };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "center" }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};
export const BrokenImage: Story = { args: { src: "/does-not-exist.png", name: "Ece Kaya" } };

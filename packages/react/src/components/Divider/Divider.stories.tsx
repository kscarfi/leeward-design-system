import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider.tsx";

const meta = { title: "Components/Divider", component: Divider, decorators: [(Story) => <div style={{ maxWidth: "400px", display: "flex", gap: "var(--lw-space-md)", minHeight: "var(--lw-size-control-lg)", alignItems: "center" }}><Story /></div>] } satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const WithLabel: Story = { args: { label: "or" } };
export const Vertical: Story = { args: { orientation: "vertical" } };

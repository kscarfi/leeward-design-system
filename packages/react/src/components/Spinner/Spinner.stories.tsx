import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner.tsx";

const meta = { title: "Components/Spinner", component: Spinner, args: { label: "Loading your accounts" } } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = { render: () => <div style={{ display: "flex", gap: "var(--lw-space-md)", color: "var(--lw-icon-primary)" }}><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" label="Loading" /></div> };

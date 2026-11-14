import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icon.tsx";
import { iconNames } from "./icons.ts";
import docsMd from "./Icon.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Icon",
  component: Icon,
  argTypes: { name: { control: "select", options: iconNames } },
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { name: "wallet" },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { name: "lock", label: "Secured" } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-md)", alignItems: "center" }}>
      <Icon name="shield" size="xs" />
      <Icon name="shield" size="sm" />
      <Icon name="shield" size="md" />
      <Icon name="shield" size="lg" />
      <Icon name="shield" size="xl" />
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-lg)", alignItems: "center", color: "var(--lw-icon-primary)" }}>
      <Icon name="wallet" size="xl" weight="linear" label="Linear" />
      <Icon name="wallet" size="xl" weight="bold" label="Bold" />
      <Icon name="wallet" size="xl" weight="duotone" label="Duotone" />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "var(--lw-space-md)", padding: 0, margin: 0, listStyle: "none" }}>
      {iconNames.map((name) => (
        <li key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--lw-space-xs)", fontSize: "var(--lw-type-caption-size)", color: "var(--lw-text-muted)" }}>
          <Icon name={name} size="lg" style={{ color: "var(--lw-icon-default)" }} />
          {name}
        </li>
      ))}
    </ul>
  ),
};

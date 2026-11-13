import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icon.tsx";
import { iconNames } from "./icons.ts";

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: { name: "wallet" },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { name: "lock", label: "Secured" } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-md)", alignItems: "center" }}>
      <Icon name="shield" size="sm" />
      <Icon name="shield" size="md" />
      <Icon name="shield" size="lg" />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "var(--lw-space-md)", padding: 0, margin: 0, listStyle: "none" }}>
      {iconNames.map((name) => (
        <li key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--lw-space-xs)", fontSize: "var(--lw-type-caption-size)", color: "var(--lw-color-text-secondary)" }}>
          <Icon name={name} size="lg" style={{ color: "var(--lw-color-icon-primary)" }} />
          {name}
        </li>
      ))}
    </ul>
  ),
};

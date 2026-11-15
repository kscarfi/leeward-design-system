import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Icon } from "./Icon.tsx";
import { iconNames, type IconName } from "./icons.ts";
import { iconMeta } from "./iconMeta.ts";
import { Badge } from "../Badge/Badge.tsx";
import { Heading } from "../Heading/Heading.tsx";
import { Text } from "../Text/Text.tsx";
import { TextField } from "../TextField/TextField.tsx";
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

function Gallery() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const match = (name: IconName) => !q || name.includes(q) || iconMeta[name].keywords.some((k) => k.includes(q));
  const categories = [...new Set(iconNames.map((n) => iconMeta[n].category))];
  const shown = iconNames.filter(match);
  return (
    <div style={{ display: "grid", gap: "var(--lw-space-lg)" }}>
      <div style={{ maxWidth: "360px" }}>
        <TextField label="Search icons" type="search" shape="pill" placeholder="Name or keyword, for example pay" value={query} onChange={(e) => setQuery(e.target.value)} hint={`${shown.length} of ${iconNames.length} icons`} />
      </div>
      {categories.map((category) => {
        const names = shown.filter((n) => iconMeta[n].category === category);
        if (names.length === 0) return null;
        return (
          <section key={category} aria-label={category} style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
            <Heading level={2} size="h6">{category}</Heading>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))", gap: "var(--lw-space-md)", padding: 0, margin: 0, listStyle: "none" }}>
              {names.map((name) => (
                <li key={name} title={iconMeta[name].keywords.join(", ")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--lw-space-2xs)", textAlign: "center" }}>
                  <Icon name={name} size="lg" style={{ color: "var(--lw-icon-default)" }} />
                  <Text as="span" variant="caption" tone="secondary">{name}</Text>
                  {iconMeta[name].reserved && <Badge size="sm" tone="info">Reserved</Badge>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export const AllIcons: Story = {
  render: () => <Gallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Search icons"), "pay");
    // "pay" matches by keyword, not by name.
    await expect(canvas.getByText("send")).toBeVisible();
    await expect(canvas.queryByText("coffee")).not.toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text.tsx";
import docsMd from "./Text.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Text",
  component: Text,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { children: "Your money arrives in seconds." },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
      <Text {...args} variant="body-md">Body md: Your money arrives in seconds.</Text>
      <Text {...args} variant="body-sm">Body sm: Transfers to other banks take up to one working day.</Text>
      <Text {...args} variant="label-md">Label md: Recipient</Text>
      <Text {...args} variant="label-sm">Label sm: Amount</Text>
      <Text {...args} variant="caption">Caption: Updated 2 minutes ago</Text>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
      {(["primary", "secondary", "tertiary", "brand", "success", "warning", "danger"] as const).map((tone) => (
        <Text key={tone} tone={tone}>Tone {tone}</Text>
      ))}
    </div>
  ),
};

export const Tabular: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
      <Text tabular>₺1.111,11</Text>
      <Text tabular>₺9.999,99</Text>
      <Text tabular>₺4.580,00</Text>
    </div>
  ),
};

export const Truncated: Story = {
  args: { truncate: true, children: "A very long merchant name that does not fit on one line in a narrow column" },
  render: (args) => <div style={{ maxWidth: "200px" }}><Text {...args} /></div>,
};

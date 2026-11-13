import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading.tsx";

const meta = {
  title: "Components/Heading",
  component: Heading,
  args: { level: 1, children: "Steady money, whatever the weather." },
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      <Heading level={1} size="display-lg">Display lg 48</Heading>
      <Heading level={2} size="display-md">Display md 40</Heading>
      <Heading level={2} size="xl">Heading xl 32</Heading>
      <Heading level={3} size="lg">Heading lg 28</Heading>
      <Heading level={4} size="md">Heading md 24</Heading>
      <Heading level={5} size="sm">Heading sm 20</Heading>
      <Heading level={6} size="xs">Heading xs 16</Heading>
    </div>
  ),
};

export const LevelDiffersFromSize: Story = { args: { level: 2, size: "sm", children: "Recent activity" } };

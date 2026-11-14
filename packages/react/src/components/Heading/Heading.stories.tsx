import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading.tsx";
import docsMd from "./Heading.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";

const meta = {
  title: "Components/Heading",
  component: Heading,
  parameters: { docs: { description: { component: docsDescription(docsMd) } } },
  args: { level: 1, children: "Steady money, whatever the weather." },
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      <Heading level={1} size="display-lg">Display lg: Steady money</Heading>
      <Heading level={2} size="display-md">Display md: On the sheltered side</Heading>
      <Heading level={2} size="title-xl">Title xl: Good morning, Ece</Heading>
      <Heading level={2} size="title-lg">Title lg: Your accounts</Heading>
      <Heading level={2} size="title-md">Title md: Send money</Heading>
      <Heading level={2} size="title-sm">Title sm: Card settings</Heading>
      <Heading level={2} size="title-xs">Title xs: Holiday fund</Heading>
      <Heading level={2} size="h1">H1: Recent activity</Heading>
      <Heading level={3} size="h2">H2: Savings goals</Heading>
      <Heading level={4} size="h3">H3: This week</Heading>
      <Heading level={5} size="h4">H4: Fees</Heading>
      <Heading level={6} size="h5">H5: Account details</Heading>
      <Heading level={6} size="h6">H6: Limits</Heading>
    </div>
  ),
};

export const LevelDiffersFromSize: Story = { args: { level: 2, size: "sm", children: "Recent activity" } };

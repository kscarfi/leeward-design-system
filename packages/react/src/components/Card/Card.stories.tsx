import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "../Heading/Heading.tsx";
import { Text } from "../Text/Text.tsx";
import { Card } from "./Card.tsx";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    children: (
      <>
        <Heading level={3} size="sm">Savings goal</Heading>
        <Text tone="secondary">You saved ₺4.500 of ₺10.000 this year.</Text>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { variant: "elevated" } };
export const Filled: Story = { args: { variant: "filled" } };
export const LargePadding: Story = { args: { padding: "lg", variant: "elevated" } };

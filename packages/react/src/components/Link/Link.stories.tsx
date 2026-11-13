import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../Text/Text.tsx";
import { Link } from "./Link.tsx";

const meta = { title: "Components/Link", component: Link, args: { href: "#fees", children: "See all fees" } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = { args: { variant: "standalone" } };
export const Inline: Story = { render: (args) => <Text>Transfers are free. <Link {...args}>See all fees</Link> for card payments abroad.</Text> };
export const External: Story = { args: { variant: "standalone", external: true, href: "https://example.com", children: "Deposit insurance details" } };

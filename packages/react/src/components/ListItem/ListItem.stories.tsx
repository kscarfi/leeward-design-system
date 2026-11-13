import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Avatar } from "../Avatar/Avatar.tsx";
import { Badge } from "../Badge/Badge.tsx";
import { Card } from "../Card/Card.tsx";
import { Icon } from "../Icon/Icon.tsx";
import { Switch } from "../Switch/Switch.tsx";
import { List, ListItem } from "./ListItem.tsx";

const meta = {
  title: "Components/ListItem",
  component: ListItem,
  args: { title: "Deniz Yılmaz", description: "TR•• •••• •••• •••• •••• 4821" },
  decorators: [(Story) => <Card padding="none" style={{ maxWidth: "400px" }}><List><Story /></List></Card>],
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = { args: { leading: <Avatar name="Deniz Yılmaz" decorative /> } };
export const Button: Story = { args: { leading: <Avatar name="Deniz Yılmaz" decorative />, onClick: fn(), chevron: true } };
export const Link: Story = { args: { title: "Statements", description: "Download monthly PDFs", href: "#statements", leading: <Icon name="receipt" />, chevron: true } };
export const WithBadge: Story = { args: { title: "Virtual card", description: "Ends in 2291", leading: <Icon name="card" />, trailing: <Badge tone="success">Active</Badge> } };

export const SettingsList: Story = {
  render: () => (
    <>
      <ListItem title="Notifications" leading={<Icon name="bell" />} href="#notifications" chevron />
      <ListItem title="Security" description="Passcode, Face ID" leading={<Icon name="shield" />} href="#security" chevron />
      <li style={{ padding: "var(--lw-space-sm) var(--lw-space-md)" }}>
        <Switch label="Show balance on home" defaultChecked />
      </li>
    </>
  ),
};

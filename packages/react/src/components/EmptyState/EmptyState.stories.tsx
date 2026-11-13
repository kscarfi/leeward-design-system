import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button.tsx";
import { EmptyState } from "./EmptyState.tsx";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: { icon: "wallet-money", title: "No payments yet", description: "Your payments and transfers show up here as soon as you make them.", action: <Button iconStart="send">Send money</Button> },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Search: Story = { args: { icon: "search", title: "No results for “coffe”", description: "Check the spelling or search by amount.", action: undefined } };

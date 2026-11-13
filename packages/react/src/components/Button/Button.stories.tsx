import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button.tsx";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Send money", onClick: fn() },
  argTypes: { iconStart: { control: "text" }, iconEnd: { control: "text" } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Send money" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
export const Secondary: Story = { args: { variant: "secondary", children: "Request money" } };
export const Outline: Story = { args: { variant: "outline", children: "Download statement" } };
export const Ghost: Story = { args: { variant: "ghost", children: "See all" } };
export const Danger: Story = { args: { variant: "danger", children: "Close account" } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="xs">Extra small</Button>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
      <Button {...args} size="xl">Extra large</Button>
    </div>
  ),
};

export const WithIcons: Story = { args: { iconStart: "arrow-up-right", children: "Send" } };
export const IconEnd: Story = { args: { variant: "secondary", iconEnd: "arrow-right", children: "Continue" } };

export const Loading: Story = {
  args: { loading: true, children: "Sending" },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Sending" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true, size: "xl", children: "Confirm transfer" } };

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--lw-space-sm)", justifyItems: "start" }}>
      {(["primary", "secondary", "outline", "ghost", "danger"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: "var(--lw-space-sm)", flexWrap: "wrap" }}>
          <Button {...args} variant={variant}>{variant}</Button>
          <Button {...args} variant={variant} disabled>Disabled</Button>
          <Button {...args} variant={variant} loading>Loading</Button>
        </div>
      ))}
    </div>
  ),
};

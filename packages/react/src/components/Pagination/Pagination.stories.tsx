import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./Pagination.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { useState } from "react";
import { Pagination } from "./Pagination.tsx";

const meta = { title: "Components/Pagination", component: Pagination, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { page: 5, totalPages: 12, onPageChange: fn() } } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={(p) => { setPage(p); args.onPageChange(p); }} />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(6);
    await expect(canvas.getByRole("button", { name: "Page 6" })).toHaveAttribute("aria-current", "page");
  },
};
export const FirstPage: Story = { args: { page: 1 } };
export const UnknownTotal: Story = { render: (args) => <Pagination page={3} hasNext onPageChange={args.onPageChange} /> };
export const Turkish: Story = { args: { locale: "tr-TR" } };

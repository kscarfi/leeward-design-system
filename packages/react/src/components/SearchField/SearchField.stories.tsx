import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./SearchField.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { SearchField } from "./SearchField.tsx";

const meta = { title: "Components/SearchField", component: SearchField, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Search transactions", placeholder: "Merchant or amount", onSearch: fn(), onValueChange: fn() }, decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>] } satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("search")).toBeInTheDocument();
    const field = canvas.getByRole("searchbox", { name: "Search transactions" });
    await userEvent.type(field, "coffee{Enter}");
    await expect(args.onSearch).toHaveBeenCalledWith("coffee");
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(field).toHaveValue("");
    await expect(field).toHaveFocus();
  },
};
export const Rounded: Story = { args: { shape: "rounded" } };
export const Small: Story = { args: { size: "sm" } };

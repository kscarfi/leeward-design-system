import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./Combobox.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Combobox } from "./Combobox.tsx";

const banks = [
  { value: "leeward", label: "Leeward", icon: "bank" as const },
  { value: "ziraat", label: "Ziraat Bankası", description: "Bank code 0010", icon: "bank" as const },
  { value: "isbank", label: "Türkiye İş Bankası", description: "Bank code 0064", icon: "bank" as const },
  { value: "garanti", label: "Garanti BBVA", description: "Bank code 0062", icon: "bank" as const },
  { value: "akbank", label: "Akbank", description: "Bank code 0046", icon: "bank" as const },
];

const meta = { title: "Components/Combobox", component: Combobox, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Bank", placeholder: "Start typing a bank name", options: banks, onValueChange: fn() }, decorators: [(Story) => <div style={{ maxWidth: "360px", minHeight: "360px" }}><Story /></div>] } satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Bank" });
    await userEvent.type(input, "iş");
    // Turkish-aware matching: "iş" finds "Türkiye İş Bankası".
    await expect(canvas.getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith("isbank");
    await expect(input).toHaveValue("Türkiye İş Bankası");
  },
};
export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox", { name: "Bank" }), "zzz");
    await expect(canvas.getByText("No results")).toBeVisible();
  },
};
export const Pill: Story = { args: { shape: "pill" } };
export const WithError: Story = { args: { error: "Choose the recipient's bank" } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import docsMd from "./FileUpload.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { FileUpload } from "./FileUpload.tsx";

const meta = { title: "Components/FileUpload", component: FileUpload, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Proof of address", hint: "PDF or photo, up to 1 MB", accept: "application/pdf,image/*", maxSize: 1024 * 1024, onFilesChange: fn() }, decorators: [(Story) => <div style={{ maxWidth: "420px" }}><Story /></div>] } satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Proof of address");
    await userEvent.upload(input, new File(["%PDF"], "utility-bill.pdf", { type: "application/pdf" }));
    await expect(args.onFilesChange).toHaveBeenCalledOnce();
    await expect(canvas.getByText("utility-bill.pdf")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Remove utility-bill.pdf" }));
    await expect(canvas.queryByText("utility-bill.pdf")).toBeNull();
  },
};
export const TooLarge: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(canvas.getByLabelText("Proof of address"), new File([new Uint8Array(2 * 1024 * 1024)], "scan.pdf", { type: "application/pdf" }));
    await expect(canvas.getByText(/scan.pdf is larger than 1 MB/)).toBeVisible();
  },
};
export const Multiple: Story = { args: { label: "Documents", multiple: true, hint: "Up to 5 files" } };
export const Disabled: Story = { args: { disabled: true } };

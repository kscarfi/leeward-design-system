import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import docsMd from "./DatePicker.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { DatePicker } from "./DatePicker.tsx";

const meta = { title: "Components/DatePicker", component: DatePicker, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { label: "Send on", onValueChange: fn() }, decorators: [(Story) => <div style={{ maxWidth: "320px", minHeight: "460px" }}><Story /></div>] } satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Send on");
    await userEvent.type(input, "11/20/2026");
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 20));
    await userEvent.clear(input);
    await userEvent.type(input, "13/45/2026");
    await userEvent.tab();
    await expect(canvas.getByText("Enter a date as MM/DD/YYYY.")).toBeVisible();
  },
};
export const OpenCalendar: Story = {
  args: { defaultValue: new Date(2026, 10, 18) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Choose date" }));
    await waitFor(() => expect(screen.getByRole("grid", { name: "November 2026" })).toBeVisible());
    await userEvent.click(screen.getByRole("button", { name: "Friday, November 20, 2026" }));
    await expect(within(canvasElement).getByLabelText("Send on")).toHaveValue("11/20/2026");
  },
};
export const Turkish: Story = { args: { locale: "tr-TR", label: "Gönderim tarihi", defaultValue: new Date(2026, 10, 18) } };
export const WithError: Story = { args: { error: "Choose a weekday" } };

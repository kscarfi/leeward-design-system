import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, Chip, Heading, IconButton, SegmentedControl, Select, Text, TextField } from "@leeward/react";

const meta = {
  title: "Foundations/Control sizes",
  parameters: {
    docs: {
      description: {
        component:
          "One control scale for every interactive control. A Button (rounded or pill), IconButton, TextField, Select, SegmentedControl and Chip of the same size have exactly the same height and radius, so they line up in toolbars and forms. Heights: xs 32, sm 36, md 44, lg 48, xl 56 px (compact brands step down). Radius grows with size: xs 6, sm 8, md 10, lg and xl 12 px. Every control keeps a 44 px hit area.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const options = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function Row({ size, shape = "rounded" }: { size: "sm" | "md" | "lg"; shape?: "rounded" | "pill" }) {
  const key = shape === "pill" ? `${size}-pill` : size;
  return (
    <section aria-label={`Size ${key}`} data-row={key} style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
      <Heading level={2} size="h5">Size {size}{shape === "pill" ? ", pill" : ""}</Heading>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--lw-space-sm)" }}>
        <Button size={size} shape={shape} data-measure="Button">Send</Button>
        <Button size={size} shape="pill" variant="secondary" data-measure="ButtonPill">Request</Button>
        <IconButton size={size} variant="outline" icon="settings" label={`Settings ${key}`} data-measure="IconButton" />
        <div style={{ width: "180px" }}>
          <TextField size={size} shape={shape} label={`Name ${key}`} placeholder="Deniz" />
        </div>
        <div style={{ width: "180px" }}>
          <Select size={size} shape={shape} label={`Account ${key}`} options={[{ value: "a", label: "Everyday" }]} />
        </div>
        <SegmentedControl size={size} shape={shape} label={`Period ${key}`} options={options} />
        {size !== "lg" && <Chip size={size} data-measure="Chip">Bills</Chip>}
      </div>
    </section>
  );
}

const expected: Record<string, string> = { sm: "--lw-control-height-sm", md: "--lw-control-height-md", lg: "--lw-control-height-lg" };

export const Alignment: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-xl)" }}>
      <Text tone="secondary">Every control in a row must be exactly as tall as the control height token for that size.</Text>
      <Row size="sm" />
      <Row size="md" />
      <Row size="lg" />
      <Row size="md" shape="pill" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const key of ["sm", "md", "lg", "md-pill"] as const) {
      const size = key.split("-")[0] as "sm" | "md" | "lg";
      const row = canvasElement.querySelector(`[data-row="${key}"]`) as HTMLElement;
      const canvas = within(row);
      const tokenPx = parseFloat(getComputedStyle(row).getPropertyValue(expected[size]!)) * (getComputedStyle(row).getPropertyValue(expected[size]!).includes("rem") ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1);
      const parts: Array<[string, HTMLElement]> = [
        ["Button", row.querySelector('[data-measure="Button"]') as HTMLElement],
        ["Button pill", row.querySelector('[data-measure="ButtonPill"]') as HTMLElement],
        ["IconButton", row.querySelector('[data-measure="IconButton"]') as HTMLElement],
        ["TextField", (canvas.getByLabelText(`Name ${key}`) as HTMLElement).parentElement as HTMLElement],
        ["Select", canvas.getByRole("combobox", { name: `Account ${key}` })],
        ["SegmentedControl", canvas.getByRole("radiogroup", { name: `Period ${key}` })],
      ];
      const chip = row.querySelector('[data-measure="Chip"]') as HTMLElement | null;
      if (chip) parts.push(["Chip", chip]);
      for (const [name, el] of parts) {
        await expect({ size: key, name, height: Math.round(el.getBoundingClientRect().height) }).toEqual({ size: key, name, height: Math.round(tokenPx) });
      }
    }
  },
};

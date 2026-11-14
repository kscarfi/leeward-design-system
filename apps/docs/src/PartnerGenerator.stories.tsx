/* eslint-disable leeward/no-raw-color -- this page takes a raw seed color as input on purpose */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useMemo, useState } from "react";
import { AccountCard, Badge, BalanceHeader, Button, Card, Heading, List, Switch, Text, TextField, TransactionRow } from "@leeward/react";
import primitives from "@leeward/tokens/primitives.json";
import { generatePartnerTheme, rampsFromPrimitives } from "@leeward/tokens/partner";
import { Ramp } from "./Ramp.tsx";

const ramps = rampsFromPrimitives(primitives);

const meta = { title: "Themes/Partner generator", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

function Preview({ theme, mode }: { theme: string; mode: string }) {
  return (
    <div data-brand="live" data-theme={theme} style={{ padding: "var(--lw-space-lg)", display: "grid", gap: "var(--lw-space-md)", borderRadius: "var(--lw-radius-card)" }}>
      <BalanceHeader label={`Total balance, ${mode} preview`} balance={144580.35} currency="TRY" locale="tr-TR" actions={<><Button iconStart="arrow-up-right">Send</Button><Button variant="secondary">Request</Button></>} />
      <AccountCard headingLevel={2} name="Everyday" type="Current account" iban="TR33 0006 1005 1978 6457 8413 26" balance={24580.35} currency="TRY" locale="tr-TR" actions={[{ label: "Add money", icon: "plus", onClick: () => {} }]} />
      <Card padding="none">
        <List>
          <TransactionRow merchant="Salary" category="Income" date={new Date("2026-11-12")} amount={52000} direction="incoming" currency="TRY" locale="tr-TR" icon="bank" />
          <TransactionRow merchant="Coffee Lab" category="Eating out" date={new Date("2026-11-12")} amount={85} direction="outgoing" currency="TRY" locale="tr-TR" icon="coffee" status="pending" />
        </List>
      </Card>
      <Switch label="Online card payments" defaultChecked />
    </div>
  );
}

// One click starting points, so the page works even where the native color picker does not.
const presets: Array<[string, string]> = [
  ["Teal", "#0E7490"],
  ["Ocean", "#1D4ED8"],
  ["Violet", "#7C3AED"],
  ["Berry", "#BE185D"],
  ["Coral", "#E11D48"],
  ["Amber", "#B45309"],
  ["Forest", "#15803D"],
  ["Graphite", "#334155"],
];

/** "0e7490", "#0E7490" and "#0e7" all become "#0e7490". Anything else is not a color yet. */
function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(raw)) return `#${raw.split("").map((c) => c + c).join("")}`.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(raw)) return `#${raw}`.toLowerCase();
  return null;
}

function Generator() {
  const [input, setInputValue] = useState("#0E7490");
  // The last valid color. While someone is still typing, the page keeps showing its theme.
  const [seed, setSeed] = useState("#0e7490");
  const [pin, setPin] = useState(false);
  const setInput = (value: string) => {
    setInputValue(value);
    const hex = normalizeHex(value);
    if (hex) setSeed(hex);
  };
  const valid = normalizeHex(input) !== null;
  const theme = useMemo(() => {
    try {
      return generatePartnerTheme({ name: "live", seed, pinAction: pin, ramps });
    } catch {
      return null;
    }
  }, [seed, pin]);

  return (
    <main style={{ display: "grid", gap: "var(--lw-space-lg)", padding: "var(--lw-space-lg) var(--lw-space-md)", maxWidth: "var(--lw-size-content-lg)", margin: "0 auto" }}>
      {theme && <style>{theme.css}</style>}
      <header style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
        <Heading level={1} size="lg">Partner theme from one color</Heading>
        <Text tone="secondary">Pick a brand color. The generator builds OKLCH ramps, maps every semantic role for light and dark, and runs the same contrast resolver as the core brands, and checks {theme?.results.length ?? 0} required pairs against WCAG 2.2 AA.</Text>
      </header>
      <div style={{ display: "flex", gap: "var(--lw-space-md)", alignItems: "flex-end", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "var(--lw-space-2xs)", fontSize: "var(--lw-type-label-sm-size)", fontWeight: "var(--lw-type-label-sm-weight)" }}>
          Seed color
          <input type="color" value={seed} onChange={(e) => setInput(e.target.value)} style={{ width: "var(--lw-size-control-lg)", height: "var(--lw-size-control-md)", border: 0, padding: 0, background: "transparent" }} />
        </label>
        <div style={{ width: "200px" }}><TextField label="Hex" value={input} onChange={(e) => setInput(e.target.value)} error={valid ? undefined : "Enter 3 or 6 hex digits, for example #0E7490"} numeric /></div>
        <Switch label="Use the exact seed for buttons" checked={pin} onCheckedChange={setPin} />
      </div>
      <div role="group" aria-label="Preset colors" style={{ display: "flex", gap: "var(--lw-space-xs)", flexWrap: "wrap" }}>
        {presets.map(([name, hex]) => {
          const active = seed === hex.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              aria-pressed={active}
              onClick={() => setInput(hex)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--lw-space-xs)",
                height: "var(--lw-size-control-sm)",
                padding: "0 var(--lw-space-sm) 0 var(--lw-space-xs)",
                borderRadius: "var(--lw-radius-pill)",
                border: `var(--lw-size-border-default) solid ${active ? "var(--lw-border-strong)" : "var(--lw-border-default)"}`,
                background: active ? "var(--lw-fill-surface-bold)" : "var(--lw-fill-surface-default)",
                color: "var(--lw-text-default)",
                font: "inherit",
                fontSize: "var(--lw-type-label-sm-size)",
                fontWeight: "var(--lw-type-label-sm-weight)",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true" style={{ width: "var(--lw-size-icon-md)", height: "var(--lw-size-icon-md)", borderRadius: "var(--lw-radius-pill)", background: hex }} />
              {name}
            </button>
          );
        })}
      </div>
      {theme ? (
        <>
          <div role="status" style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "center", flexWrap: "wrap" }}>
            {theme.failures.length === 0 ? <Badge tone="success">All {theme.results.length} pairs pass AA</Badge> : <Badge tone="danger">{theme.failures.length} pairs fail AA. The theme would not be written.</Badge>}
            <Text variant="body-sm" tone="secondary">Seed pinned at step {theme.seedStep}</Text>
          </div>
          <Ramp name="Generated ramp" steps={Object.entries(theme.ramp)} marked={String(theme.seedStep)} />
          {theme.failures.length > 0 && (
            <Card variant="filled">
              <Heading level={2} size="xs">Failing pairs</Heading>
              <ul style={{ margin: 0, paddingInlineStart: "var(--lw-space-lg)" }}>
                {theme.failures.map((f) => (
                  <li key={`${f.theme}${f.fg}${f.bg}`}><Text as="span" variant="body-sm">{f.theme}: {f.fg} on {f.bg}, {f.wcag.toFixed(2)}:1</Text></li>
                ))}
              </ul>
            </Card>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "var(--lw-space-md)" }}>
            <Preview theme="light" mode="light" />
            <Preview theme="dark" mode="dark" />
          </div>
        </>
      ) : (
        <Text tone="danger">This color could not be turned into a theme. Try another one.</Text>
      )}
    </main>
  );
}

export const Live: Story = {
  render: () => <Generator />,
};

/** The same page, driven by a test. Hidden from the sidebar so visitors never see it change by itself. */
export const LiveTest: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => <Generator />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const preview = () => canvasElement.querySelector('[data-brand="live"][data-theme="light"]') as HTMLElement;
    const before = getComputedStyle(preview()).getPropertyValue("--lw-fill-primary-default");
    // A preset changes the theme.
    await userEvent.click(canvas.getByRole("button", { name: "Berry" }));
    await expect(canvas.getByRole("button", { name: "Berry" })).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(getComputedStyle(preview()).getPropertyValue("--lw-fill-primary-default")).not.toBe(before));
    // Typing a hex without "#" works, and a half-typed value keeps the last theme on screen.
    const hex = canvas.getByLabelText("Hex");
    await userEvent.clear(hex);
    await userEvent.type(hex, "15803");
    await expect(preview()).toBeInTheDocument();
    await userEvent.type(hex, "D");
    await expect(canvas.getByRole("button", { name: "Forest" })).toHaveAttribute("aria-pressed", "true");
  },
};

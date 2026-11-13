/* eslint-disable leeward/no-raw-color -- this page takes a raw seed color as input on purpose */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { AccountCard, Badge, BalanceHeader, Button, Card, Heading, List, Switch, Text, TextField, TransactionRow } from "@leeward/react";
import primitives from "@leeward/tokens/primitives.json";
import { generatePartnerTheme, rampsFromPrimitives } from "@leeward/tokens/partner";

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

function Generator() {
  const [seed, setSeed] = useState("#0E7490");
  const [pin, setPin] = useState(false);
  const theme = useMemo(() => {
    try {
      return generatePartnerTheme({ name: "live", seed, pinAction: pin, ramps });
    } catch {
      return null;
    }
  }, [seed, pin]);

  return (
    <main style={{ display: "grid", gap: "var(--lw-space-lg)", padding: "var(--lw-space-lg)", maxWidth: "1200px", margin: "0 auto" }}>
      {theme && <style>{theme.css}</style>}
      <header style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
        <Heading level={1} size="lg">Partner theme from one color</Heading>
        <Text tone="secondary">Pick a brand color. The generator builds OKLCH ramps, maps every semantic role for light and dark, and runs the same contrast resolver as the core brands, and checks {theme?.results.length ?? 0} required pairs against WCAG 2.2 AA.</Text>
      </header>
      <div style={{ display: "flex", gap: "var(--lw-space-md)", alignItems: "flex-end", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "var(--lw-space-2xs)", fontSize: "var(--lw-type-label-sm-size)", fontWeight: "var(--lw-type-label-sm-weight)" }}>
          Seed color
          <input type="color" value={seed.length === 7 ? seed : "#000000"} onChange={(e) => setSeed(e.target.value)} style={{ width: "var(--lw-size-control-lg)", height: "var(--lw-size-control-md)", border: 0, padding: 0, background: "transparent" }} />
        </label>
        <div style={{ width: "200px" }}><TextField label="Hex" value={seed} onChange={(e) => setSeed(e.target.value)} numeric /></div>
        <Switch label="Use the exact seed for buttons" checked={pin} onCheckedChange={setPin} />
      </div>
      {theme ? (
        <>
          <div role="status" style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "center", flexWrap: "wrap" }}>
            {theme.failures.length === 0 ? <Badge tone="success">All {theme.results.length} pairs pass AA</Badge> : <Badge tone="danger">{theme.failures.length} pairs fail AA. The theme would not be written.</Badge>}
            <Text variant="body-sm" tone="secondary">Seed pinned at step {theme.seedStep}</Text>
          </div>
          <ol aria-label="Generated ramp" style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: "var(--lw-space-3xs)", padding: 0, margin: 0, listStyle: "none" }}>
            {Object.entries(theme.ramp).map(([step, hex]) => (
              <li key={step} style={{ display: "grid", gap: "var(--lw-space-3xs)", fontSize: "var(--lw-type-caption-size)", color: "var(--lw-text-muted)" }}>
                <span style={{ height: "var(--lw-size-control-lg)", background: hex, borderRadius: "var(--lw-radius-sm)", outline: step === String(theme.seedStep) ? "var(--lw-size-border-strong) solid var(--lw-border-strong)" : undefined }} />
                {step}
              </li>
            ))}
          </ol>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--lw-space-md)" }}>
            <Preview theme="light" mode="light" />
            <Preview theme="dark" mode="dark" />
          </div>
        </>
      ) : (
        <Text tone="danger">Enter a valid color, for example #0E7490.</Text>
      )}
    </main>
  );
}

export const Live: Story = {
  render: () => <Generator />,
};

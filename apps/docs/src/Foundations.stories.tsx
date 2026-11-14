import type { Meta, StoryObj } from "@storybook/react-vite";
import primitives from "@leeward/tokens/primitives.json";
import { tokens, type TokenName } from "@leeward/tokens";
import { Heading, Text } from "@leeward/react";

const meta = { title: "Foundations/Tokens" } satisfies Meta;
export default meta;
type Story = StoryObj;

const light = tokens.leeward.light;
const names = Object.keys(light) as TokenName[];
const group = (prefix: string) => names.filter((n) => n.startsWith(prefix));
const cell = { padding: "var(--lw-space-xs) var(--lw-space-sm)", borderBottom: "var(--lw-size-border-default) solid var(--lw-border-subtle)", textAlign: "start" as const, fontSize: "var(--lw-type-body-sm-size)" };

const ramps = Object.entries(primitives.color).filter(([k]) => !k.startsWith("$")) as Array<[string, Record<string, { $value: string }>]>;

export const Palette: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      <Heading level={2} size="h3">Primitive ramps</Heading>
      <Text tone="secondary">Leeward's primitive ramps. Components never use these directly; brands map them to roles.</Text>
      {ramps.map(([name, steps]) => (
        <div key={name} style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
          <Text variant="label-sm">{name}</Text>
          <ol aria-label={`${name} ramp`} style={{ display: "grid", gridTemplateColumns: `repeat(${Object.keys(steps).length}, minmax(0, 1fr))`, gap: "var(--lw-space-3xs)", margin: 0, padding: 0, listStyle: "none" }}>
            {Object.entries(steps).filter(([s]) => !s.startsWith("$")).map(([step, t]) => (
              <li key={step} style={{ display: "grid", gap: "var(--lw-space-3xs)" }}>
                <span title={`${name}.${step} ${t.$value}`} style={{ height: "var(--lw-size-control-sm)", background: t.$value, borderRadius: "var(--lw-radius-xs)", boxShadow: "inset 0 0 0 1px var(--lw-border-subtle)" }} />
                <Text as="span" variant="caption" tone="tertiary">{step}</Text>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <caption style={{ textAlign: "start", font: "inherit", fontWeight: 700, paddingBottom: "var(--lw-space-sm)" }}>Semantic colors for the current brand and mode</caption>
      <thead>
        <tr><th style={cell}>Swatch</th><th style={cell}>CSS variable</th><th style={cell}>Use</th></tr>
      </thead>
      <tbody>
        {[...group("fill.surface."), ...group("text."), ...group("icon."), ...group("border."), ...group("amount."), ...group("fill.").filter((n) => !n.startsWith("fill.surface."))].map((name) => (
          <tr key={name}>
            <td style={cell}><span style={{ display: "inline-block", width: "var(--lw-size-control-sm)", height: "var(--lw-size-icon-lg)", borderRadius: "var(--lw-radius-xs)", background: `var(${light[name].cssVar})`, boxShadow: "inset 0 0 0 1px var(--lw-border-subtle)" }} /></td>
            <td style={cell}><code>{light[name].cssVar}</code></td>
            <td style={{ ...cell, color: "var(--lw-text-muted)" }}>{light[name].description ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

// Each role with the kind of copy it is made for, in the Leeward voice.
const roles: Array<[string, string, string]> = [
  ["display.lg", "Steady money, whatever the weather", "Marketing headlines and hero moments"],
  ["display.md", "Your money, on the sheltered side", "Large promotional titles"],
  ["title.xl", "Good morning, Ece", "Screen titles on desktop"],
  ["title.lg", "Your accounts", "Screen titles"],
  ["title.md", "Send money", "Flow titles"],
  ["title.sm", "Card settings", "Smaller screen titles"],
  ["title.xs", "Holiday fund", "Card and sheet titles"],
  ["subtitle.lg", "Everything you spent this month, in one place", "Intro lines under titles"],
  ["subtitle.md", "Pick who gets the money", "Intro lines in flows"],
  ["subtitle.sm", "You can change this later", "Short intro lines"],
  ["heading.h1", "Recent activity", "Section heading, level 1"],
  ["heading.h2", "Savings goals", "Section heading, level 2"],
  ["heading.h3", "This week", "Section heading, level 3"],
  ["heading.h4", "Fees", "Card heading"],
  ["heading.h5", "Account details", "Small group heading"],
  ["heading.h6", "Limits", "Smallest heading"],
  ["body.lg", "Transfers to Leeward accounts arrive in seconds and cost nothing.", "Long reading text"],
  ["body.md", "Transfers to other banks take up to one working day.", "Default body text"],
  ["body.sm", "You can find saved recipients under Payments.", "Secondary text and descriptions"],
  ["label.lg", "Total balance", "Large labels"],
  ["label.md", "Recipient", "Field labels and list titles"],
  ["label.sm", "Amount", "Small labels"],
  ["label.xs", "IBAN", "Tight labels in dense rows"],
  ["caption", "Updated 2 minutes ago", "Timestamps and fine print, never under 12 px"],
  ["badge", "PENDING", "Badges and counters"],
  ["button.lg", "Confirm transfer", "Extra large buttons"],
  ["button.md", "Send money", "Default buttons"],
  ["button.sm", "Add money", "Small buttons"],
  ["button.xs", "Details", "Extra small buttons"],
  ["amount.xl", "₺144.580,35", "Hero balance, fluid 36 to 51 px"],
  ["amount.lg", "₺24.580,35", "Account card balances, fluid 28 to 36 px"],
  ["amount.md", "+₺52.000,00", "Summaries"],
  ["amount.sm", "−₺85,00", "Transaction rows"],
  ["code", "TR33 0006 1005 1978 6457 8413 26", "IBANs, references and codes"],
];

const turkish = "Paranız saniyeler içinde hesabınızda. Ücret: ₺0,00.";

export const Typography: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-lg)" }}>
      <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
        <Heading level={2} size="h3">Type roles</Heading>
        <Text tone="secondary">Plus Jakarta Sans for display and text, IBM Plex Mono for codes. Values come from the current brand. Display, title and large amount roles are fluid between 360 and 1280 px.</Text>
      </div>
      {roles.map(([role, sample, use]) => {
        const v = (k: string) => `var(--lw-type-${role.replace(".", "-")}-${k})`;
        const t = light[`type.${role}.size` as TokenName];
        const lh = light[`type.${role}.line-height` as TokenName];
        const w = light[`type.${role}.weight` as TokenName];
        return (
          <div key={role} style={{ display: "grid", gap: "var(--lw-space-2xs)", paddingBottom: "var(--lw-space-md)", borderBottom: "var(--lw-size-border-default) solid var(--lw-border-muted)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--lw-space-xs) var(--lw-space-md)", alignItems: "baseline" }}>
              <Text as="span" variant="label-sm">type.{role}</Text>
              <Text as="span" variant="caption" tone="tertiary">{use}</Text>
              <Text as="span" variant="caption" tone="tertiary">Weight {String(w?.value)}</Text>
              <Text as="span" variant="caption" tone="tertiary">{String(t?.value).startsWith("clamp") ? "Fluid size" : `Size ${String(t?.value)}, line ${String(lh?.value)}`}</Text>
            </div>
            <span style={{ fontFamily: v("family"), fontSize: v("size"), lineHeight: v("line-height"), fontWeight: v("weight"), letterSpacing: v("tracking"), fontVariantNumeric: role.startsWith("amount") ? "tabular-nums" : undefined, color: "var(--lw-text-default)" }}>
              {sample}
            </span>
          </div>
        );
      })}
      <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
        <Heading level={2} size="h3">Turkish and the lira sign</Heading>
        <Text tone="secondary">Every role supports Turkish letters and the lira sign. A sample in body.md and amount.md:</Text>
        <Text>{turkish}</Text>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
      {[...group("space."), ...group("size.control.")].map((name) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-sm)" }}>
          <code style={{ minWidth: "160px", fontSize: "var(--lw-type-body-sm-size)" }}>{name}</code>
          <span style={{ height: "var(--lw-space-md)", width: `var(${light[name].cssVar})`, background: "var(--lw-fill-primary-default)", borderRadius: "var(--lw-radius-xs)" }} />
          <Text as="span" variant="body-sm" tone="secondary">{String(light[name].value)}</Text>
        </div>
      ))}
    </div>
  ),
};

export const Elevation: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-xl)" }}>
      <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Elevation</Heading>
        <Text tone="secondary">Eight levels from the Figma effect styles. In dark mode the same geometry is used with stronger shadows, and surfaces get lighter as they rise.</Text>
        <div style={{ display: "flex", gap: "var(--lw-space-lg)", flexWrap: "wrap" }}>
          {["100", "200", "300", "400", "500", "600", "700", "800"].map((level) => (
            <div key={level} style={{ width: "140px", height: "96px", display: "grid", placeItems: "center", background: "var(--lw-fill-surface-raised)", borderRadius: "var(--lw-radius-card)", boxShadow: `var(--lw-elevation-${level})` }}>
              <Text as="span" variant="label-sm">elevation.{level}</Text>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Focus rings</Heading>
        <Text tone="secondary">Every focus style in the system comes from these tokens. Change them once and every component follows, in every brand and mode.</Text>
        <div style={{ display: "flex", gap: "var(--lw-space-xl)", flexWrap: "wrap", alignItems: "center" }}>
          {[
            ["focus", "Default", "var(--lw-fill-surface-default)"],
            ["focus-inset", "Inset, for rows and tabs", "var(--lw-fill-surface-default)"],
            ["focus-danger", "On a field with an error", "var(--lw-fill-surface-default)"],
            ["focus-halo", "Soft halo, decorative", "var(--lw-fill-surface-default)"],
            ["focus-inverse", "On inverse surfaces", "var(--lw-fill-neutral-default)"],
          ].map(([name, label, bg]) => (
            <div key={name} style={{ display: "grid", gap: "var(--lw-space-xs)", justifyItems: "start" }}>
              <div style={{ padding: "var(--lw-space-md)", background: bg, borderRadius: "var(--lw-radius-lg)" }}>
                <div style={{ width: "120px", height: "var(--lw-size-control-md)", borderRadius: "var(--lw-radius-control)", background: name === "focus-inverse" ? "var(--lw-fill-neutral-emphasis)" : "var(--lw-fill-surface-bold)", boxShadow: `var(--lw-elevation-${name})` }} />
              </div>
              <Text as="span" variant="label-sm">elevation.{name}</Text>
              <Text as="span" variant="caption" tone="tertiary">{label}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

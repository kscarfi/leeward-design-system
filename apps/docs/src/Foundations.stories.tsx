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
        {[...group("fill."), ...group("text."), ...group("icon."), ...group("border."), ...group("amount.")].map((name) => (
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

const roles = ["display.lg", "display.md", "title.xl", "title.lg", "title.md", "title.sm", "title.xs", "subtitle.lg", "subtitle.md", "subtitle.sm", "heading.h1", "heading.h2", "heading.h3", "heading.h4", "heading.h5", "heading.h6", "body.lg", "body.md", "body.sm", "label.lg", "label.md", "label.sm", "label.xs", "caption", "badge", "button.lg", "button.md", "button.sm", "button.xs", "amount.xl", "amount.lg", "amount.md", "amount.sm", "code"];

export const Typography: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      {roles.map((role) => {
        const v = (k: string) => `var(--lw-type-${role.replace(".", "-")}-${k})`;
        return (
          <div key={role} style={{ display: "grid", gap: "var(--lw-space-3xs)" }}>
            <Text as="span" variant="caption" tone="tertiary">type.{role}</Text>
            <span style={{ fontFamily: v("family"), fontSize: v("size"), lineHeight: v("line-height"), fontWeight: v("weight"), letterSpacing: v("tracking"), fontVariantNumeric: role.startsWith("amount") ? "tabular-nums" : undefined }}>
              {role.startsWith("amount") ? "₺24.580,35" : role === "code" ? "TR33 0006 1005 1978" : "Steady money, whatever the weather. Şimdi öde, ğüşıöç."}
            </span>
          </div>
        );
      })}
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
    <div style={{ display: "flex", gap: "var(--lw-space-lg)", flexWrap: "wrap", padding: "var(--lw-space-lg)" }}>
      {["100", "200", "300", "400", "500", "600", "700", "800"].map((level) => (
        <div key={level} style={{ width: "140px", height: "96px", display: "grid", placeItems: "center", background: "var(--lw-fill-surface-raised)", borderRadius: "var(--lw-radius-card)", boxShadow: `var(--lw-elevation-${level})` }}>
          <Text as="span" variant="label-sm">elevation.{level}</Text>
        </div>
      ))}
    </div>
  ),
};

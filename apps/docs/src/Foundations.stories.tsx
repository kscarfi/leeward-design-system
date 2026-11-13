import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens, type TokenName } from "@leeward/tokens";

const meta = { title: "Foundations/Tokens", parameters: { a11y: { test: "error" } } } satisfies Meta;
export default meta;
type Story = StoryObj;

const light = tokens.light;
const names = Object.keys(light) as TokenName[];
const group = (prefix: string) => names.filter((n) => n.startsWith(prefix));

const cell = { padding: "var(--lw-space-xs) var(--lw-space-sm)", borderBottom: "var(--lw-size-border-default) solid var(--lw-color-border-subtle)", textAlign: "start" as const, fontSize: "var(--lw-type-body-sm-size)" };

export const Colors: Story = {
  render: () => (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <caption style={{ textAlign: "start", font: "inherit", fontWeight: 600, paddingBottom: "var(--lw-space-sm)" }}>Semantic colors for the current theme</caption>
      <thead>
        <tr><th style={cell}>Swatch</th><th style={cell}>Token</th><th style={cell}>CSS variable</th><th style={cell}>Use</th></tr>
      </thead>
      <tbody>
        {group("color.").map((name) => (
          <tr key={name}>
            <td style={cell}><span style={{ display: "inline-block", width: "var(--lw-size-control-sm)", height: "var(--lw-size-icon-lg)", borderRadius: "var(--lw-radius-sm)", background: `var(${light[name].cssVar})`, boxShadow: "inset 0 0 0 1px var(--lw-color-border-subtle)" }} /></td>
            <td style={cell}><code>{name}</code></td>
            <td style={cell}><code>{light[name].cssVar}</code></td>
            <td style={{ ...cell, color: "var(--lw-color-text-secondary)" }}>{light[name].description ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

const roles = ["display.lg", "display.md", "heading.xl", "heading.lg", "heading.md", "heading.sm", "heading.xs", "body.md", "body.sm", "label.md", "label.sm", "caption", "amount.lg", "amount.md", "amount.sm"];

export const Typography: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
      {roles.map((role) => {
        const v = (k: string) => `var(--lw-type-${role.replace(".", "-")}-${k})`;
        return (
          <div key={role} style={{ display: "grid", gap: "var(--lw-space-3xs)" }}>
            <span style={{ fontSize: "var(--lw-type-caption-size)", color: "var(--lw-color-text-secondary)" }}>
              type.{role}: {String(light[`type.${role}.size` as TokenName].value)} / {String(light[`type.${role}.line-height` as TokenName].value)}, weight {String(light[`type.${role}.weight` as TokenName].value)}
            </span>
            <span style={{ fontSize: v("size"), lineHeight: v("line-height"), fontWeight: v("weight"), letterSpacing: v("tracking"), fontVariantNumeric: role.startsWith("amount") ? "tabular-nums" : undefined }}>
              {role.startsWith("amount") ? "₺24.580,35" : "Steady money, whatever the weather"}
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
      {group("space.").map((name) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-sm)" }}>
          <code style={{ minWidth: "120px", fontSize: "var(--lw-type-body-sm-size)" }}>{name}</code>
          <span style={{ height: "var(--lw-space-md)", width: `var(${light[name].cssVar})`, background: "var(--lw-color-action-primary-bg)", borderRadius: "var(--lw-radius-sm)" }} />
          <span style={{ fontSize: "var(--lw-type-body-sm-size)", color: "var(--lw-color-text-secondary)" }}>{String(light[name].value)}</span>
        </div>
      ))}
    </div>
  ),
};

export const RadiusAndElevation: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--lw-space-lg)", flexWrap: "wrap" }}>
      {["1", "2", "3"].map((level) => (
        <div key={level} style={{ width: "160px", height: "100px", display: "grid", placeItems: "center", background: "var(--lw-color-surface-raised)", borderRadius: "var(--lw-radius-card)", boxShadow: `var(--lw-shadow-${level})` }}>
          shadow.{level}
        </div>
      ))}
    </div>
  ),
};

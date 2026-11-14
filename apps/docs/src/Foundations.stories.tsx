import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import primitives from "@leeward/tokens/primitives.json";
import { tokens, type TokenName } from "@leeward/tokens";
import { Heading, Text } from "@leeward/react";
import { Ramp } from "./Ramp.tsx";

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
    <div style={{ display: "grid", gap: "var(--lw-space-xl)" }}>
      <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
        <Heading level={2} size="h3">Primitive ramps</Heading>
        <Text tone="secondary">Leeward's primitive ramps, steps 0 to 1000. Components never use these directly; brands map them to roles.</Text>
      </div>
      {ramps.map(([name, steps]) => (
        <Ramp key={name} name={name} steps={Object.entries(steps).filter(([s]) => !s.startsWith("$")).map(([step, t]) => [step, t.$value])} />
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

const typeGroups: Array<[string, string]> = [
  ["display", "Display"],
  ["title", "Title"],
  ["subtitle", "Subtitle"],
  ["heading", "Heading"],
  ["body", "Body"],
  ["label", "Label"],
  ["button", "Button"],
  ["amount", "Amount"],
  ["other", "Caption, badge and code"],
];
const groupOf = (role: string) => (["caption", "badge", "code"].includes(role) ? "other" : role.split(".")[0]!);

/** "1rem" -> "16", "1.5rem" -> "24", fluid "clamp(1.75rem, ..., 2.25rem)" -> "28 to 36". */
const px = (value: unknown) => {
  const v = String(value);
  const rem = (r: string) => String(Math.round(parseFloat(r) * 16 * 10) / 10);
  const fluid = v.match(/^clamp\(([\d.]+)rem,.*,\s*([\d.]+)rem\)$/);
  if (fluid) return `${rem(fluid[1]!)} to ${rem(fluid[2]!)}`;
  return v.endsWith("rem") ? rem(v) : v.replace("px", "");
};

function TypeRow({ role, sample, use }: { role: string; sample: string; use: string }) {
  const v = (k: string) => `var(--lw-type-${role.replace(".", "-")}-${k})`;
  const size = light[`type.${role}.size` as TokenName]?.value;
  const line = light[`type.${role}.line-height` as TokenName]?.value;
  const weight = light[`type.${role}.weight` as TokenName]?.value;
  const fluid = String(size).startsWith("clamp");
  return (
    <li style={{ display: "flex", flexWrap: "wrap", gap: "var(--lw-space-xs) var(--lw-space-lg)", alignItems: "baseline", padding: "var(--lw-space-sm) 0", borderTop: "var(--lw-size-border-default) solid var(--lw-border-muted)" }}>
      <div style={{ flex: "0 0 200px", display: "grid", gap: "var(--lw-space-3xs)" }}>
        <Text as="span" variant="label-sm">{role}</Text>
        <Text as="span" variant="caption" tone="tertiary" tabular>{fluid ? `Fluid ${px(size)} px, line ${px(line)} px` : `${px(size)} / ${px(line)} px`}, weight {String(weight)}</Text>
        <Text as="span" variant="caption" tone="tertiary">{use}</Text>
      </div>
      <span style={{ flex: "1 1 280px", minWidth: 0, overflowWrap: "anywhere", fontFamily: v("family"), fontSize: v("size"), lineHeight: v("line-height"), fontWeight: v("weight"), letterSpacing: v("tracking"), fontVariantNumeric: role.startsWith("amount") ? "tabular-nums" : undefined, color: "var(--lw-text-default)" }}>
        {sample}
      </span>
    </li>
  );
}

const families: Array<[string, string, string, string[]]> = [
  ["Plus Jakarta Sans", "var(--lw-type-body-md-family)", "Display, titles, headings, body, labels, buttons and amounts. Has Turkish letters, the lira sign and tabular figures.", ["400", "500", "600", "700"]],
  ["IBM Plex Mono", "var(--lw-type-code-family)", "IBANs, references and codes, where every character must be easy to tell apart.", ["400", "500"]],
];

export const Typography: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-2xl)" }}>
      <section style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
          <Heading level={2} size="h3">Font families</Heading>
          <Text tone="secondary">Two families, loaded once with @leeward/react/fonts.css.</Text>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "var(--lw-space-md)" }}>
          {families.map(([name, family, use, weights]) => (
            <div key={name} style={{ display: "grid", gap: "var(--lw-space-sm)", alignContent: "start", padding: "var(--lw-space-lg)", borderRadius: "var(--lw-radius-card)", background: "var(--lw-fill-surface-default)", boxShadow: "inset 0 0 0 var(--lw-size-border-default) var(--lw-border-subtle)" }}>
              <span aria-hidden="true" style={{ fontFamily: family, fontSize: "var(--lw-type-display-md-size)", lineHeight: "var(--lw-type-display-md-line-height)", fontWeight: "var(--lw-type-display-md-weight)", color: "var(--lw-text-default)" }}>Aa ₺ 0123</span>
              <Heading level={3} size="h5">{name}</Heading>
              <Text variant="body-sm" tone="secondary">{use}</Text>
              <div style={{ display: "flex", gap: "var(--lw-space-md)", flexWrap: "wrap" }}>
                {weights.map((w) => <span key={w} style={{ fontFamily: family, fontWeight: w, fontSize: "var(--lw-type-body-md-size)", color: "var(--lw-text-default)" }}>{w}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ display: "grid", gap: "var(--lw-space-lg)" }}>
        <div style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
          <Heading level={2} size="h3">Type roles</Heading>
          <Text tone="secondary">Size and line height in px, for the current brand. Display, title and large amount roles are fluid between 360 and 1280 px. Use them through Heading, Text and the amount patterns, or as --lw-type-[role]-size, -line-height, -weight, -tracking and -family.</Text>
        </div>
        {typeGroups.map(([key, label]) => (
          <div key={key} style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
            <Heading level={3} size="h6">{label}</Heading>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {roles.filter(([role]) => groupOf(role) === key).map(([role, sample, use]) => <TypeRow key={role} role={role} sample={sample} use={use} />)}
            </ul>
          </div>
        ))}
      </section>
      <section style={{ display: "grid", gap: "var(--lw-space-2xs)" }}>
        <Heading level={2} size="h3">Turkish and the lira sign</Heading>
        <Text tone="secondary">Every role supports Turkish letters and the lira sign.</Text>
        <Text>{turkish}</Text>
      </section>
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

/** Reads a variable in the current brand and mode. The page remounts when the toolbar changes, so the value follows it. */
function LiveValue({ cssVar }: { cssVar: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return <Text as="span" variant="body-sm" tone="secondary"><span ref={ref}>{value}</span></Text>;
}

function RadiusSwatch({ name, size = 72 }: { name: TokenName; size?: number }) {
  const cssVar = light[name].cssVar;
  return (
    <div style={{ display: "grid", gap: "var(--lw-space-2xs)", justifyItems: "start" }}>
      <div data-radius={name} style={{ width: `${size}px`, height: `${size}px`, background: "var(--lw-fill-primary-weak)", border: "var(--lw-size-border-strong) solid var(--lw-border-primary-subtle)", borderRadius: `var(${cssVar})` }} />
      <code style={{ fontSize: "var(--lw-type-body-sm-size)" }}>{cssVar}</code>
      <LiveValue cssVar={cssVar} />
      {light[name].description && <Text as="span" variant="caption" tone="tertiary">{light[name].description}</Text>}
    </div>
  );
}

const radiusScale = group("radius.").filter((n) => /^radius\.(none|xs|sm|md|lg|xl|2xl|pill)$/.test(n));
const radiusRoles = group("radius.").filter((n) => !radiusScale.includes(n));
const sizeKeys = ["xs", "sm", "md", "lg", "xl"] as const;
const swatchGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 176px), 1fr))", gap: "var(--lw-space-lg)", alignItems: "start" } as const;
const componentRadii = names.filter((n) => /radius/.test(n) && !n.startsWith("radius.") && !n.startsWith("control."));

export const Radius: Story = {
  render: (_, { globals }) => (
    <div key={`${globals.brand ?? "leeward"}-${globals.mode ?? "light"}`} style={{ display: "grid", gap: "var(--lw-space-2xl)" }}>
      <section style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Radius scale</Heading>
        <Text tone="secondary">The base steps. Each brand multiplies them by its roundness, so Leeward Business has tighter corners. Switch the brand in the toolbar to compare.</Text>
        <div style={swatchGrid}>
          {radiusScale.map((name) => <RadiusSwatch key={name} name={name} />)}
        </div>
      </section>
      <section style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Radius roles</Heading>
        <Text tone="secondary">Use these by meaning, not by size: a card always takes the card radius.</Text>
        <div style={swatchGrid}>
          {radiusRoles.map((name) => <RadiusSwatch key={name} name={name} size={96} />)}
        </div>
      </section>
      <section style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Control radius</Heading>
        <Text tone="secondary">Radius grows with control size and never shrinks. Buttons, fields, selects and segmented controls of one size share it. Buttons can also be fully rounded with shape="pill".</Text>
        <div style={{ display: "flex", gap: "var(--lw-space-lg)", flexWrap: "wrap", alignItems: "end" }}>
          {sizeKeys.map((k) => {
            const radius = light[`control.radius.${k}` as TokenName].cssVar;
            return (
              <div key={k} style={{ display: "grid", gap: "var(--lw-space-2xs)", justifyItems: "start" }}>
                <div style={{ width: "120px", height: `var(${light[`control.height.${k}` as TokenName].cssVar})`, background: "var(--lw-fill-primary-weak)", border: "var(--lw-size-border-strong) solid var(--lw-border-primary-subtle)", borderRadius: `var(${radius})` }} />
                <code style={{ fontSize: "var(--lw-type-body-sm-size)" }}>{radius}</code>
                <LiveValue cssVar={radius} />
              </div>
            );
          })}
        </div>
      </section>
      <section style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Component radius tokens</Heading>
        <Text tone="secondary">Each component reads its own token, which points at the scale above. Change a component's corners here without touching its CSS.</Text>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
            <thead><tr><th style={cell}>CSS variable</th><th style={cell}>Value</th><th style={cell}>Refers to</th></tr></thead>
            <tbody>
              {componentRadii.map((name) => (
                <tr key={name}>
                  <td style={cell}><code>{light[name].cssVar}</code></td>
                  <td style={cell}><LiveValue cssVar={light[name].cssVar} /></td>
                  <td style={cell}><code>{light[name].ref ?? ""}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // The pill radius always makes a fully round end.
    const pill = canvasElement.querySelector('[data-radius="radius.pill"]') as HTMLElement;
    await expect(parseFloat(getComputedStyle(pill).borderTopLeftRadius)).toBeGreaterThanOrEqual(pill.getBoundingClientRect().height / 2);
  },
};

export const Elevation: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--lw-space-xl)" }}>
      <div style={{ display: "grid", gap: "var(--lw-space-md)" }}>
        <Heading level={2} size="h3">Elevation</Heading>
        <Text tone="secondary">Eight levels from Leeward's effect styles. In dark mode the same geometry is used with stronger shadows, and surfaces get lighter as they rise.</Text>
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

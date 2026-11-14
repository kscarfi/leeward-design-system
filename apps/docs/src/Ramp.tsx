import { Heading, Text } from "@leeward/react";

/**
 * One color ramp: a continuous strip for the overview, then a wrapping grid of chips with
 * step and hex. Chips wrap to new rows instead of shrinking, so values never overlap.
 */
export function Ramp({ name, steps, marked }: { name: string; steps: Array<[string, string]>; marked?: string }) {
  return (
    <section aria-label={`${name} ramp`} style={{ display: "grid", gap: "var(--lw-space-xs)" }}>
      <Heading level={3} size="h6">{name}</Heading>
      <div aria-hidden="true" style={{ display: "flex", height: "var(--lw-size-control-xs)", borderRadius: "var(--lw-radius-sm)", overflow: "hidden", boxShadow: "inset 0 0 0 var(--lw-size-border-default) var(--lw-border-subtle)" }}>
        {steps.map(([step, hex]) => <span key={step} style={{ flex: 1, background: hex }} />)}
      </div>
      <ol style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))", gap: "var(--lw-space-2xs)", margin: 0, padding: 0, listStyle: "none" }}>
        {steps.map(([step, hex]) => (
          <li
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--lw-space-xs)",
              padding: "var(--lw-space-2xs) var(--lw-space-xs)",
              borderRadius: "var(--lw-radius-sm)",
              background: "var(--lw-fill-surface-default)",
              boxShadow: step === marked ? "inset 0 0 0 var(--lw-size-border-strong) var(--lw-border-strong)" : "inset 0 0 0 var(--lw-size-border-default) var(--lw-border-subtle)",
            }}
          >
            <span aria-hidden="true" style={{ flexShrink: 0, width: "var(--lw-size-icon-lg)", height: "var(--lw-size-icon-lg)", borderRadius: "var(--lw-radius-xs)", background: hex, boxShadow: "inset 0 0 0 var(--lw-size-border-default) var(--lw-border-subtle)" }} />
            <span style={{ display: "grid", minWidth: 0 }}>
              <Text as="span" variant="label-xs">{step}{step === marked ? " (seed)" : ""}</Text>
              <Text as="span" variant="caption" tone="tertiary" truncate style={{ fontFamily: "var(--lw-type-code-family)" }}>{hex.toUpperCase()}</Text>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

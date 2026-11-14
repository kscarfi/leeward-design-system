// No imports: used by the token build and by the browser-side partner generator.

/**
 * Focus rings, the single source for every focus style in the system. They reference other
 * variables, so every brand and mode block declares them again: a custom property is resolved
 * where it is declared, and children only inherit the resolved value.
 */
export function focusRings(): Record<string, { value: string; description: string }> {
  const gap = "var(--lw-size-focus-ring-offset)";
  const ring = "calc(var(--lw-size-focus-ring-offset) + var(--lw-size-focus-ring-width))";
  return {
    focus: { value: `0 0 0 ${gap} var(--lw-fill-surface-default), 0 0 0 ${ring} var(--lw-border-focus)`, description: "Default focus ring: a surface gap and a 2 px ring, at least 3:1 on every surface." },
    "focus-inset": { value: "inset 0 0 0 var(--lw-size-focus-ring-width) var(--lw-border-focus)", description: "Inside the element, for full-width rows and tabs where an outer ring would be clipped." },
    "focus-danger": { value: `0 0 0 ${gap} var(--lw-fill-surface-default), 0 0 0 ${ring} var(--lw-border-danger)`, description: "Focus on a field that has an error." },
    "focus-inverse": { value: `0 0 0 ${gap} var(--lw-fill-neutral-default), 0 0 0 ${ring} var(--lw-text-inverse)`, description: "Focus on inverse (dark in light mode) surfaces." },
    "focus-halo": { value: "0 0 0 var(--lw-size-focus-ring-halo) var(--lw-focus-ring-primary)", description: "Soft halo. Decorative: always combine with a focus ring." },
  };
}

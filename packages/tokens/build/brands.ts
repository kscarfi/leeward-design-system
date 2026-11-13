// Brands choose which primitive ramp plays each role. Everything else (structure,
// intensities, contrast rules) is shared, so a new brand is a few lines.

export const ROLES = ["primary", "secondary", "neutral", "info", "success", "warning", "attention", "danger"] as const;
export type Role = (typeof ROLES)[number];

export interface Brand {
  id: string;
  name: string;
  /** Primitive ramp per role. */
  roles: Record<Role, string>;
  /** Decorative accent ramp: illustration and highlights only, never text or state. */
  accent: string;
  /** Visited links. */
  visited: string;
  font: { display: string; body: string; mono: string };
  /** Multiplies control radii: 0 square, 1 default, 1.5 rounder. Pill shapes stay pills. */
  roundness: number;
  /** compact trims control heights and paddings one step for dense, desktop-first products. */
  density: "comfortable" | "compact";
}

const sans = ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"].map((f) => (f.includes(" ") && !f.startsWith("-") ? `"${f}"` : f)).join(", ");
const mono = ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"].join(", ");

/** The role mapping of Leeward's semantic template. Used to read its semantic template. */
export const sourceRoles: Record<Role, string> = {
  primary: "lapisBlue",
  secondary: "purpleHaze",
  neutral: "richBlack",
  info: "cyan",
  success: "green",
  warning: "pumpkin",
  attention: "yellow",
  danger: "red",
};

export const brands: Brand[] = [
  {
    id: "leeward",
    name: "Leeward",
    roles: { primary: "indigo", secondary: "violet", neutral: "slate", info: "blue", success: "teal", warning: "pumpkin", attention: "yellow", danger: "red" },
    accent: "coralRed",
    visited: "violet",
    font: { display: sans, body: sans, mono },
    roundness: 1,
    density: "comfortable",
  },
  {
    id: "business",
    name: "Leeward Business",
    roles: { primary: "lapisBlue", secondary: "purpleHaze", neutral: "richBlack", info: "cyan", success: "green", warning: "pumpkin", attention: "yellow", danger: "red" },
    accent: "oceanBlue",
    visited: "violet",
    font: { display: sans, body: sans, mono },
    roundness: 0.75,
    density: "compact",
  },
];

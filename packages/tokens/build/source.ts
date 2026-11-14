// Reads Leeward's token source in source/: color ramps, numeric scales, elevation and
// the brand-neutral semantic template. Designed by Kemal Salih Carfi.
import { readFileSync } from "node:fs";
import Color from "colorjs.io";

const dir = new URL("../source/", import.meta.url);
const read = (file: string) => JSON.parse(readFileSync(new URL(file, dir), "utf8"));

/** "onDefault" -> "on-default", "2xLarge" -> "2x-large". */
export function kebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export type Ramp = Record<string, string>;

/**
 * Leeward's neutral, "ink": the lightness of every richBlack step (a tuned 32-step neutral)
 * with the cool hue and chroma of slate at the nearest step. Brands get the same spacing
 * between surfaces, hovers and borders, in their own tint.
 */
export function tintedNeutral(lightness: Ramp, tint: Ramp): Ramp {
  const tintSteps = Object.keys(tint).map(Number).sort((a, b) => a - b);
  const out: Ramp = {};
  for (const [step, hex] of Object.entries(lightness)) {
    const n = Number(step);
    const nearest = tintSteps.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
    const [l] = new Color(hex).to("oklch").coords;
    const [, c, h] = new Color(tint[String(nearest)]!).to("oklch").coords;
    out[step] = n === 0 ? "#ffffff" : new Color("oklch", [l ?? 0, c ?? 0, Number.isNaN(h) ? 0 : (h ?? 0)]).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
  }
  return out;
}

/** Every color ramp, steps 0 to 1000, plus the derived "ink" neutral. Alpha ramps keep their alpha as 8-digit hex. */
export function sourceRamps(): Record<string, Ramp> {
  const ramps = read("ramps.json") as Record<string, Ramp>;
  if (ramps.richBlack && ramps.slate) ramps.ink = tintedNeutral(ramps.richBlack, ramps.slate);
  return ramps;
}

/** Flat numeric scales (spacing, sizer, radii, border widths, type scale). */
export function sourceScales(): Record<"spacing" | "sizer" | "radii" | "borderWidth" | "typescale", Record<string, number>> {
  return read("scales.json");
}

/** Elevation shadows, keyed by level. */
export function sourceElevation(): Record<string, string> {
  return read("elevation.json");
}

export type TemplateEntry =
  | { kind: "ramp"; ramp: string; step: string; alpha?: number }
  | { kind: "ref"; target: string };

/** The semantic color template, keyed by path such as "fill.primary.on-default". */
export function sourceSemantic(): Record<string, TemplateEntry> {
  return read("semantic.json");
}

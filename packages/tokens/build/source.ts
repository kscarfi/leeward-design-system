// Reads Leeward's token source in source/
// and turns them into Leeward primitives and a brand-neutral semantic template.
import { readFileSync } from "node:fs";
import Color from "colorjs.io";

const dir = new URL("../source/", import.meta.url);
const read = (file: string) => JSON.parse(readFileSync(new URL(file, dir), "utf8"));

type Json = Record<string, any>;

/** "onDefault" -> "on-default", "2xLarge" -> "2x-large". */
export function kebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function walk(node: Json, fn: (path: string[], token: Json) => void, path: string[] = []) {
  if (node && typeof node === "object" && "$value" in node) return fn(path, node);
  for (const [key, child] of Object.entries(node ?? {})) if (!key.startsWith("$") && child && typeof child === "object") walk(child, fn, [...path, key]);
}

function hex8(value: { hex: string; alpha?: number }): string {
  const hex = value.hex.toLowerCase();
  const alpha = value.alpha ?? 1;
  if (alpha >= 0.999) return hex;
  return hex + Math.round(alpha * 255).toString(16).padStart(2, "0");
}

export type Ramp = Record<string, string>;

/**
 * Leeward's neutral, "ink": the lightness of every richBlack step (Kemal's tuned 32-step neutral)
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

/** Every color ramp from the token source, steps 0 to 1000. Alpha ramps keep their alpha as 8-digit hex. */
export function sourceRamps(): Record<string, Ramp> {
  const colors = read("primitives.tokens.json").color as Json;
  const ramps: Record<string, Ramp> = {};
  for (const [name, ramp] of Object.entries(colors)) {
    if (name.startsWith("$")) continue;
    ramps[name] = {};
    for (const [step, token] of Object.entries(ramp as Json)) if (!step.startsWith("$")) ramps[name]![step] = hex8((token as Json).$value);
  }
  if (ramps.richBlack && ramps.slate) ramps.ink = tintedNeutral(ramps.richBlack, ramps.slate);
  return ramps;
}

/** Flat numeric scales (spacing, sizer, radii, border widths, type scale). */
export function sourceScales() {
  const flat = (file: string, group?: string) => {
    const out: Record<string, number> = {};
    const data = read(file);
    walk(group ? data[group] : data, (path, token) => {
      if (typeof token.$value === "number") out[path.join(".")] = token.$value;
    });
    return out;
  };
  const prim = read("primitives.tokens.json");
  const typescale: Record<string, number> = {};
  walk(prim.typescale.majorSecond, (path, token) => {
    if (typeof token.$value === "number" && token.$value > 0) typescale[path.join(".")] = token.$value;
  });
  return {
    spacing: flat("spacing.tokens.json"),
    sizer: flat("sizer.tokens.json"),
    radii: flat("border.tokens.json", "Radii"),
    borderWidth: flat("border.tokens.json", "Width"),
    typescale,
  };
}

/** Elevation shadows from the effect styles export. */
export function sourceElevation(): Record<string, string> {
  const data = read("text-styles-effect-styles.json");
  const out: Record<string, string> = {};
  for (const style of data.styles.effectStyles ?? []) {
    const m = String(style.name).match(/^Elevation\/(\d+)/);
    if (m) out[m[1]!] = String(style.value).replace(/^box-shadow:\s*/, "").replace(/;$/, "");
  }
  return out;
}

export type TemplateEntry =
  | { kind: "ramp"; ramp: string; step: string; alpha?: number }
  | { kind: "ref"; target: string };

/** The semantic colors, keyed by kebab path such as "fill.primary.on-default". */
export function sourceSemantic(): Record<string, TemplateEntry> {
  const ramps = sourceRamps();
  const out: Record<string, TemplateEntry> = {};
  walk(read("colors.tokens.json"), (path, token) => {
    const name = path.map(kebab).join(".");
    const alias: string | undefined = token.$extensions?.["com.figma.aliasData"]?.targetVariableName;
    const value = token.$value;
    if (alias) {
      const [, ramp, step] = alias.split("/");
      out[name] = { kind: "ramp", ramp: ramp!, step: step! };
    } else if (typeof value === "string" && value.startsWith("{")) {
      out[name] = { kind: "ref", target: value.slice(1, -1).split(".").map(kebab).join(".") };
    } else if (value && typeof value === "object") {
      // A translucent copy of a ramp color: find which ramp step it came from.
      const hex = String(value.hex).toLowerCase();
      let found: { ramp: string; step: string } | undefined;
      for (const [ramp, steps] of Object.entries(ramps)) {
        if (ramp.endsWith("Alpha")) continue;
        for (const [step, h] of Object.entries(steps)) if (h === hex && !found) found = { ramp, step };
      }
      if (!found) throw new Error(`No ramp color for raw value ${hex} at ${name}`);
      out[name] = { kind: "ramp", ...found, alpha: Math.round((value.alpha ?? 1) * 100) / 100 };
    }
  });
  return out;
}

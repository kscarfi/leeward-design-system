// Partner brand from one seed color. Pure: runs in Node (scripts/generate-theme.ts) and in the browser.
// The seed becomes the primary ramp; every other role comes from the base brand. The same
// contrast resolver as the core brands runs, then every required pair is checked.
import Color from "colorjs.io";
import { brands, type Brand } from "./brands.ts";
import { checkPairs, type PairResult } from "./contrast.ts";
import { focusRings } from "./focus.ts";
import { generateRamp, seedSteps } from "./palette.ts";
import { resolveSemantic, type Mode } from "./semantic.ts";
import type { Ramp, TemplateEntry } from "./source.ts";
import semanticTemplateData from "../dist/semantic-template.json" with { type: "json" };

export interface PartnerTheme {
  name: string;
  seed: string;
  seedStep: number;
  ramp: Ramp;
  values: Record<Mode, Record<string, string>>;
  css: string;
  results: PairResult[];
  failures: PairResult[];
  adjusted: number;
}

export interface PartnerOptions {
  name: string;
  seed: string;
  /** The brand insists on its exact color for primary buttons. The check decides if that is allowed. */
  pinAction?: boolean;
  /** All primitive ramps (packages/tokens/src/primitive/color.json, the "color" object, flattened to hex). */
  ramps: Record<string, Ramp>;
  base?: Brand;
}

export function generatePartnerTheme({ name, seed, pinAction = false, ramps, base = brands[0]! }: PartnerOptions): PartnerTheme {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`Theme name "${name}" must be lowercase letters, digits and dashes.`);
  const hex = new Color(seed).to("srgb").toString({ format: "hex", collapse: false });
  const ramp = generateRamp({ seeds: [hex] });
  const [seedStep] = seedSteps({ seeds: [hex] });
  const allRamps = { ...ramps, partner: ramp };
  const brand: Brand = { ...base, id: name, name, roles: { ...base.roles, primary: "partner" } };

  const values = {} as Record<Mode, Record<string, string>>;
  const blocks: string[] = [];
  const results: PairResult[] = [];
  let adjusted = 0;
  for (const mode of ["light", "dark"] as Mode[]) {
    const resolved = resolveSemantic(brand, mode, allRamps, semanticTemplateData as Record<string, TemplateEntry>);
    adjusted += resolved.adjustments.length;
    const map: Record<string, string> = Object.fromEntries(Object.values(resolved.tokens).map((t) => [t.name, t.hex]));
    if (pinAction && mode === "light") {
      for (const k of ["fill.primary.default", "border.focus"]) map[k] = hex;
    }
    values[mode] = map;
    results.push(...checkPairs(`${name}-${mode}`, (n) => map[n]));
    const sel = mode === "light" ? `[data-brand="${name}"], [data-brand="${name}"] [data-theme="light"]` : `[data-brand="${name}"][data-theme="dark"], [data-brand="${name}"] [data-theme="dark"]`;
    const lines = Object.entries(map).map(([path, v]) => `  --lw-${path.replace(/\./g, "-")}: ${v};`);
    // Focus rings reference color variables, so the brand block declares them again.
    for (const [name, f] of Object.entries(focusRings())) lines.push(`  --lw-elevation-${name}: ${f.value};`);
    blocks.push(`${sel} {\n  color-scheme: ${mode};\n${lines.join("\n")}\n}`);
  }
  const css = `/* Partner brand "${name}" generated from ${hex}. Do not edit. */\n\n${blocks.join("\n\n")}\n`;
  return { name, seed: hex, seedStep: seedStep!, ramp, values, css, results, failures: results.filter((r) => !r.pass), adjusted };
}

/** Flatten src/primitive/color.json into ramps of hex strings. */
export function rampsFromPrimitives(colorJson: { color: Record<string, any> }): Record<string, Ramp> {
  const out: Record<string, Ramp> = {};
  for (const [name, steps] of Object.entries(colorJson.color)) {
    if (name.startsWith("$")) continue;
    out[name] = Object.fromEntries(Object.entries(steps as Record<string, any>).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, v.$value]));
  }
  return out;
}

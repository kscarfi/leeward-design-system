// Partner theme from one seed color. Pure: runs in Node (scripts/generate-theme.ts) and in the browser (Storybook demo).
import Color from "colorjs.io";
import { checkPairs, type PairResult } from "./contrast.ts";
import { generateRamp, seedSteps } from "./palette.ts";
import { semanticColors, type Mode } from "./themes.ts";

export interface PartnerTheme {
  name: string;
  seed: string;
  seedStep: number;
  ramp: Record<string, string>;
  /** Resolved semantic colors per mode, keyed like "color.text.primary". */
  values: Record<Mode, Record<string, string>>;
  css: string;
  results: PairResult[];
  failures: PairResult[];
}

function flatten(node: Record<string, unknown>, path: string[] = [], out: Record<string, string> = {}) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$") || typeof child !== "object" || child === null) continue;
    const c = child as Record<string, unknown>;
    if ("$value" in c) out[[...path, key].join(".")] = c.$value as string;
    else flatten(c, [...path, key], out);
  }
  return out;
}

export interface PartnerOptions {
  name: string;
  seed: string;
  /** The brand insists on its exact color for primary buttons. The check decides if that is allowed. */
  pinAction?: boolean;
  /** Leeward's color primitives (src/primitive/color.json, the "color" object). */
  basePrimitives: Record<string, unknown>;
}

export function generatePartnerTheme({ name, seed, pinAction = false, basePrimitives }: PartnerOptions): PartnerTheme {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`Theme name "${name}" must be lowercase letters, digits and dashes.`);
  const hex = new Color(seed).to("srgb").toString({ format: "hex", collapse: false });
  const ramp = generateRamp({ seeds: [hex] });
  const [seedStep] = seedSteps({ seeds: [hex] });
  const primitives = flatten({ color: { ...basePrimitives, partner: Object.fromEntries(Object.entries(ramp).map(([k, v]) => [k, { $value: v }])) } });
  const resolve = (value: string) => {
    if (!value.startsWith("{")) return value;
    const hit = primitives[value.slice(1, -1)];
    if (!hit) throw new Error(`Unresolved reference ${value}`);
    return hit;
  };

  const values = {} as Record<Mode, Record<string, string>>;
  const blocks: string[] = [];
  const results: PairResult[] = [];
  for (const mode of ["light", "dark"] as Mode[]) {
    const semantic = flatten(semanticColors(mode, { brand: "partner", accent: "coral" }) as unknown as Record<string, unknown>);
    const resolved: Record<string, string> = {};
    for (const [path, value] of Object.entries(semantic)) if (path.startsWith("color.")) resolved[path] = resolve(value);
    if (pinAction && mode === "light") {
      resolved["color.action.primary.bg"] = hex;
      resolved["color.control.bg-checked"] = hex;
    }
    values[mode] = resolved;
    const themeName = mode === "light" ? name : `${name}-dark`;
    results.push(...checkPairs(themeName, (token) => resolved[`color.${token}`]!));
    const lines = Object.entries(resolved).map(([path, v]) => `  --lw-${path.replace(/\./g, "-")}: ${v};`);
    blocks.push(`[data-theme="${themeName}"] {\n  color-scheme: ${mode};\n${lines.join("\n")}\n}`);
  }
  const css = `/* Partner theme "${name}" generated from ${hex}. Do not edit. */\n\n${blocks.join("\n\n")}\n`;
  return { name, seed: hex, seedStep: seedStep!, ramp, values, css, results, failures: results.filter((r) => !r.pass) };
}

// Token build: token source -> primitives -> brand x mode semantics -> CSS, TS and Figma.
// Run: pnpm --filter @leeward/tokens build
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";
import { brands as allBrands, type Brand } from "./brands.ts";
import { compatV1 } from "./compat.ts";
import { buildFigmaFiles } from "./figma.ts";
import { elevation, foundation, primitiveFiles } from "./foundation.ts";
import { sourceRamps, sourceSemantic } from "./source.ts";
import { resolveSemantic, type Adjustment, type Mode } from "./semantic.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist/`;
export const MODES: Mode[] = ["light", "dark"];

/** CSS selectors for a brand and mode. The first brand is the default on :root. */
export function selectors(brand: Brand, mode: Mode, isDefault: boolean): string {
  const b = `[data-brand="${brand.id}"]`;
  if (mode === "light") return isDefault ? `:root, ${b}, [data-theme="light"]` : `${b}, ${b}[data-theme="light"], ${b} [data-theme="light"]`;
  return isDefault ? `[data-theme="dark"], ${b}[data-theme="dark"], ${b} [data-theme="dark"]` : `${b}[data-theme="dark"], ${b} [data-theme="dark"]`;
}

function autoSelectors(brand: Brand, isDefault: boolean): string {
  const b = `[data-brand="${brand.id}"]`;
  return isDefault ? `[data-theme="auto"], ${b}[data-theme="auto"], ${b} [data-theme="auto"]` : `${b}[data-theme="auto"], ${b} [data-theme="auto"]`;
}

const PX_ONLY = /(^|\.)(border|border-width|focus-ring|radius|radii|elevation)(\.|$)/;

StyleDictionary.registerTransform({
  name: "dimension/leeward",
  type: "value",
  transitive: true,
  filter: (token) => (token.$type ?? token.type) === "dimension",
  transform: (token) => {
    const raw = token.$value ?? token.value;
    // Transitive transforms run again on references that were already converted.
    if (typeof raw === "string") return raw;
    const { value, unit } = raw as { value: number; unit: string };
    if (unit !== "px") return `${value}${unit}`;
    if (value === 0) return "0";
    if (PX_ONLY.test(token.path.join("."))) return `${value}px`;
    return `${value / 16}rem`;
  },
});

StyleDictionary.registerTransform({
  name: "duration/leeward",
  type: "value",
  transitive: true,
  filter: (token) => (token.$type ?? token.type) === "duration",
  transform: (token) => {
    const raw = token.$value ?? token.value;
    return typeof raw === "object" ? `${raw.value}${raw.unit}` : raw;
  },
});

const transforms = ["attribute/cti", "name/kebab", "dimension/leeward", "duration/leeward", "color/css", "fontFamily/css", "cubicBezier/css"];
StyleDictionary.registerTransformGroup({ name: "css/leeward", transforms });

const isPrimitive = (token: TransformedToken) => token.filePath.includes("/primitive/");

StyleDictionary.registerFormat({
  name: "json/flat-semantic",
  format: ({ dictionary }) => {
    const out: Record<string, { value: unknown; cssVar: string; type?: string; description?: string; ref?: string }> = {};
    for (const token of dictionary.allTokens) {
      if (isPrimitive(token)) continue;
      const original = token.original.$value ?? token.original.value;
      out[token.path.join(".")] = {
        value: token.$value ?? token.value,
        cssVar: `--${token.name}`,
        ...(token.$type ? { type: token.$type } : {}),
        ...(token.$description ? { description: token.$description } : {}),
        ...(typeof original === "string" && original.startsWith("{") ? { ref: original.slice(1, -1) } : {}),
      };
    }
    return JSON.stringify(out, null, 2) + "\n";
  },
});

/** Semantic color file for one brand and mode, as DTCG references to primitives where possible. */
function colorFile(brand: Brand, mode: Mode) {
  const ramps = sourceRamps();
  const result = resolveSemantic(brand, mode, ramps, sourceSemantic());
  if (result.failures.length) {
    throw new Error(`${brand.id} ${mode}: ${result.failures.length} pairs miss AA:\n${result.failures.map((f) => `  ${f.fg} on ${f.bg} ${f.ratio.toFixed(2)}`).join("\n")}`);
  }
  const tree: Record<string, any> = {};
  for (const t of Object.values(result.tokens)) {
    const path = t.name.split(".");
    let node = tree;
    for (const key of path.slice(0, -1)) node = node[key] ??= {};
    // Translucent and mixed colors are literal values; everything else references a primitive.
    node[path[path.length - 1]!] = { $type: "color", $value: t.alpha !== undefined || t.step.startsWith("mix-") ? t.hex : `{color.${t.ramp}.${t.step}}` };
  }
  return { tree, adjustments: result.adjustments };
}

async function buildOne(brand: Brand, mode: Mode, isDefault: boolean, adjustments: Record<string, Adjustment[]>) {
  const themeFile = `${root}themes/${brand.id}.${mode}.json`;
  const colors = colorFile(brand, mode);
  adjustments[`${brand.id}.${mode}`] = colors.adjustments;
  const content = { ...colors.tree, ...elevation(mode), ...(mode === "light" ? foundation(brand) : {}) };
  writeFileSync(themeFile, JSON.stringify(content, null, 2) + "\n");

  const sd = new StyleDictionary({
    log: { verbosity: "silent", warnings: "disabled" },
    source: [`${root}src/primitive/*.json`, themeFile],
    platforms: {
      css: {
        transformGroup: "css/leeward",
        prefix: "lw",
        buildPath: `${dist}css/`,
        files: [
          {
            destination: `${brand.id}.${mode}.css`,
            format: "css/variables",
            // Primitives never reach CSS: components can only use semantic tokens.
            filter: (token: TransformedToken) => !isPrimitive(token),
            options: { selector: selectors(brand, mode, isDefault), outputReferences: false, showFileHeader: false },
          },
        ],
      },
      json: {
        transformGroup: "css/leeward",
        prefix: "lw",
        buildPath: `${dist}ts/`,
        files: [{ destination: `${brand.id}.${mode}.json`, format: "json/flat-semantic" }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

export async function buildAll(brands: Brand[] = allBrands) {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(`${dist}css`, { recursive: true });
  mkdirSync(`${root}themes`, { recursive: true });
  mkdirSync(`${root}src/primitive`, { recursive: true });
  for (const [file, content] of Object.entries(primitiveFiles())) writeFileSync(`${root}src/primitive/${file}`, JSON.stringify(content, null, 2) + "\n");

  // The template as data, so the partner generator can run in a browser without file access.
  writeFileSync(`${dist}semantic-template.json`, JSON.stringify(sourceSemantic()) + "\n");

  const adjustments: Record<string, Adjustment[]> = {};
  for (const [i, brand] of brands.entries()) for (const mode of MODES) await buildOne(brand, mode, i === 0, adjustments);

  // One stylesheet: every brand and mode, plus "auto" that follows the OS setting.
  const parts: string[] = [];
  const autos: string[] = [];
  for (const [i, brand] of brands.entries()) {
    for (const mode of MODES) parts.push(readFileSync(`${dist}css/${brand.id}.${mode}.css`, "utf8").trim());
    const dark = readFileSync(`${dist}css/${brand.id}.dark.css`, "utf8").trim();
    autos.push(dark.replace(/^[^{]+\{/, `${autoSelectors(brand, i === 0)} {`));
  }
  const auto = `@media (prefers-color-scheme: dark) {\n${autos.join("\n\n").replace(/^/gm, "  ")}\n}`;
  writeFileSync(`${dist}css/tokens.css`, `/* Leeward Design System tokens. Generated, do not edit. */\n\n${parts.join("\n\n")}\n\n${auto}\n`);

  // v1 names as aliases. Defined on every themed container so they follow its brand and mode.
  const compat = Object.entries(compatV1).map(([old, next]) => `  --lw-${old}: var(--lw-${next});`);
  writeFileSync(`${dist}css/compat-v1.css`, `/* Deprecated v1 variable names. Import only while migrating to v2 names. */\n:root, [data-brand], [data-theme] {\n${compat.join("\n")}\n}\n`);

  // Typed module: tokens[brand][mode][name].
  const data: Record<string, Record<string, unknown>> = {};
  for (const brand of brands) {
    data[brand.id] = {};
    for (const mode of MODES) {
      const own = JSON.parse(readFileSync(`${dist}ts/${brand.id}.${mode}.json`, "utf8"));
      // Dark files carry colors and elevation only; foundation tokens come from light.
      data[brand.id]![mode] = mode === "light" ? own : { ...JSON.parse(readFileSync(`${dist}ts/${brand.id}.light.json`, "utf8")), ...own };
    }
  }
  const names = Object.keys((data[brands[0]!.id] as any).light);
  writeFileSync(
    `${dist}ts/index.ts`,
    [
      "// Leeward Design System tokens. Generated, do not edit.",
      `export const brands = ${JSON.stringify(brands.map((b) => b.id))} as const;`,
      `export const brandNames: Record<BrandId, string> = ${JSON.stringify(Object.fromEntries(brands.map((b) => [b.id, b.name])))};`,
      'export const modes = ["light", "dark"] as const;',
      "export type BrandId = (typeof brands)[number];",
      "export type Mode = (typeof modes)[number];",
      `export type TokenName =\n${names.map((n) => `  | ${JSON.stringify(n)}`).join("\n")};`,
      "export interface TokenEntry { value: string | number; cssVar: string; type?: string; description?: string; ref?: string }",
      `export const tokens: Record<BrandId, Record<Mode, Record<TokenName, TokenEntry>>> = ${JSON.stringify(data)} as never;`,
      "/** CSS custom property reference for a token, for example cssVar(\"text.default\"). */",
      "export function cssVar(name: TokenName): string {",
      `  return \`var(\${tokens.${brands[0]!.id}.light[name].cssVar})\`;`,
      "}",
      "",
    ].join("\n"),
  );
  writeFileSync(`${dist}adjustments.json`, JSON.stringify(adjustments, null, 2) + "\n");

  buildFigmaFiles(`${dist}figma/`, brands, MODES);
  return { brands: brands.map((b) => b.id), tokenCount: names.length, adjustments: Object.fromEntries(Object.entries(adjustments).map(([k, v]) => [k, v.length])) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await buildAll();
  console.log(`Built ${result.tokenCount} semantic tokens for brands ${result.brands.join(", ")} in light and dark.`);
  console.log(`Contrast resolver moved: ${JSON.stringify(result.adjustments)}`);
}

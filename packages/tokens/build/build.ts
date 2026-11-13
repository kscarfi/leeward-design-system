// Token build: seeds -> primitives -> semantic themes -> CSS, TS and Figma outputs.
// Run: pnpm --filter @leeward/tokens build
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";
import { buildColorPrimitives } from "./generate-primitives.ts";
import { buildFigmaFiles } from "./figma.ts";
import { semanticColors, type Mode, type ThemeOptions } from "./themes.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist/`;

export interface ThemeDefinition {
  name: string;
  mode: Mode;
  options: ThemeOptions;
  /** CSS selector the theme applies to. */
  selector: string;
}

export const leewardThemes: ThemeDefinition[] = [
  { name: "light", mode: "light", options: { brand: "iris", accent: "coral" }, selector: ':root, [data-theme="light"]' },
  { name: "dark", mode: "dark", options: { brand: "iris", accent: "coral" }, selector: '[data-theme="dark"]' },
];

const PX_ONLY = /(^|\.)(border|focus-ring|radius|shadow)(\.|$)/;

StyleDictionary.registerTransform({
  name: "dimension/leeward",
  type: "value",
  transitive: true,
  filter: (token) => (token.$type ?? token.type) === "dimension",
  transform: (token) => {
    const raw = token.$value ?? token.value;
    const { value, unit } = typeof raw === "object" ? raw : { value: parseFloat(raw), unit: "px" };
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

StyleDictionary.registerTransformGroup({
  name: "css/leeward",
  transforms: ["attribute/cti", "name/kebab", "dimension/leeward", "duration/leeward", "color/css", "fontFamily/css", "cubicBezier/css", "shadow/css/shorthand"],
});

StyleDictionary.registerTransformGroup({
  name: "ts/leeward",
  transforms: ["attribute/cti", "name/kebab", "dimension/leeward", "duration/leeward", "color/css", "fontFamily/css", "cubicBezier/css", "shadow/css/shorthand"],
});

const isPrimitive = (token: TransformedToken) => token.filePath.includes("/primitive/");
const isThemed = (token: TransformedToken) => token.filePath.includes("/themes/");

async function buildTheme(theme: ThemeDefinition, primitives: object, isDefault: boolean) {
  const themeFile = `${root}themes/${theme.name}.json`;
  writeFileSync(themeFile, JSON.stringify(semanticColors(theme.mode, theme.options), null, 2) + "\n");

  const sd = new StyleDictionary({
    log: { verbosity: "silent", warnings: "disabled" },
    source: [`${root}src/primitive/*.json`, `${root}src/semantic/*.json`, themeFile],
    platforms: {
      css: {
        transformGroup: "css/leeward",
        prefix: "lw",
        buildPath: `${dist}css/`,
        files: [
          {
            destination: `${theme.name}.css`,
            format: "css/variables",
            // Components may not use primitives, so primitives never reach CSS.
            // The default theme carries every semantic token; other themes override colors and shadows only.
            filter: (token: TransformedToken) => !isPrimitive(token) && (isDefault || isThemed(token)),
            options: { selector: theme.selector, outputReferences: false, showFileHeader: false },
          },
        ],
      },
      ts: {
        transformGroup: "ts/leeward",
        prefix: "lw",
        buildPath: `${dist}ts/`,
        files: [{ destination: `${theme.name}.json`, format: "json/flat-semantic" }],
      },
    },
  });
  await sd.buildAllPlatforms();
  void primitives;
}

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

export async function buildAll(themes: ThemeDefinition[] = leewardThemes) {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(`${dist}css`, { recursive: true });
  const primitives = buildColorPrimitives();
  writeFileSync(`${root}src/primitive/color.json`, JSON.stringify(primitives, null, 2) + "\n");

  for (const [index, theme] of themes.entries()) await buildTheme(theme, primitives, index === 0);

  // One stylesheet with every theme, plus the auto mode for apps that follow the OS setting.
  const css = themes.map((t) => readFileSync(`${dist}css/${t.name}.css`, "utf8").trim());
  const dark = readFileSync(`${dist}css/dark.css`, "utf8").replace('[data-theme="dark"]', ':root[data-theme="auto"]');
  const auto = `@media (prefers-color-scheme: dark) {\n${dark.trim().replace(/^/gm, "  ")}\n}`;
  writeFileSync(
    `${dist}css/tokens.css`,
    `/* Leeward Design System tokens. Generated, do not edit. */\n\n${css.join("\n\n")}\n\n${auto}\n`,
  );

  // Typed TS module with every theme.
  const themeData = Object.fromEntries(themes.map((t) => [t.name, JSON.parse(readFileSync(`${dist}ts/${t.name}.json`, "utf8"))]));
  const light = themeData[themes[0]!.name];
  const names = Object.keys(light);
  writeFileSync(
    `${dist}ts/index.ts`,
    [
      "// Leeward Design System tokens. Generated, do not edit.",
      `export const themes = ${JSON.stringify(themes.map((t) => t.name))} as const;`,
      "export type ThemeName = (typeof themes)[number];",
      `export type TokenName =\n${names.map((n) => `  | ${JSON.stringify(n)}`).join("\n")};`,
      "export interface TokenEntry { value: string | number; cssVar: string; type?: string; description?: string; ref?: string }",
      `export const tokens: Record<ThemeName, Record<TokenName, TokenEntry>> = ${JSON.stringify(themeData, null, 2)} as never;`,
      "/** CSS custom property reference for a token, for example cssVar(\"color.text.primary\"). */",
      "export function cssVar(name: TokenName): string {",
      "  return `var(${tokens.light[name].cssVar})`;",
      "}",
      "",
    ].join("\n"),
  );

  buildFigmaFiles(`${dist}figma/`, primitives, themes);
  return { themes: themes.map((t) => t.name), tokenCount: names.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await buildAll();
  console.log(`Built ${result.tokenCount} semantic tokens for themes: ${result.themes.join(", ")}`);
}

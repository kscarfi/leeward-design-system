import assert from "node:assert/strict";
import { test } from "node:test";
import { Linter } from "eslint";
import stylelint from "stylelint";
import tseslint from "typescript-eslint";
import config from "./stylelint-config.ts";
import { recommended } from "./eslint-plugin.ts";

async function cssWarnings(code: string): Promise<string[]> {
  const { results } = await stylelint.lint({ code, config, codeFilename: "x.module.css" });
  return results[0]!.warnings.map((w) => w.rule);
}

function jsMessages(code: string): string[] {
  const linter = new Linter({ configType: "flat" });
  return linter
    .verify(code, [{ files: ["**/*.tsx"], languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } }, ...recommended }], "x.tsx")
    .map((m) => m.ruleId ?? m.message);
}

test("stylelint accepts token-only CSS", async () => {
  assert.deepEqual(await cssWarnings(".a { color: var(--lw-text-default); padding: var(--lw-space-md); border: 0; background: transparent; }"), []);
});

test("stylelint rejects raw colors, primitives, typos and off-scale values", async () => {
  const rules = await cssWarnings(".a { color: #f00; background: var(--lw-color-indigo-600); border-color: var(--lw-text-defualt); padding: 13px; font-size: 15px; }");
  assert.deepEqual(rules.sort(), ["leeward/known-token", "leeward/known-token", "leeward/no-raw-color", "leeward/spacing-scale", "leeward/type-scale"]);
});

test("stylelint allows calc built from tokens", async () => {
  assert.deepEqual(await cssWarnings(".a { margin-top: calc(var(--lw-space-xs) * -1); }"), []);
});

test("eslint rejects raw colors and primitives in TSX", () => {
  const rules = jsMessages('export const A = () => <div style={{ color: "#4C3FE0", padding: "var(--lw-space-4)" }} />;');
  assert.deepEqual(rules.sort(), ["leeward/known-token", "leeward/no-raw-color"]);
});

test("eslint rejects icon-only money actions", () => {
  assert.deepEqual(jsMessages('export const A = () => <IconButton icon="arrow-up-right" label="Send money" />;'), ["leeward/no-icon-only-money-action"]);
  assert.deepEqual(jsMessages('export const A = () => <IconButton icon="close" label="Close" />;'), []);
});

test("eslint rejects red amounts", () => {
  assert.deepEqual(jsMessages('export const A = () => <Text tone="danger" tabular>-85</Text>;'), ["leeward/no-outgoing-danger"]);
});

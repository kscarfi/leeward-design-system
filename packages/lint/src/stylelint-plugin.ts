// Stylelint rules that keep component CSS on the token system.
import stylelint from "stylelint";
import { allowedVars, primitivePattern, RAW_COLOR, suggest } from "./tokens.ts";

const { createPlugin, utils } = stylelint;

const NAMED_COLORS = /\b(black|white|red|green|blue|gray|grey|yellow|orange|purple|pink|navy|teal|silver)\b/i;
const ALLOWED_KEYWORDS = /^(transparent|currentcolor|inherit|initial|unset|none)$/i;
const COLOR_PROPS = /(^|-)(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|box-shadow|text-decoration-color|caret-color|accent-color)$/;
const SPACING_PROPS = /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-|$)/;
const TYPE_PROPS = /^(font-size|line-height|letter-spacing|font-weight)$/;
const RAW_LENGTH = /(?<![\w-])-?\d*\.?\d+(px|rem|em)\b/;

const noRawColor = "leeward/no-raw-color";
const knownToken = "leeward/known-token";
const spacingScale = "leeward/spacing-scale";
const typeScale = "leeward/type-scale";

const messages = {
  [noRawColor]: utils.ruleMessages(noRawColor, {
    rejected: (value: string) => `Raw color "${value}". Use a semantic color token, for example var(--lw-text-default).`,
  }),
  [knownToken]: utils.ruleMessages(knownToken, {
    primitive: (name: string) => `"${name}" is a primitive. Components may only use semantic or component tokens.`,
    unknown: (name: string, hint?: string) => `Unknown token "${name}".${hint ? ` Did you mean "${hint}"?` : ""}`,
  }),
  [spacingScale]: utils.ruleMessages(spacingScale, {
    rejected: (prop: string, value: string) => `"${prop}: ${value}" is off the spacing scale. Use var(--lw-space-*) tokens.`,
  }),
  [typeScale]: utils.ruleMessages(typeScale, {
    rejected: (prop: string, value: string) => `"${prop}: ${value}" is off the type scale. Use var(--lw-type-*) tokens.`,
  }),
};

const meta = (rule: string) => ({ url: `https://github.com/kscarfi/leeward-design-system/blob/main/packages/lint/README.md#${rule.replace("/", "")}` });

function withoutVars(value: string): string {
  return value.replace(/var\([^)]*\)/g, "");
}

const noRawColorRule = createPlugin(
  noRawColor,
  Object.assign(
    (enabled: boolean) => (root: any, result: any) => {
      if (!enabled) return;
      root.walkDecls((decl: any) => {
        if (decl.prop.startsWith("--")) return;
        const value = withoutVars(decl.value);
        const raw = value.match(RAW_COLOR)?.[0];
        const named = COLOR_PROPS.test(decl.prop) ? value.match(NAMED_COLORS)?.[0] : undefined;
        const hit = raw ?? (named && !ALLOWED_KEYWORDS.test(named) ? named : undefined);
        if (hit) utils.report({ ruleName: noRawColor, result, node: decl, message: messages[noRawColor].rejected(hit), word: hit });
      });
    },
    { ruleName: noRawColor, messages: messages[noRawColor], meta: meta(noRawColor) },
  ),
);

const knownTokenRule = createPlugin(
  knownToken,
  Object.assign(
    (enabled: boolean) => (root: any, result: any) => {
      if (!enabled) return;
      root.walkDecls((decl: any) => {
        for (const match of decl.value.matchAll(/var\(\s*(--lw-[\w-]+)/g)) {
          const name = match[1] as string;
          if (allowedVars.has(name)) continue;
          const message = primitivePattern.test(name) && !allowedVars.has(name) ? messages[knownToken].primitive(name) : messages[knownToken].unknown(name, suggest(name));
          utils.report({ ruleName: knownToken, result, node: decl, message, word: name });
        }
      });
    },
    { ruleName: knownToken, messages: messages[knownToken], meta: meta(knownToken) },
  ),
);

const spacingScaleRule = createPlugin(
  spacingScale,
  Object.assign(
    (enabled: boolean) => (root: any, result: any) => {
      if (!enabled) return;
      root.walkDecls((decl: any) => {
        if (!SPACING_PROPS.test(decl.prop)) return;
        const value = withoutVars(decl.value);
        if (RAW_LENGTH.test(value)) utils.report({ ruleName: spacingScale, result, node: decl, message: messages[spacingScale].rejected(decl.prop, decl.value) });
      });
    },
    { ruleName: spacingScale, messages: messages[spacingScale], meta: meta(spacingScale) },
  ),
);

const typeScaleRule = createPlugin(
  typeScale,
  Object.assign(
    (enabled: boolean) => (root: any, result: any) => {
      if (!enabled) return;
      root.walkDecls((decl: any) => {
        if (!TYPE_PROPS.test(decl.prop)) return;
        const value = withoutVars(decl.value).trim();
        if (value === "" || /^(inherit|normal|0)$/.test(value)) return;
        if (decl.prop === "font-weight" ? /\d/.test(value) : RAW_LENGTH.test(value)) {
          utils.report({ ruleName: typeScale, result, node: decl, message: messages[typeScale].rejected(decl.prop, decl.value) });
        }
      });
    },
    { ruleName: typeScale, messages: messages[typeScale], meta: meta(typeScale) },
  ),
);

export default [noRawColorRule, knownTokenRule, spacingScaleRule, typeScaleRule];

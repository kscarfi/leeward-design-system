// ESLint rules for code that uses Leeward from React, including agent-generated screens.
import type { ESLint, Linter, Rule } from "eslint";
import { allowedVars, primitivePattern, RAW_COLOR, suggest } from "./tokens.ts";

type Node = any;
type Context = any;

const MONEY_WORDS = /\b(send|pay|transfer|withdraw|top ?up|add money|request)\b/i;

function stringValue(node: Node): string | undefined {
  if (node?.type === "Literal" && typeof node.value === "string") return node.value;
  if (node?.type === "TemplateLiteral") return node.quasis.map((q: Node) => q.value.cooked).join("");
  return undefined;
}

function jsxAttr(node: Node, name: string): Node | undefined {
  return node.attributes.find((a: Node) => a.type === "JSXAttribute" && a.name?.name === name);
}

function jsxAttrString(node: Node, name: string): string | undefined {
  const attr = jsxAttr(node, name);
  if (!attr?.value) return undefined;
  if (attr.value.type === "Literal") return String(attr.value.value);
  if (attr.value.type === "JSXExpressionContainer") return stringValue(attr.value.expression);
  return undefined;
}

const noRawColor: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow raw color values. Use semantic color tokens." },
    messages: { raw: 'Raw color "{{value}}". Use a semantic token such as var(--lw-text-default).' },
    schema: [],
  },
  create(context: Context) {
    const check = (node: Node, text: string | undefined) => {
      const hit = text?.match(RAW_COLOR)?.[0];
      if (hit) context.report({ node, messageId: "raw", data: { value: hit } });
    };
    return {
      Literal: (node: Node) => typeof node.value === "string" && check(node, node.value),
      TemplateLiteral: (node: Node) => check(node, stringValue(node)),
    };
  },
};

const knownToken: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Only reference CSS variables that exist as semantic or component tokens." },
    messages: {
      primitive: '"{{name}}" is a primitive. Use a semantic token.',
      unknown: 'Unknown token "{{name}}".{{hint}}',
    },
    schema: [],
  },
  create(context: Context) {
    const check = (node: Node, text: string | undefined) => {
      if (!text) return;
      for (const match of text.matchAll(/--lw-[\w-]+/g)) {
        const name = match[0];
        // A name ending in "-" is built at runtime from a template, so it cannot be checked statically.
        if (allowedVars.has(name) || name.endsWith("-")) continue;
        if (primitivePattern.test(name)) context.report({ node, messageId: "primitive", data: { name } });
        else {
          const s = suggest(name);
          context.report({ node, messageId: "unknown", data: { name, hint: s ? ` Did you mean "${s}"?` : "" } });
        }
      }
    };
    return {
      Literal: (node: Node) => typeof node.value === "string" && check(node, node.value),
      TemplateLiteral: (node: Node) => check(node, stringValue(node)),
    };
  },
};

const noIconOnlyMoneyAction: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Money movement needs a text Button, not an IconButton." },
    messages: { iconOnly: 'IconButton "{{label}}" moves money. Use <Button> with a visible text label.' },
    schema: [],
  },
  create(context: Context) {
    return {
      JSXOpeningElement(node: Node) {
        if (node.name?.name !== "IconButton") return;
        const label = jsxAttrString(node, "label");
        if (label && MONEY_WORDS.test(label)) context.report({ node, messageId: "iconOnly", data: { label } });
      },
    };
  },
};

const noOutgoingDanger: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Outgoing amounts are never red. Use AmountDisplay with direction=\"outgoing\"." },
    messages: { red: "Danger color on an amount. Outgoing money uses ink and a minus sign: <AmountDisplay direction=\"outgoing\" />." },
    schema: [],
  },
  create(context: Context) {
    return {
      JSXOpeningElement(node: Node) {
        const name = node.name?.name;
        if (name !== "Text") return;
        const tone = jsxAttrString(node, "tone");
        const tabular = jsxAttr(node, "tabular");
        if (tone === "danger" && tabular) context.report({ node, messageId: "red" });
      },
    };
  },
};

const plugin: ESLint.Plugin = {
  meta: { name: "@leeward/eslint-plugin", version: "0.0.0" },
  rules: {
    "no-raw-color": noRawColor,
    "known-token": knownToken,
    "no-icon-only-money-action": noIconOnlyMoneyAction,
    "no-outgoing-danger": noOutgoingDanger,
  },
};

export default plugin;

/** Recommended flat config block for apps that use Leeward. */
export const recommended: Linter.Config = {
  plugins: { leeward: plugin },
  rules: {
    "leeward/no-raw-color": "error",
    "leeward/known-token": "error",
    "leeward/no-icon-only-money-action": "error",
    "leeward/no-outgoing-danger": "error",
  },
};

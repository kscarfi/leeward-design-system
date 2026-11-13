// Static checks for generated UI code. Used by the validate_ui MCP tool and by the demo comparison.
import ts from "typescript";
import { allowedVars, componentNames, manifest } from "./data.ts";

export type IssueRule =
  | "raw-color"
  | "unknown-token"
  | "primitive-token"
  | "raw-spacing"
  | "unknown-component"
  | "missing-label"
  | "icon-only-money-action"
  | "red-amount"
  | "hand-formatted-money"
  | "em-dash"
  | "missing-required-prop";

export interface Issue {
  rule: IssueRule;
  line: number;
  message: string;
  fix: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: Issue[];
  summary: Record<IssueRule, number>;
  stats: { lines: number; leewardComponents: number; customComponents: string[]; customCssVariables: string[] };
}

const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|hwb)\(/g;
// Spacing declarations inside CSS written as a string, for example in a <style> template.
const CSS_SPACING = /(?:^|[;{\s])((?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-[a-z]+)?)\s*:\s*([^;}]*?\d*\.?\d+(?:px|rem|em)[^;}]*)/g;
const PRIMITIVE = /^--lw-(color-(white|ink|iris|coral|teal|danger|warning|deep|tint)|space-\d|radius-(\d|full)|size-\d|font-|duration-|easing-)/;
const MONEY_WORDS = /\b(send|pay|transfer|withdraw|top ?up|add money|request)\b/i;
const SPACING_KEYS = /^(margin|padding|gap|rowGap|columnGap|inset|top|right|bottom|left)/;
const NATIVE_LABELLED = new Set(["input", "select", "textarea"]);
const LABEL_REQUIRED = new Set(manifest.components.filter((c) => c.props.some((p) => p.name === "label" && p.required)).map((c) => c.name));

function attrs(node: ts.JsxOpeningLikeElement): Map<string, ts.JsxAttribute> {
  const map = new Map<string, ts.JsxAttribute>();
  for (const prop of node.attributes.properties) if (ts.isJsxAttribute(prop)) map.set(prop.name.getText(), prop);
  return map;
}

function attrText(attr: ts.JsxAttribute | undefined): string | undefined {
  const init = attr?.initializer;
  if (!init) return undefined;
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression && (ts.isStringLiteral(init.expression) || ts.isNoSubstitutionTemplateLiteral(init.expression))) return init.expression.text;
  return undefined;
}

/** True when the element sits inside a <label>, which labels it implicitly. */
function insideLabel(node: ts.Node): boolean {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isJsxElement(p) && p.openingElement.tagName.getText() === "label") return true;
  }
  return false;
}

function hasSpread(node: ts.JsxOpeningLikeElement) {
  return node.attributes.properties.some((p) => ts.isJsxSpreadAttribute(p));
}

export function validateUi(code: string, fileName = "screen.tsx"): ValidationResult {
  const source = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const issues: Issue[] = [];
  const line = (node: ts.Node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  const add = (rule: IssueRule, node: ts.Node, message: string, fix: string) => issues.push({ rule, line: line(node), message, fix });

  // Components declared in this file are custom (not from Leeward).
  const localComponents = new Set<string>();
  const importedFromLeeward = new Set<string>();
  const usedLeeward = new Set<string>();
  const usedCustom = new Set<string>();

  // CSS custom properties the code defines itself are its own variables, not misspelled Leeward tokens.
  const definedVars = new Set([...code.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]!));

  const visitDecl = (node: ts.Node) => {
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name && /^[A-Z]/.test(node.name.text)) localComponents.add(node.name.text);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && /^[A-Z]/.test(node.name.text) && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer) || ts.isCallExpression(node.initializer))) {
      localComponents.add(node.name.text);
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith("@leeward/")) {
      const bindings = node.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const el of bindings.elements) importedFromLeeward.add(el.name.text);
    }
    ts.forEachChild(node, visitDecl);
  };
  visitDecl(source);

  const checkString = (node: ts.Node, text: string) => {
    for (const m of text.matchAll(RAW_COLOR)) {
      add("raw-color", node, `Raw color "${m[0]}".`, "Use a semantic token, for example var(--lw-color-text-primary) or var(--lw-color-action-primary-bg).");
    }
    for (const m of text.matchAll(CSS_SPACING)) {
      if (m[2]!.includes("var(")) continue;
      add("raw-spacing", node, `Raw spacing "${m[1]}: ${m[2]!.trim()}".`, "Use var(--lw-space-*) tokens: 2xs 4px, xs 8px, sm 12px, md 16px, lg 24px, xl 32px.");
    }
    for (const m of text.matchAll(/--lw-[\w-]+/g)) {
      const name = m[0];
      if (allowedVars.has(name) || name.endsWith("-") || definedVars.has(name)) continue;
      if (PRIMITIVE.test(name)) add("primitive-token", node, `"${name}" is a primitive token.`, "Use the semantic token for the role, for example --lw-color-action-primary-bg instead of --lw-color-iris-600.");
      else add("unknown-token", node, `Unknown token "${name}".`, "Call get_tokens to list valid names.");
    }
    if (text.includes("\u2014")) add("em-dash", node, "Em dash in copy.", "Use a comma, colon or period.");
  };

  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) checkString(node, node.text);
    if (ts.isTemplateExpression(node)) checkString(node, [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(""));
    if (ts.isJsxText(node)) {
      if (node.text.includes("\u2014")) add("em-dash", node, "Em dash in copy.", "Use a comma, colon or period.");
      // A text node that is only an amount, for example "₺12.50" or "-85 TL". Labels such as "Send ₺250" are fine.
      if (/^[+\-\u2212]?\s?[₺$€£]?\s?\d[\d.,]*\s?(TL|TRY|₺)?$/.test(node.text.trim()) && /[₺$€£]|TL|TRY/.test(node.text)) add("hand-formatted-money", node, `Hand-written amount "${node.text.trim()}".`, "Render money with <AmountDisplay> or formatAmount().");
    }

    // Raw lengths in style objects.
    if (ts.isPropertyAssignment(node) && SPACING_KEYS.test(node.name.getText(source))) {
      const init = node.initializer;
      const raw = ts.isNumericLiteral(init) ? (init.text !== "0" ? `${init.text}` : undefined) : ts.isStringLiteral(init) && /\d+(px|rem|em)/.test(init.text) && !init.text.includes("var(") ? init.text : undefined;
      if (raw) add("raw-spacing", node, `Raw spacing "${node.name.getText(source)}: ${raw}".`, "Use var(--lw-space-*) tokens: 2xs 4px, xs 8px, sm 12px, md 16px, lg 24px, xl 32px.");
    }

    // toFixed / string concatenation of currency symbols.
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "toFixed") {
      add("hand-formatted-money", node, "Number formatted with toFixed().", "Use formatAmount(value, { currency, locale }) or <AmountDisplay>.");
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const a = attrs(node);
      const spread = hasSpread(node);
      if (/^[A-Z]/.test(tag) && !tag.includes(".")) {
        if (componentNames.has(tag) && !localComponents.has(tag)) usedLeeward.add(tag);
        else if (!importedFromLeeward.has(tag)) usedCustom.add(tag);
        if (!componentNames.has(tag) && importedFromLeeward.has(tag)) add("unknown-component", node, `"${tag}" is not a Leeward component.`, "Call search_components to find the right one.");
      }
      if (LABEL_REQUIRED.has(tag) && !a.has("label") && !spread) add("missing-label", node, `<${tag}> has no label.`, `Add label="..." describing the field or action.`);
      if (tag === "IconButton") {
        const label = attrText(a.get("label"));
        if (label && MONEY_WORDS.test(label)) add("icon-only-money-action", node, `IconButton "${label}" moves money.`, "Use <Button> with a visible text label for money movement.");
      }
      if (NATIVE_LABELLED.has(tag) && !a.has("aria-label") && !a.has("aria-labelledby") && !a.has("id") && !spread && !insideLabel(node)) {
        add("missing-label", node, `<${tag}> has no label.`, "Use the Leeward TextField or Select, which include a visible label.");
      }
      if (tag === "img" && !a.has("alt")) add("missing-label", node, "<img> has no alt text.", 'Add alt="" for decoration or a short description.');
      if (tag === "button" && ts.isJsxSelfClosingElement(node) && !a.has("aria-label")) add("missing-label", node, "<button> has no text or aria-label.", "Use <Button> with text or <IconButton label=...>.");
      if (tag === "Text" && attrText(a.get("tone")) === "danger" && a.has("tabular")) add("red-amount", node, "Amount styled in danger red.", 'Use <AmountDisplay direction="outgoing" />: ink with a minus sign.');
      for (const comp of manifest.components) {
        if (comp.name !== tag || spread) continue;
        for (const prop of comp.props) {
          if (prop.required && prop.name !== "children" && prop.name !== "label" && !prop.name.startsWith("...") && !a.has(prop.name)) {
            add("missing-required-prop", node, `<${tag}> is missing required prop "${prop.name}".`, `Add ${prop.name} (${prop.type}).`);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  // Raw colors that look like red used on amounts with inline styles are covered by raw-color.
  const summary = Object.fromEntries(
    (["raw-color", "unknown-token", "primitive-token", "raw-spacing", "unknown-component", "missing-label", "icon-only-money-action", "red-amount", "hand-formatted-money", "em-dash", "missing-required-prop"] as IssueRule[]).map((r) => [r, issues.filter((i) => i.rule === r).length]),
  ) as Record<IssueRule, number>;

  return {
    ok: issues.length === 0,
    issues,
    summary,
    stats: {
      lines: code.split("\n").length,
      leewardComponents: usedLeeward.size,
      customComponents: [...usedCustom].sort(),
      customCssVariables: [...definedVars].filter((v) => !allowedVars.has(v)).sort(),
    },
  };
}

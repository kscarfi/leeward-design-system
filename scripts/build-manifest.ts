// Builds components.manifest.json from component source (props via the TypeScript compiler)
// and Name.docs.md (purpose, do, don't, accessibility, example). Run: pnpm build:agent
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import ts from "typescript";

const root = new URL("../", import.meta.url).pathname;
const reactSrc = `${root}packages/react/src/`;

export interface ManifestProp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  values?: string[];
}

export interface ManifestComponent {
  name: string;
  kind: "component" | "pattern";
  import: string;
  purpose: string;
  props: ManifestProp[];
  variants: Record<string, string[]>;
  whenToUse: string[];
  whenNotToUse: string[];
  contentGuidelines: string[];
  sizes: string[];
  do: string[];
  dont: string[];
  accessibility: string[];
  keyboard: string[];
  example: string;
  related?: string[];
}

function parseDocs(md: string) {
  const sections: Record<string, string> = {};
  const [head, ...rest] = md.split(/^## /m);
  for (const block of rest) {
    const [title, ...body] = block.split("\n");
    sections[title!.trim().toLowerCase()] = body.join("\n").trim();
  }
  const bullets = (s = "") => s.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
  const rows = (s = "") => s.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| Size") && !l.startsWith("| Key")).map((l) => l.slice(2, -2).split(" | ").join(": "));
  const purpose = head!.split("\n").slice(1).join(" ").trim();
  const [accessibility, keyboard] = (sections.accessibility ?? "").split("### Keyboard");
  const example = ((sections.example ?? "").match(/```tsx\n([\s\S]*?)```/)?.[1] ?? "").trim();
  return {
    purpose,
    whenToUse: bullets(sections["when to use"]),
    whenNotToUse: bullets(sections["when not to use"]),
    contentGuidelines: bullets(sections["content guidelines"]),
    sizes: rows(sections.sizes),
    do: bullets(sections.do),
    dont: bullets(sections["don't"]),
    accessibility: bullets(accessibility),
    keyboard: rows(keyboard),
    example,
  };
}

const program = ts.createProgram({
  rootNames: [`${reactSrc}index.ts`],
  options: { jsx: ts.JsxEmit.ReactJSX, strict: true, allowImportingTsExtensions: true, noEmit: true, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true },
});
const checker = program.getTypeChecker();

/** Props declared in the component's own interface. Inherited DOM props are summarized, not listed. */
function propsOf(file: string, interfaceName: string): ManifestProp[] {
  const source = program.getSourceFile(file);
  if (!source) return [];
  let decl: ts.InterfaceDeclaration | undefined;
  source.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) decl = node;
  });
  if (!decl) return [];
  const props: ManifestProp[] = [];
  for (const member of decl.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    const name = member.name.getText(source).replace(/"/g, "");
    if (name === "ref" || name === "className") continue;
    const symbol = checker.getSymbolAtLocation(member.name);
    const type = checker.getTypeAtLocation(member);
    let typeText = member.type ? member.type.getText(source).replace(/\s+/g, " ") : checker.typeToString(type);
    const resolved = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
    // Keep literals in the order the source declares them, not the checker's internal order.
    const literals = (type.isUnion() ? type.types.filter((t) => t.isStringLiteral()).map((t) => (t as ts.StringLiteralType).value) : []).sort(
      (a, b) => source.text.indexOf(`"${a}"`) - source.text.indexOf(`"${b}"`),
    );
    if (member.type?.getText(source) === "IconName") {
      props.push({ name, type: "IconName", required: !member.questionToken, description: "One of the names in `icons` at the top of this manifest." });
      continue;
    }
    if (literals.length > 0 && literals.length === (type as ts.UnionType).types.filter((t) => !(t.flags & ts.TypeFlags.Undefined)).length) typeText = literals.map((v) => JSON.stringify(v)).join(" | ");
    else if (/^[A-Z]\w+$/.test(typeText) && resolved.includes("|") && resolved.length < 400) typeText = resolved;
    const description = symbol ? ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim() : "";
    props.push({
      name,
      type: typeText,
      required: !member.questionToken,
      ...(description ? { description } : {}),
      ...(literals.length > 1 ? { values: literals } : {}),
    });
  }
  return props;
}

function iconNames(): string[] {
  const text = readFileSync(`${reactSrc}components/Icon/icons.ts`, "utf8");
  return [...text.matchAll(/^\s+"?([a-z-]+)"?: \[/gm)].map((m) => m[1]!);
}

function inherits(file: string, interfaceName: string): string | undefined {
  const text = readFileSync(file, "utf8");
  const match = text.match(new RegExp(`interface ${interfaceName} extends ([^{]+)\\{`));
  return match?.[1]?.trim();
}

export function buildManifest() {
  const components: ManifestComponent[] = [];
  for (const kind of ["components", "patterns"] as const) {
    for (const dir of readdirSync(`${reactSrc}${kind}`).sort()) {
      const docs = `${reactSrc}${kind}/${dir}/${dir}.docs.md`;
      if (!existsSync(docs)) continue;
      const file = `${reactSrc}${kind}/${dir}/${dir}.tsx`;
      const parsed = parseDocs(readFileSync(docs, "utf8"));
      const props = propsOf(file, `${dir}Props`);
      const base = inherits(file, `${dir}Props`);
      if (base) props.push({ name: "...rest", type: base, required: false, description: "Other native props are passed to the root element." });
      const variants = Object.fromEntries(props.filter((p) => p.values && ["variant", "size", "tone", "direction", "status", "shape", "padding", "orientation", "side"].includes(p.name)).map((p) => [p.name, p.values!]));
      components.push({ name: dir, kind: kind === "components" ? "component" : "pattern", import: `import { ${dir} } from "@leeward/react";`, props, variants, ...parsed });
    }
  }
  const pkg = JSON.parse(readFileSync(`${root}packages/react/package.json`, "utf8"));
  return {
    $schema: "./docs/manifest.schema.json",
    name: "Leeward Design System",
    version: pkg.version,
    package: "@leeward/react",
    setup: ['import "@leeward/react/fonts.css";', 'import "@leeward/react/styles.css";', 'Set data-theme="light" | "dark" | "auto" on a root element.', "Wrap the app in <TooltipProvider> and <ToastProvider>."],
    icons: iconNames(),
    components,
  };
}

if (import.meta.main) {
  const manifest = buildManifest();
  writeFileSync(`${root}components.manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote components.manifest.json with ${manifest.components.length} entries.`);
}

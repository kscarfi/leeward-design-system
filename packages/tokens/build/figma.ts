// Figma variables in the DTCG format that Figma's native import reads.
// Figma reads one file per mode, so we write:
//   primitives.json        -> collection "Leeward Primitives", one mode
//   semantic.<theme>.json  -> collection "Leeward Semantic", one mode per theme
// Semantic tokens carry the resolved value plus com.figma.aliasData pointing at the primitive by name.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Color from "colorjs.io";
import type { ThemeDefinition } from "./build.ts";

const PRIMITIVE_SET = "Leeward Primitives";
const SUPPORTED = new Set(["color", "dimension", "fontFamily", "fontWeight", "number"]);

type Json = Record<string, unknown>;

function figmaColor(hex: string) {
  const c = new Color(hex).to("srgb");
  const [r, g, b] = c.coords.map((v) => Math.round((v ?? 0) * 10000) / 10000);
  return { colorSpace: "srgb", components: [r, g, b], alpha: Math.round((c.alpha ?? 1) * 1000) / 1000, hex: c.toString({ format: "hex", collapse: false }).slice(0, 7) };
}

function figmaValue(type: string, value: unknown): unknown {
  if (type === "color") return figmaColor(String(value));
  if (type === "dimension") {
    const v = value as { value: number; unit: string };
    return { value: v.unit === "px" ? v.value : v.value * 16, unit: "px" };
  }
  if (type === "fontFamily") return Array.isArray(value) ? value[0] : value;
  return value;
}

function figmaType(type: string) {
  return type === "fontWeight" ? "number" : type;
}

/** Walk a DTCG tree, calling fn for every token with its path and inherited $type. */
function walk(node: Json, fn: (path: string[], token: Json, type: string) => void, path: string[] = [], type = "") {
  const ownType = (node.$type as string) ?? type;
  if ("$value" in node) return fn(path, node, ownType);
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$") || typeof child !== "object" || child === null) continue;
    walk(child as Json, fn, [...path, key], ownType);
  }
}

function setPath(target: Json, path: string[], value: Json) {
  let node = target;
  for (const key of path.slice(0, -1)) node = (node[key] ??= {}) as Json;
  node[path[path.length - 1]!] = value;
}


export function buildFigmaFiles(outDir: string, colorPrimitives: Json, themes: ThemeDefinition[]) {
  mkdirSync(outDir, { recursive: true });
  const root = new URL("..", import.meta.url);
  const read = (file: string) => JSON.parse(readFileSync(new URL(file, root), "utf8")) as Json;
  const primitiveTree: Json = { ...read("src/primitive/space.json"), ...read("src/primitive/radius.json"), ...read("src/primitive/size.json"), ...read("src/primitive/font.json"), ...colorPrimitives };
  delete primitiveTree.$description;
  const semanticBase: Json = { ...read("src/semantic/space.json"), ...read("src/semantic/radius.json"), ...read("src/semantic/size.json") };

  const resolve = (ref: string): { path: string[]; token: Json; type: string } => {
    const path = ref.slice(1, -1).split(".");
    let type = "";
    let node: unknown = primitiveTree;
    for (const key of path) {
      type = ((node as Json).$type as string) ?? type;
      node = (node as Json)[key];
    }
    const token = node as Json;
    return { path, token, type: (token.$type as string) ?? type };
  };

  // Primitives
  const primitives: Json = {};
  walk(primitiveTree, (path, token, type) => {
    if (!SUPPORTED.has(type) || path[1] === "tracking") return;
    setPath(primitives, path, { $type: figmaType(type), $value: figmaValue(type, token.$value) });
  });
  writeFileSync(`${outDir}primitives.json`, JSON.stringify(primitives, null, 2) + "\n");

  // Semantic, one file per theme
  for (const theme of themes) {
    const themeTree = { ...semanticBase, ...read(`themes/${theme.name}.json`) };
    const out: Json = {};
    walk(themeTree as Json, (path, token, type) => {
      if (!SUPPORTED.has(type)) return;
      const raw = token.$value;
      const entry: Json = { $type: figmaType(type) };
      if (typeof raw === "string" && raw.startsWith("{")) {
        const target = resolve(raw);
        entry.$value = figmaValue(target.type, target.token.$value);
        entry.$extensions = { "com.figma.aliasData": { targetVariableSetName: PRIMITIVE_SET, targetVariableName: target.path.join("/") } };
      } else {
        entry.$value = figmaValue(type, raw);
      }
      if (token.$description) entry.$description = token.$description;
      setPath(out, path, entry);
    });
    writeFileSync(`${outDir}semantic.${theme.name}.json`, JSON.stringify(out, null, 2) + "\n");
  }
}

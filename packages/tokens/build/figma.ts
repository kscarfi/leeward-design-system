// Figma variables in the DTCG format that Figma's native import reads (one file per mode).
//   primitives.json                -> collection "Leeward Primitives"
//   semantic.<brand>.<mode>.json   -> collection "Leeward Semantic", one mode per brand and theme
// Semantic tokens carry the resolved value plus com.figma.aliasData pointing at the primitive by name.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Color from "colorjs.io";
import type { Brand } from "./brands.ts";
import type { Mode } from "./semantic.ts";

const PRIMITIVE_SET = "Leeward Primitives";
const SUPPORTED = new Set(["color", "dimension", "fontWeight", "number"]);
type Json = Record<string, any>;

function figmaColor(value: string) {
  const c = new Color(value).to("srgb");
  const [r, g, b] = c.coords.map((v) => Math.round((v ?? 0) * 10000) / 10000);
  return { colorSpace: "srgb", components: [r, g, b], alpha: Math.round((c.alpha ?? 1) * 1000) / 1000, hex: c.toString({ format: "hex", collapse: false }).slice(0, 7) };
}

function walk(node: Json, fn: (path: string[], token: Json, type: string) => void, path: string[] = [], type = "") {
  const own = (node.$type as string) ?? type;
  if ("$value" in node) return fn(path, node, own);
  for (const [k, child] of Object.entries(node)) if (!k.startsWith("$") && child && typeof child === "object") walk(child, fn, [...path, k], own);
}

function set(target: Json, path: string[], value: Json) {
  let node = target;
  for (const k of path.slice(0, -1)) node = node[k] ??= {};
  node[path[path.length - 1]!] = value;
}

const value = (type: string, v: any) => (type === "color" ? figmaColor(v) : type === "dimension" ? { value: v.value, unit: "px" } : v);
const ftype = (t: string) => (t === "fontWeight" ? "number" : t);

export function buildFigmaFiles(outDir: string, brands: Brand[], modes: Mode[]) {
  mkdirSync(outDir, { recursive: true });
  const root = new URL("..", import.meta.url);
  const read = (f: string) => JSON.parse(readFileSync(new URL(f, root), "utf8")) as Json;
  const prim: Json = { ...read("src/primitive/color.json"), ...read("src/primitive/scale.json") };

  const primitives: Json = {};
  walk(prim, (path, token, type) => SUPPORTED.has(type) && set(primitives, path, { $type: ftype(type), $value: value(type, token.$value) }));
  writeFileSync(`${outDir}primitives.json`, JSON.stringify(primitives, null, 2) + "\n");

  const resolve = (refText: string): { path: string[]; token: Json; type: string } => {
    const path = refText.slice(1, -1).split(".");
    let node: any = prim;
    let type = "";
    for (const k of path) {
      type = node.$type ?? type;
      node = node[k];
    }
    return { path, token: node, type: node.$type ?? type };
  };

  for (const brand of brands) {
    const light = read(`themes/${brand.id}.light.json`);
    for (const mode of modes) {
      // Figma needs the same variables in every mode file, so dark reuses light's non-color tokens.
      const tree = mode === "light" ? light : { ...light, ...read(`themes/${brand.id}.dark.json`) };
      const out: Json = {};
      walk(tree, (path, token, type) => {
        if (!SUPPORTED.has(type)) return;
        const raw = token.$value;
        const entry: Json = { $type: ftype(type) };
        if (typeof raw === "string" && raw.startsWith("{")) {
          const target = resolve(raw);
          entry.$value = value(target.type, target.token.$value);
          entry.$extensions = { "com.figma.aliasData": { targetVariableSetName: PRIMITIVE_SET, targetVariableName: target.path.join("/") } };
        } else entry.$value = value(type, raw);
        if (token.$description) entry.$description = token.$description;
        set(out, path, entry);
      });
      writeFileSync(`${outDir}semantic.${brand.id}.${mode}.json`, JSON.stringify(out, null, 2) + "\n");
    }
  }
}

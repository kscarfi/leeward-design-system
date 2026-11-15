// Variant sets, component properties and instances of components built earlier.
import { append, finish, style, type BoxOptions } from "./dsl.ts";
import { problems } from "./util.ts";
import { iconComponents } from "./icons.ts";

export type Props = Record<string, string>;
export type Built = ComponentNode | ComponentSetNode;
export const built = new Map<string, Built>();
/** Base parts built since the last call to takeBases(). Their names start with _, so Figma does not publish them. */
let bases: Built[] = [];
export function takeBases(): Built[] {
  const taken = bases;
  bases = [];
  return taken;
}

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** A component with auto layout, styled like box(). */
export async function comp(o: BoxOptions, children: Array<SceneNode | null | undefined | false> = []): Promise<ComponentNode> {
  const c = figma.createComponent();
  await style(c, o);
  append(c, children);
  finish(c);
  return c;
}

/**
 * Builds one component per combination of the axes and combines them into a set.
 * The last axis becomes the columns of the grid, the others the rows.
 * Layer names that start with # become text properties, ? boolean properties, ~ instance swaps.
 */
export async function variantSet(
  name: string,
  axes: Record<string, string[]>,
  build: (p: Props) => Promise<ComponentNode>,
  o: { skip?: (p: Props) => boolean; description?: string } = {},
): Promise<Built> {
  const keys = Object.keys(axes);
  let result: Built;
  if (!keys.length) {
    const c = await build({});
    c.name = name;
    figma.currentPage.appendChild(c);
    await wireProps(c, [c]);
    result = c;
  } else {
    const combos = keys.reduce<Props[]>((acc, k) => acc.flatMap((p) => axes[k]!.map((v) => ({ ...p, [k]: v }))), [{}]).filter((p) => !o.skip?.(p));
    const comps: ComponentNode[] = [];
    for (const p of combos) {
      try {
        const c = await build(p);
        c.name = keys.map((k) => `${cap(k)}=${p[k]}`).join(", ");
        figma.currentPage.appendChild(c);
        comps.push(c);
      } catch (error) {
        problems.push(`${name} ${JSON.stringify(p)}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    const set = figma.combineAsVariants(comps, figma.currentPage);
    set.name = name;
    grid(set, keys, combos);
    await wireProps(set, comps);
    result = set;
  }
  if (o.description) result.description = o.description;
  built.set(name, result);
  if (name.startsWith("_")) bases.push(result);
  return result;
}

/** Where each column and row of a variant grid sits, so the docs can label them. */
export interface GridLabels {
  colKey: string;
  rowKeys: string[];
  cols: Array<{ label: string; x: number; w: number }>;
  rows: Array<{ label: string; y: number; h: number }>;
}
export const gridLabels = new WeakMap<ComponentSetNode, GridLabels>();

function grid(set: ComponentSetNode, keys: string[], combos: Props[]): void {
  const gap = 24;
  const pad = 32;
  const colKey = keys[keys.length - 1]!;
  const rowKey = (p: Props) => keys.slice(0, -1).map((k) => p[k]).join("|");
  const cols = [...new Set(combos.map((p) => p[colKey]!))];
  const rows = [...new Set(combos.map(rowKey))];
  const byName = new Map(set.children.map((c) => [c.name, c as ComponentNode]));
  const nameOf = (p: Props) => keys.map((k) => `${cap(k)}=${p[k]}`).join(", ");
  const colW = cols.map((c) => Math.max(0, ...combos.filter((p) => p[colKey] === c).map((p) => byName.get(nameOf(p))?.width ?? 0)));
  const rowH = rows.map((r) => Math.max(0, ...combos.filter((p) => rowKey(p) === r).map((p) => byName.get(nameOf(p))?.height ?? 0)));
  for (const p of combos) {
    const node = byName.get(nameOf(p));
    if (!node) continue;
    const ci = cols.indexOf(p[colKey]!);
    const ri = rows.indexOf(rowKey(p));
    node.x = pad + colW.slice(0, ci).reduce((a, b) => a + b + gap, 0);
    node.y = pad + rowH.slice(0, ri).reduce((a, b) => a + b + gap, 0);
  }
  set.resizeWithoutConstraints(pad * 2 + colW.reduce((a, b) => a + b, 0) + gap * (cols.length - 1), pad * 2 + rowH.reduce((a, b) => a + b, 0) + gap * (rows.length - 1));
  gridLabels.set(set, {
    colKey: cap(colKey),
    rowKeys: keys.slice(0, -1).map(cap),
    cols: cols.map((label, i) => ({ label, x: pad + colW.slice(0, i).reduce((a, b) => a + b + gap, 0), w: colW[i]! })),
    rows: rows.map((label, i) => ({ label: label.split("|").join(" · "), y: pad + rowH.slice(0, i).reduce((a, b) => a + b + gap, 0), h: rowH[i]! })),
  });
}

async function wireProps(owner: ComponentNode | ComponentSetNode, variants: ComponentNode[]): Promise<void> {
  const ids = new Map<string, string>();
  // A text property has one default for every variant, so only texts that read the same everywhere become properties.
  const texts = new Map<string, Set<string>>();
  for (const variant of variants)
    for (const node of variant.findAll((n) => n.type === "TEXT" && /^[#?~]*#/.test(n.name)) as TextNode[]) {
      const label = node.name.replace(/^[#?~]+/, "");
      texts.set(label, (texts.get(label) ?? new Set()).add(node.characters));
    }
  // Same for swaps: an instance swap has one default, so it is offered only where every variant shows the same icon.
  const swaps = new Map<string, Set<string>>();
  for (const variant of variants)
    for (const node of variant.findAll((n) => n.type === "INSTANCE" && /^[#?]*~/.test(n.name)) as InstanceNode[]) {
      const label = node.name.replace(/^[#?~]+/, "");
      const main = await node.getMainComponentAsync();
      swaps.set(label, (swaps.get(label) ?? new Set()).add(main?.id ?? ""));
    }
  for (const variant of variants) {
    const nodes = variant.findAll((n) => /^[#?~]/.test(n.name));
    for (const node of nodes) {
      const kinds = node.name.match(/^[#?~]+/)![0];
      const label = node.name.slice(kinds.length);
      try {
        if (kinds.includes("#") && node.type === "TEXT" && texts.get(label)!.size === 1) {
          const key = `T:${label}`;
          if (!ids.has(key)) ids.set(key, owner.addComponentProperty(label, "TEXT", node.characters));
          node.componentPropertyReferences = { ...node.componentPropertyReferences, characters: ids.get(key)! };
        }
        if (kinds.includes("?")) {
          // With a text or swap property on the same layer, the boolean is named "Show <label>".
          const name = kinds.includes("~") || kinds.includes("#") ? `Show ${label.toLowerCase()}` : label;
          const key = `B:${name}`;
          if (!ids.has(key)) ids.set(key, owner.addComponentProperty(name, "BOOLEAN", node.visible));
          node.componentPropertyReferences = { ...node.componentPropertyReferences, visible: ids.get(key)! };
        }
        if (kinds.includes("~") && node.type === "INSTANCE" && swaps.get(label)!.size === 1) {
          const key = `I:${label}`;
          const main = await (node as InstanceNode).getMainComponentAsync();
          if (main) {
            if (!ids.has(key)) ids.set(key, owner.addComponentProperty(label, "INSTANCE_SWAP", main.id));
            node.componentPropertyReferences = { ...node.componentPropertyReferences, mainComponent: ids.get(key)! };
          }
        }
        node.name = label;
      } catch (error) {
        problems.push(`${owner.name} property ${label}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

/**
 * An instance of a component built earlier: variant props, text and boolean properties by name,
 * and instance swaps by property name to an icon name.
 */
export function instance(name: string, props: Props = {}, texts: Record<string, string> = {}, flags: Record<string, boolean> = {}, swaps: Record<string, string> = {}): InstanceNode | null {
  const b = built.get(name);
  if (!b) {
    problems.push(`${name} is used before it is built`);
    return null;
  }
  const main = b.type === "COMPONENT_SET" ? (b.defaultVariant as ComponentNode) : b;
  const instance = main.createInstance();
  if (b.type === "COMPONENT_SET" && Object.keys(props).length) {
    // Let Figma pick the variant, the same way the properties panel does.
    try {
      instance.setProperties(Object.fromEntries(Object.entries(props).map(([k, v]) => [cap(k), v])));
    } catch (error) {
      problems.push(`${name} has no variant ${JSON.stringify(props)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const defs = instance.componentProperties;
  const update: Record<string, string | boolean> = {};
  for (const [label, value] of Object.entries(texts)) {
    const key = Object.keys(defs).find((k) => k.split("#")[0] === label && defs[k]!.type === "TEXT");
    if (key) update[key] = value;
    else {
      // Texts that differ per variant are not properties; override the layer directly.
      const layer = instance.findOne((n) => n.type === "TEXT" && n.name === label) as TextNode | null;
      if (layer) layer.characters = value;
      else problems.push(`${name} has no text ${label}`);
    }
  }
  for (const [label, value] of Object.entries(flags)) {
    const key = Object.keys(defs).find((k) => k.split("#")[0] === label && defs[k]!.type === "BOOLEAN");
    if (key) update[key] = value;
    else problems.push(`${name} has no boolean property ${label}`);
  }
  for (const [label, iconName] of Object.entries(swaps)) {
    const key = Object.keys(defs).find((k) => k.split("#")[0] === label && defs[k]!.type === "INSTANCE_SWAP");
    const target = iconComponents.get(iconName);
    if (key && target) update[key] = target.id;
    else problems.push(`${name} has no swap ${label} or icon ${iconName}`);
  }
  if (Object.keys(update).length) instance.setProperties(update);
  return instance;
}

/** Instances of the same component in a row or column, each with its own overrides. */
export type Use = [name: string, props?: Props, texts?: Record<string, string>, flags?: Record<string, boolean>, swaps?: Record<string, string>];
export function instances(list: Use[]): InstanceNode[] {
  return list.map((u) => instance(...u)).filter((n): n is InstanceNode => n !== null);
}

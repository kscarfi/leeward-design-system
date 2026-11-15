// Every icon as a component set with a Weight property (linear, bold, duotone), grouped by the
// categories in iconMeta. Vectors are bound to icon.default, and instances recolor them per use.
import { icons } from "./data.ts";
import { iconMeta } from "../../react/src/components/Icon/iconMeta.ts";
import { bindNum, box, paint, text } from "./dsl.ts";
import { docPage } from "./docs.ts";

/** Linear weight of each icon, the one components use. */
export const iconComponents = new Map<string, ComponentNode>();
const allWeights = new Map<string, ComponentNode[]>();
const weights = ["linear", "bold", "duotone"] as const;

function iconComponent(name: string, weight: (typeof weights)[number]): ComponentNode {
  const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${icons[name]![weight].replace(/currentColor/g, "#000000")}</svg>`;
  const frame = figma.createNodeFromSvg(svg);
  const component = figma.createComponent();
  component.name = `Weight=${weight}`;
  component.resize(24, 24);
  component.fills = [];
  for (const child of [...frame.children]) {
    component.appendChild(child);
    if ("constraints" in child) child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }
  frame.remove();
  recolor(component, "icon.default");
  const meta = iconMeta[name as keyof typeof iconMeta];
  component.description = meta ? `${meta.keywords.join(", ")}${meta.reserved ? `. Reserved: ${meta.reserved}.` : ""}` : "";
  return component;
}

/** Points every vector's fill or stroke at a color variable. */
export function recolor(node: SceneNode, token: string): void {
  const vectors = "findAll" in node ? (node as FrameNode).findAll((n) => n.type === "VECTOR" || n.type === "BOOLEAN_OPERATION") : [node];
  for (const v of vectors as VectorNode[]) {
    if (Array.isArray(v.strokes) && v.strokes.length) v.strokes = [paint(token)];
    if (Array.isArray(v.fills) && v.fills.length) v.fills = [paint(token)];
  }
}

export async function buildIcons(page: PageNode): Promise<FrameNode> {
  const groups = new Map<string, ComponentSetNode[]>();
  for (const name of Object.keys(icons)) {
    const variants = weights.map((w) => iconComponent(name, w));
    for (const v of variants) page.appendChild(v);
    const set = figma.combineAsVariants(variants, page);
    set.name = name;
    set.layoutMode = "HORIZONTAL";
    set.itemSpacing = 8;
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 8;
    set.fills = [];
    iconComponents.set(name, variants[0]!);
    allWeights.set(name, variants);
    const category = iconMeta[name as keyof typeof iconMeta]?.category ?? "Other";
    groups.set(category, [...(groups.get(category) ?? []), set]);
  }
  const sections: FrameNode[] = [];
  for (const [category, sets] of groups) {
    const cells = await Promise.all(
      sets.map(async (set) => {
        const label = await text(set.name, "caption", "text.muted", { align: "center" });
        const cell = await box({ name: set.name, dir: "column", gap: "space.xs", cross: "center", w: 120 }, []);
        cell.appendChild(set);
        cell.appendChild(label);
        return cell;
      }),
    );
    sections.push(await box({ name: category, dir: "column", gap: "space.md" }, [await text(category, "title.sm", "text.default"), await box({ name: "Grid", dir: "row", wrap: true, gap: "space.md", w: 1200 }, cells)]));
  }
  const root = await docPage({
    section: "Assets",
    title: "Icons",
    description: `The ${Object.keys(icons).length} icons the components use, named for what they mean. Linear for UI, bold for selected states, duotone for empty states. Solar Icons Set by 480 Design, CC BY 4.0.`,
    width: 1328,
    body: sections,
  });
  page.appendChild(root);
  return root;
}

/** An icon instance at a size token, colored with a color token. */
export function icon(name: string, size: string = "icon-size.md", color: string = "icon.default", weight: "linear" | "bold" | "duotone" = "linear"): InstanceNode {
  const component = allWeights.get(name)?.[weights.indexOf(weight)] ?? iconComponents.get("info")!;
  const instance = component.createInstance();
  instance.name = name;
  bindNum(instance, "width", size);
  bindNum(instance, "height", size);
  recolor(instance, color);
  return instance;
}

/** Swaps the icon inside an instance (for example an IconButton) and optionally recolors it. */
export function swapIcon(node: InstanceNode | null | undefined, name: string, color?: string): void {
  const inner = node?.type === "INSTANCE" && iconComponents.has(node.name) ? node : (node?.findOne((n) => n.type === "INSTANCE") as InstanceNode | null);
  const target = iconComponents.get(name);
  if (!inner || !target) return;
  inner.swapComponent(target);
  if (color) recolor(inner, color);
}

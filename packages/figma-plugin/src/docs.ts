// Documentation around each component, written from components.manifest.json: purpose, when to use,
// do and don't, accessibility, props, the variant set, and the default variant in all four modes.
import type { ManifestComponent } from "./data.ts";
import { box, fillParent, setMode, text } from "./dsl.ts";
import { icon } from "./icons.ts";
import type { Built } from "./kit.ts";
import { library } from "./dsl.ts";

const W = 1200;

/** Markdown in the manifest (`code`, **bold**) shown as plain text. */
const plain = (s: string) => s.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

async function list(items: string[], marker: "check" | "close" | "dot" = "dot", color = "text.default"): Promise<FrameNode> {
  const rows = await Promise.all(
    items.map(async (item) => {
      const lead = marker === "dot" ? await text("•", "body.md", "text.muted") : icon(marker, "icon-size.md", marker === "check" ? "icon.success" : "icon.danger");
      return box({ name: "Item", dir: "row", gap: "space.xs", w: "fill" }, [lead, await text(plain(item), "body.md", color, { w: "fill" })]);
    }),
  );
  return box({ name: "List", dir: "column", gap: "space.xs", w: "fill" }, rows);
}

async function section(title: string, children: SceneNode[]): Promise<FrameNode> {
  return box({ name: title, dir: "column", gap: "space.md", w: "fill" }, [await text(title, "title.sm", "text.default"), ...children]);
}

async function usageCard(kind: "Do" | "Don't", items: string[]): Promise<FrameNode> {
  const good = kind === "Do";
  const label = await box({ name: "Label", dir: "row", cross: "center", gap: "space.2xs" }, [icon(good ? "check-circle" : "close-circle", "icon-size.md", good ? "icon.success" : "icon.danger", "bold"), await text(kind, "label.lg", good ? "text.success" : "text.danger")]);
  return fillParent(await box({ name: kind, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.default", stroke: good ? "border.success" : "border.danger", strokeSides: { top: true }, strokeWidth: 4 }, [label, await list(items)]));
}

async function propsTable(c: ManifestComponent): Promise<FrameNode | null> {
  if (!c.props?.length) return null;
  const cols = [{ name: "Prop", w: 200 }, { name: "Type", w: 400 }, { name: "Required", w: 100 }, { name: "Description", w: 500 }];
  const row = async (values: string[], header = false) =>
    box({ name: values[0], dir: "row", w: "fill", ...(header ? { fill: "fill.surface.bold" } : { stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }) }, await Promise.all(values.map(async (v, i) => box({ name: cols[i]!.name, dir: "row", px: "space.sm", py: "space.xs", w: cols[i]!.w }, [await text(v, header ? "label.sm" : i < 2 ? "code" : "body.sm", header ? "text.muted" : "text.default", { w: "fill" })]))));
  const rows = [await row(cols.map((c) => c.name), true), ...(await Promise.all(c.props.slice(0, 30).map((p) => row([p.name, p.type.length > 80 ? `${p.type.slice(0, 77)}...` : p.type, p.required ? "Yes" : "No", plain(p.description ?? ""), ]))))];
  return box({ name: "Props", dir: "column", radius: "radius.lg", stroke: "border.subtle", fill: "fill.surface.default", clip: true, w: "fill" }, rows);
}

async function modes(set: Built): Promise<FrameNode> {
  const main = set.type === "COMPONENT_SET" ? (set.defaultVariant as ComponentNode) : set;
  const tiles = await Promise.all(
    Object.keys(library().modeIds).map(async (mode) => {
      const tile = await box({ name: mode, dir: "column", gap: "space.md", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, [await text(mode, "label.sm", "text.muted"), main.createInstance()]);
      setMode(tile, mode);
      return fillParent(tile);
    }),
  );
  return box({ name: "Modes", dir: "row", gap: "space.md", w: "fill", wrap: true }, tiles);
}

/** Puts the set on its own documentation frame. */
export async function docFrame(c: ManifestComponent | undefined, name: string, set: Built, bases: Built[] = []): Promise<FrameNode> {
  const kindLabel = c?.kind === "pattern" ? "Banking pattern" : "Component";
  const header = await box({ name: "Header", dir: "column", gap: "space.sm", w: "fill" }, [await text(kindLabel, "label.md", "text.primary"), await text(name, "display.md", "text.default"), c ? await text(plain(c.purpose), "body.lg", "text.muted", { w: 800 }) : null, await text(`Code: import { ${name} } from "@leeward/react"`, "code", "text.subtle")]);
  const variants = await box({ name: "Variant canvas", dir: "column", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, []);
  variants.appendChild(set);
  const parts: SceneNode[] = [header];
  if (bases.length) {
    // Base parts first: the component below is made of instances of them.
    const canvases: FrameNode[] = [];
    for (const base of bases) {
      const canvas = await box({ name: base.name, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, [await text(base.name, "label.md", "text.default"), base.description ? await text(base.description, "body.sm", "text.muted", { w: 480 }) : null]);
      canvas.appendChild(base);
      canvases.push(canvas);
    }
    parts.push(await section("Base parts", [await text("Edit these to change every place they are used. Names start with _, so they stay out of the published library.", "body.md", "text.muted", { w: 800 }), await box({ name: "Bases", dir: "row", wrap: true, gap: "space.lg", w: "fill", cross: "start" }, canvases)]));
  }
  parts.push(await section(set.type === "COMPONENT_SET" ? `Variants (${set.children.length})` : "Component", [variants]));
  if (c) {
    if (c.whenToUse.length || c.whenNotToUse.length)
      parts.push(await box({ name: "When", dir: "row", gap: "space.xl", w: "fill" }, [fillParent(await section("When to use", [await list(c.whenToUse)])), fillParent(await section("When not to use", [await list(c.whenNotToUse)]))]));
    if (c.do.length || c.dont.length) parts.push(await section("Usage", [await box({ name: "Do and don't", dir: "row", gap: "space.md", w: "fill", cross: "start" }, [await usageCard("Do", c.do), await usageCard("Don't", c.dont)])]));
    if (c.accessibility.length) parts.push(await section("Accessibility", [await list(c.accessibility)]));
    if (c.sizes.length) parts.push(await section("Sizes", [await list(c.sizes)]));
    const props = await propsTable(c);
    if (props) parts.push(await section("Props in code", [props]));
  }
  parts.push(await section("Brands and modes", [await text("The default variant in each mode. Every color, size and radius is a variable, so switching the mode on a frame restyles everything inside it.", "body.md", "text.muted", { w: 800 }), await modes(set)]));
  // Wide variant sets widen the page instead of spilling out of it: 64 px page padding and 24 px canvas padding on each side.
  const width = Math.max(W, Math.ceil(Math.max(set.width, ...bases.map((b) => b.width))) + 2 * 64 + 2 * 24);
  const frame = await box({ name: `${name} docs`, dir: "column", gap: "space.2xl", px: "space.3xl", py: "space.3xl", w: width, fill: "fill.surface.default" }, parts);
  return frame;
}

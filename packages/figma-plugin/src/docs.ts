// Documentation, written from components.manifest.json. Every documentation frame is made of the same
// parts: a _Doc header instance, a body and a _Doc footer instance, so the template is edited in one place.
// A component gets several frames side by side, one per topic, instead of one long page.
import { version, type ManifestComponent } from "./data.ts";
import { box, fillParent, library, setMode, text } from "./dsl.ts";
import { icon } from "./icons.ts";
import { comp, gridLabels, instance, variantSet, type Built } from "./kit.ts";

const W = 1200;

/** Markdown in the manifest (`code`, **bold**) shown as plain text. */
const plain = (s: string) => s.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = () => {
  const d = new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** _Doc header and _Doc footer, built once on the Helpers page. */
export async function buildDocTemplates(): Promise<void> {
  const header = await variantSet(
    "_Doc header",
    {},
    async () =>
      comp({ dir: "column", gap: "space.sm", px: "space.3xl", pad: ["space.3xl", "space.3xl", "space.2xl", "space.3xl"], w: W, fill: "fill.surface.canvas", stroke: "border.subtle", strokeSides: { bottom: true }, strokeWidth: 1 }, [
        await text("Component", "label.md", "text.primary", { name: "#Section" }),
        await text("Title", "display.md", "text.default", { name: "#Title" }),
        await text("What this page covers.", "body.lg", "text.muted", { name: "#Description", w: 800 }),
        await text(`Leeward ${version} · Generated ${today()} · Kemal Salih Carfi`, "code", "text.subtle", { name: "#Meta" }),
      ]),
    { description: "The top of every documentation frame: section, title, description and when it was generated." },
  );
  const footer = await variantSet(
    "_Doc footer",
    {},
    async () =>
      comp({ dir: "row", main: "between", cross: "center", px: "space.3xl", py: "space.lg", w: W, fill: "fill.surface.canvas", stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, [
        await text("Leeward Design System", "label.sm", "text.muted"),
        await text("Source of truth: github.com/kscarfi/leeward-design-system · MIT license", "caption", "text.subtle", { name: "#Note" }),
      ]),
    { description: "The bottom of every documentation frame." },
  );
  footer.y = header.y + header.height + 80;
}

/** One documentation frame: header, body and footer. */
export async function docPage(o: { section: string; title: string; description: string; body: Array<SceneNode | null>; width?: number }): Promise<FrameNode> {
  const header = instance("_Doc header", {}, { Section: o.section, Title: o.title, Description: o.description });
  const footer = instance("_Doc footer");
  const body = await box({ name: "Body", dir: "column", gap: "space.2xl", px: "space.3xl", py: "space.2xl", w: "fill" }, o.body);
  return box({ name: o.title, dir: "column", w: o.width ?? W, fill: "fill.surface.default" }, [header ? fillParent(header) : null, body, footer ? fillParent(footer) : null]);
}

async function list(items: string[]): Promise<FrameNode> {
  const rows = await Promise.all(items.map(async (item) => box({ name: "Item", dir: "row", gap: "space.xs", w: "fill" }, [await text("•", "body.md", "text.muted"), await text(plain(item), "body.md", "text.default", { w: "fill" })])));
  return box({ name: "List", dir: "column", gap: "space.xs", w: "fill" }, rows);
}

async function section(title: string, children: Array<SceneNode | null>): Promise<FrameNode> {
  return box({ name: title, dir: "column", gap: "space.md", w: "fill" }, [await text(title, "title.sm", "text.default"), ...children]);
}

async function usageCard(kind: "Do" | "Don't", items: string[]): Promise<FrameNode> {
  const good = kind === "Do";
  const label = await box({ name: "Label", dir: "row", cross: "center", gap: "space.2xs" }, [icon(good ? "check-circle" : "close-circle", "icon-size.md", good ? "icon.success" : "icon.danger", "bold"), await text(kind, "label.lg", good ? "text.success" : "text.danger")]);
  return fillParent(await box({ name: kind, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.default", stroke: good ? "border.success" : "border.danger", strokeSides: { top: true }, strokeWidth: 4 }, [label, await list(items)]));
}

/** A table with a header row; column widths in px. */
export async function table(cols: Array<{ name: string; w: number; code?: boolean }>, rows: string[][]): Promise<FrameNode> {
  const row = async (values: string[], header = false) =>
    box({ name: values[0] ?? "Row", dir: "row", w: "fill", ...(header ? { fill: "fill.surface.bold" } : { stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }) }, await Promise.all(values.map(async (v, i) => box({ name: cols[i]!.name, dir: "row", px: "space.sm", py: "space.xs", w: cols[i]!.w }, [await text(v, header ? "label.sm" : cols[i]!.code ? "code" : "body.sm", header ? "text.muted" : "text.default", { w: "fill" })]))));
  const all = [await row(cols.map((c) => c.name), true), ...(await Promise.all(rows.map((r) => row(r))))];
  return box({ name: "Table", dir: "column", radius: "radius.lg", stroke: "border.subtle", fill: "fill.surface.default", clip: true }, all);
}

async function modes(set: Built): Promise<FrameNode> {
  const main = set.type === "COMPONENT_SET" ? (set.defaultVariant as ComponentNode) : set;
  const tiles = await Promise.all(
    Object.keys(library().modeIds).map(async (mode) => {
      const tile = await box({ name: mode, dir: "column", gap: "space.md", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, [await text(mode, "label.sm", "text.muted"), main.createInstance()]);
      setMode(tile, mode);
      return tile;
    }),
  );
  return box({ name: "Modes", dir: "row", gap: "space.md", wrap: true, w: "fill" }, tiles);
}

/** Room left of and above a variant grid for its row and column labels. */
const LABEL_W = 180;
const LABEL_H = 28;

/** The set with its column values on top and row values on the left, so every variant is named on the page. */
async function labelled(set: ComponentSetNode): Promise<SceneNode> {
  const meta = gridLabels.get(set);
  if (!meta || (meta.cols.length < 2 && meta.rows.length < 2)) return set;
  // Without row properties there is nothing to put on the left.
  const left = meta.rowKeys.length ? LABEL_W : 0;
  const frame = figma.createFrame();
  frame.name = "Labelled grid";
  frame.fills = [];
  frame.clipsContent = false;
  frame.resize(left + set.width, LABEL_H + set.height);
  frame.appendChild(set);
  set.x = left;
  set.y = LABEL_H;
  for (const col of meta.cols) {
    const t = await text(`${meta.colKey}: ${col.label}`, "caption", "text.muted", { name: `${meta.colKey}=${col.label}` });
    frame.appendChild(t);
    t.x = left + col.x;
    t.y = 4;
  }
  for (const row of left ? meta.rows : []) {
    const values = row.label.split(" · ");
    const label = values.map((v, i) => `${meta.rowKeys[i]}: ${v}`).join("\n");
    const t = await text(label, "caption", "text.muted", { name: row.label, w: LABEL_W - 16 });
    frame.appendChild(t);
    t.x = 0;
    t.y = LABEL_H + row.y + Math.max(0, row.h / 2 - t.height / 2);
  }
  return frame;
}

async function canvas(node: SceneNode, title?: string, description?: string): Promise<FrameNode> {
  const c = await box({ name: title ?? node.name, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, [title ? await text(title, "label.md", "text.default") : null, description ? await text(description, "body.sm", "text.muted", { w: 480 }) : null]);
  c.appendChild(node.type === "COMPONENT_SET" ? await labelled(node) : node);
  return c;
}

/** The documentation frames of one component or pattern, left to right. */
export async function docFrames(c: ManifestComponent | undefined, name: string, set: Built, bases: Built[] = []): Promise<FrameNode[]> {
  const kindLabel = c?.kind === "pattern" ? "Banking pattern" : "Component";
  const purpose = c ? plain(c.purpose) : (set.description ?? "");
  const frames: FrameNode[] = [];
  // Wide sets widen their frame instead of spilling out of it: 64 px page padding and 24 px canvas padding on each side.
  const fit = (node: SceneNode) => Math.max(W, Math.ceil(node.width) + LABEL_W + 2 * 64 + 2 * 24);

  frames.push(
    await docPage({
      section: kindLabel,
      title: name,
      description: purpose,
      body: [
        await text(`import { ${name} } from "@leeward/react"`, "code", "text.default"),
        c && (c.whenToUse.length || c.whenNotToUse.length) ? await box({ name: "When", dir: "row", gap: "space.xl", w: "fill", cross: "start" }, [fillParent(await section("When to use", [await list(c.whenToUse)])), fillParent(await section("When not to use", [await list(c.whenNotToUse)]))]) : null,
        c?.sizes.length ? await section("Sizes", [await list(c.sizes)]) : null,
      ],
    }),
  );
  if (bases.length) {
    const canvases = await Promise.all(bases.map((b) => canvas(b, b.name, b.description)));
    const widest = Math.max(...bases.map((b) => b.width)) + LABEL_W;
    frames.push(await docPage({ section: name, title: "Base parts", description: "The parts this component is made of. Edit a base to change every place it is used. Names start with _, so they stay out of the published library.", width: Math.max(W, Math.ceil(widest) + 2 * 64 + 2 * 24), body: [await box({ name: "Bases", dir: "column", gap: "space.lg", w: "fill" }, canvases)] }));
  }
  frames.push(await docPage({ section: name, title: set.type === "COMPONENT_SET" ? `Variants (${set.children.length})` : "Component", description: set.type === "COMPONENT_SET" ? "Every variant, labelled by its properties and bound to variables. Use the properties panel to switch variants, texts, icons and optional parts." : "The component, bound to variables. Use the properties panel to change its texts, icons and optional parts.", width: fit(set), body: [await canvas(set)] }));
  if (c && (c.do.length || c.dont.length || c.accessibility.length))
    frames.push(
      await docPage({
        section: name,
        title: "Usage and accessibility",
        description: "How to use it well, and what it does for people using a keyboard or a screen reader.",
        body: [c.do.length || c.dont.length ? await box({ name: "Do and don't", dir: "row", gap: "space.md", w: "fill", cross: "start" }, [await usageCard("Do", c.do), await usageCard("Don't", c.dont)]) : null, c.accessibility.length ? await section("Accessibility", [await list(c.accessibility)]) : null],
      }),
    );
  if (c?.props?.length)
    frames.push(await docPage({ section: name, title: "Props in code", description: "The React props, from the component manifest.", body: [await table([{ name: "Prop", w: 200, code: true }, { name: "Type", w: 400, code: true }, { name: "Required", w: 100 }, { name: "Description", w: 372 }], c.props.slice(0, 30).map((p) => [p.name, p.type.length > 80 ? `${p.type.slice(0, 77)}...` : p.type, p.required ? "Yes" : "No", plain(p.description ?? "")]))] }));
  frames.push(await docPage({ section: name, title: "Brands and modes", description: "The default variant in each mode. Switching the mode on a frame restyles everything inside it.", body: [await modes(set)] }));
  return frames;
}


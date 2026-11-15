// A small drawing kit. Every color, size, radius and gap is bound to a Leeward variable, so a
// component built here changes with the mode, exactly like the React component changes with the theme.
import type { Library } from "./variables.ts";
import { effectStyles, styleFor } from "./styles.ts";
import { problems } from "./util.ts";

let lib: Library | undefined;
export const setLibrary = (library: Library) => (lib = library);
export const library = () => lib!;

const missing = new Set<string>();
export function variable(token: string): Variable | undefined {
  const found = lib?.vars.get(token);
  if (!found && !missing.has(token)) {
    missing.add(token);
    problems.push(`No variable for token ${token}`);
  }
  return found;
}

/** A solid paint bound to a primitive color, for the palette page only. */
export function primitivePaint(key: string): SolidPaint {
  const base: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
  const v = lib?.primitives.get(`color.${key}`);
  return v ? figma.variables.setBoundVariableForPaint(base, "color", v) : base;
}

/** A solid paint bound to a color variable. */
export function paint(token: string): SolidPaint {
  const base: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
  const v = variable(token);
  return v ? figma.variables.setBoundVariableForPaint(base, "color", v) : base;
}

type NumField = "width" | "height" | "minWidth" | "maxWidth" | "minHeight" | "paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom" | "itemSpacing" | "counterAxisSpacing" | "strokeWeight" | "topLeftRadius" | "topRightRadius" | "bottomLeftRadius" | "bottomRightRadius";
/** A number or a token name. */
export type Num = number | string;

export function bindNum(node: SceneNode, field: NumField, value: Num | undefined): void {
  if (value === undefined) return;
  const n = node as FrameNode;
  if (typeof value === "number") {
    if (field === "width") n.resize(value, n.height);
    else if (field === "height") n.resize(n.width, value);
    else (n as unknown as Record<string, number>)[field] = value;
    return;
  }
  const v = variable(value);
  if (!v) return;
  // Bind the value first so a fixed size has the right number even before Figma resolves the alias.
  n.setBoundVariable(field as VariableBindableNodeField, v);
}

export function radius(node: SceneNode, value: Num | undefined): void {
  for (const corner of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"] as const) bindNum(node, corner, value);
}

export type Sizing = "hug" | "fill" | Num;
export interface BoxOptions {
  name?: string | undefined;
  dir?: "row" | "column" | "none" | undefined;
  gap?: Num | undefined;
  /** Horizontal and vertical padding, or [top, right, bottom, left]. */
  px?: Num | undefined;
  py?: Num | undefined;
  pad?: [Num, Num, Num, Num] | undefined;
  fill?: string | undefined;
  stroke?: string | undefined;
  strokeWidth?: Num | undefined;
  /** Stroke only on some sides, like a CSS border-bottom. */
  strokeSides?: Partial<Record<"top" | "right" | "bottom" | "left", boolean>> | undefined;
  dashed?: boolean | undefined;
  radius?: Num | undefined;
  w?: Sizing | undefined;
  h?: Sizing | undefined;
  minW?: Num | undefined;
  maxW?: Num | undefined;
  main?: "start" | "center" | "end" | "between" | undefined;
  cross?: "start" | "center" | "end" | "baseline" | undefined;
  effect?: string | undefined;
  clip?: boolean | undefined;
  opacity?: number | undefined;
  wrap?: boolean | undefined;
}

const pending = new WeakMap<SceneNode, { w?: "FILL"; h?: "FILL" }>();

/** Marks a node to fill its auto layout parent on one or both axes, once it is appended. */
export function fillParent<T extends SceneNode>(node: T, axes: "w" | "h" | "wh" = "w"): T {
  pending.set(node, { ...(axes.includes("w") ? { w: "FILL" as const } : {}), ...(axes.includes("h") ? { h: "FILL" as const } : {}) });
  return node;
}

export function append(parent: FrameNode | ComponentNode, children: Array<SceneNode | null | undefined | false>): void {
  for (const child of children) {
    if (!child) continue;
    parent.appendChild(child);
    const fill = pending.get(child);
    if (fill && parent.layoutMode !== "NONE") {
      const c = child as FrameNode;
      if (fill.w) c.layoutSizingHorizontal = "FILL";
      if (fill.h) c.layoutSizingVertical = "FILL";
    }
  }
}

export async function style(node: FrameNode | ComponentNode, o: BoxOptions): Promise<void> {
  if (o.name) node.name = o.name;
  node.fills = o.fill ? [paint(o.fill)] : [];
  if (o.dir !== "none") {
    node.layoutMode = o.dir === "row" ? "HORIZONTAL" : "VERTICAL";
    node.primaryAxisAlignItems = o.main === "center" ? "CENTER" : o.main === "end" ? "MAX" : o.main === "between" ? "SPACE_BETWEEN" : "MIN";
    node.counterAxisAlignItems = o.cross === "center" ? "CENTER" : o.cross === "end" ? "MAX" : o.cross === "baseline" ? "BASELINE" : "MIN";
    if (o.wrap) node.layoutWrap = "WRAP";
    bindNum(node, "itemSpacing", o.gap ?? 0);
    if (o.wrap) bindNum(node, "counterAxisSpacing", o.gap ?? 0);
    const [t, r, b, l] = o.pad ?? [o.py ?? 0, o.px ?? 0, o.py ?? 0, o.px ?? 0];
    bindNum(node, "paddingTop", t);
    bindNum(node, "paddingRight", r);
    bindNum(node, "paddingBottom", b);
    bindNum(node, "paddingLeft", l);
    node.layoutSizingHorizontal = "HUG";
    node.layoutSizingVertical = "HUG";
  }
  if (o.stroke) {
    node.strokes = [paint(o.stroke)];
    node.strokeAlign = "INSIDE";
    if (o.dashed) node.dashPattern = [6, 4];
    if (o.strokeSides) {
      for (const side of ["top", "right", "bottom", "left"] as const) {
        const key = `stroke${side[0]!.toUpperCase()}${side.slice(1)}Weight` as "strokeTopWeight";
        const on = o.strokeSides[side];
        if (on && typeof o.strokeWidth === "string") node.setBoundVariable(key, variable(o.strokeWidth) ?? null);
        else node[key] = on ? (typeof o.strokeWidth === "number" ? o.strokeWidth : 1) : 0;
      }
    } else bindNum(node, "strokeWeight", o.strokeWidth ?? "size.border.default");
  } else node.strokes = [];
  radius(node, o.radius);
  if (typeof o.w === "number" || (typeof o.w === "string" && o.w !== "hug" && o.w !== "fill")) {
    if (o.dir !== "none") node.layoutSizingHorizontal = "FIXED";
    bindNum(node, "width", o.w);
  }
  if (typeof o.h === "number" || (typeof o.h === "string" && o.h !== "hug" && o.h !== "fill")) {
    if (o.dir !== "none") node.layoutSizingVertical = "FIXED";
    bindNum(node, "height", o.h);
  }
  if (o.minW !== undefined) bindNum(node, "minWidth", o.minW);
  if (o.maxW !== undefined) bindNum(node, "maxWidth", o.maxW);
  if (o.w === "fill" || o.h === "fill") fillParent(node, o.w === "fill" && o.h === "fill" ? "wh" : o.w === "fill" ? "w" : "h");
  const ringOnly = Boolean(o.effect?.startsWith("focus")) && !o.fill;
  if (o.effect && !ringOnly) {
    const effect = effectStyles.get(o.effect);
    if (effect) await node.setEffectStyleIdAsync(effect.id);
    else problems.push(`No effect style ${o.effect}`);
  }
  // Figma draws shadow spread only on frames that clip content, and focus rings are pure spread.
  node.clipsContent = o.clip ?? (Boolean(o.effect?.startsWith("focus")) && !ringOnly);
  // A frame without a fill casts no shadow, so its focus ring is drawn as a stroke once its size is known.
  if (ringOnly) rings.set(node, o.effect!);
  if (o.opacity !== undefined) node.opacity = o.opacity;
}

const rings = new WeakMap<SceneNode, string>();

/**
 * Draws the focus ring of a frame without a fill: a stroke in the focus color, 2 px outside the
 * element with a 2 px gap (or on its inner edge for focus-inset). It stretches with the frame.
 */
export function finish(node: FrameNode | ComponentNode): void {
  const kind = rings.get(node);
  if (!kind) return;
  const offset = kind === "focus-inset" ? 0 : 4;
  const ring = figma.createRectangle();
  ring.name = "Focus ring";
  node.appendChild(ring);
  if (node.layoutMode !== "NONE") ring.layoutPositioning = "ABSOLUTE";
  ring.x = -offset;
  ring.y = -offset;
  ring.resize(Math.max(1, node.width + offset * 2), Math.max(1, node.height + offset * 2));
  ring.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
  ring.fills = [];
  ring.strokes = [paint(kind === "focus-danger" ? "border.danger" : kind === "focus-inverse" ? "border.inverse" : "border.focus")];
  ring.strokeAlign = "INSIDE";
  bindNum(ring, "strokeWeight", "size.focus-ring.width");
  ring.cornerRadius = (typeof node.topLeftRadius === "number" ? node.topLeftRadius : 0) + offset;
}

/** An auto layout frame. */
export async function box(o: BoxOptions, children: Array<SceneNode | null | undefined | false> = []): Promise<FrameNode> {
  const frame = figma.createFrame();
  await style(frame, o);
  append(frame, children);
  finish(frame);
  return frame;
}

export interface TextOptions {
  name?: string;
  w?: "fill" | number;
  align?: "left" | "center" | "right";
  /** One line with an ellipsis. */
  truncate?: boolean;
  strike?: boolean;
  underline?: boolean;
  /** Marks amounts. Figma has no API for tabular figures, so this only documents intent. */
  numeric?: boolean;
  weight?: "Regular" | "Medium" | "SemiBold" | "Bold";
  /** IBM Plex Mono at the role's size. */
  mono?: boolean;
}

/** "labelSm" (the CSS module class) and "label.sm" (the token) both work. */
export function role(name: string): string {
  if (name.includes(".")) return name;
  const m = name.match(/^([a-z]+)([A-Z].*)?$/);
  return m && m[2] ? `${m[1]}.${m[2].toLowerCase()}` : name;
}

export async function text(characters: string, typeRole: string, color: string, o: TextOptions = {}): Promise<TextNode> {
  const node = figma.createText();
  const r = role(typeRole);
  // Weight, family and decoration come from a style variation, so the text stays linked to a text style.
  const s = await styleFor(r, { weight: o.weight, mono: o.mono, decoration: o.strike ? "STRIKETHROUGH" : o.underline ? "UNDERLINE" : undefined });
  if (s) await node.setTextStyleIdAsync(s.id);
  else problems.push(`No text style ${r}`);
  node.characters = characters;
  node.fills = [paint(color)];
  node.name = o.name ?? characters.slice(0, 40);
  if (o.align) node.textAlignHorizontal = o.align === "left" ? "LEFT" : o.align === "center" ? "CENTER" : "RIGHT";
  if (o.truncate) {
    node.textTruncation = "ENDING";
    node.maxLines = 1;
  }
  if (o.w === "fill") {
    node.textAutoResize = "HEIGHT";
    fillParent(node);
  } else if (typeof o.w === "number") {
    node.resize(o.w, node.height);
    node.textAutoResize = "HEIGHT";
  } else node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

/** A plain rectangle, for tracks, bars and dots. */
export function rect(o: { name?: string; w: Num; h: Num; fill?: string; radius?: Num; stroke?: string; opacity?: number }): RectangleNode {
  const r = figma.createRectangle();
  r.name = o.name ?? "Shape";
  r.resize(typeof o.w === "number" ? o.w : 10, typeof o.h === "number" ? o.h : 10);
  bindNum(r, "width", o.w);
  bindNum(r, "height", o.h);
  r.fills = o.fill ? [paint(o.fill)] : [];
  if (o.stroke) {
    r.strokes = [paint(o.stroke)];
    r.strokeAlign = "INSIDE";
    bindNum(r, "strokeWeight", "size.border.default");
  }
  radius(r, o.radius);
  if (o.opacity !== undefined) r.opacity = o.opacity;
  return r;
}

export function ellipse(o: { name?: string; size: Num; fill?: string; stroke?: string; strokeWidth?: Num }): EllipseNode {
  const e = figma.createEllipse();
  e.name = o.name ?? "Circle";
  bindNum(e, "width", o.size);
  bindNum(e, "height", o.size);
  e.fills = o.fill ? [paint(o.fill)] : [];
  if (o.stroke) {
    e.strokes = [paint(o.stroke)];
    e.strokeAlign = "INSIDE";
    bindNum(e, "strokeWeight", o.strokeWidth ?? "size.border.strong");
  }
  return e;
}

/** Sets an explicit mode on a frame, so its contents render in that brand and mode. */
export function setMode(node: FrameNode, modeName: string): void {
  const l = library();
  const id = l.modeIds[modeName];
  if (id) node.setExplicitVariableModeForCollection(l.collections.Color, id);
  // Dimensions follow the brand only: "Business Dark" uses the Business sizes.
  const brandId = l.brandModeIds[modeName.split(" ")[0]!];
  if (brandId) node.setExplicitVariableModeForCollection(l.collections.Dimension, brandId);
}

// Text styles for every type role and effect styles for elevation and focus rings. Both are bound to
// variables, so a style follows the brand and theme of the frame it is used in.
import { light } from "./data.ts";
import { variable } from "./dsl.ts";
import { problems, px, rgba } from "./util.ts";

const WEIGHT: Record<number, string> = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold" };

export const textStyles = new Map<string, TextStyle>();
export const effectStyles = new Map<string, EffectStyle>();

export function fontFor(role: string): FontName {
  const family = String(light[`type.${role}.family`]?.value ?? "Plus Jakarta Sans").split(",")[0]!.replace(/"/g, "").trim();
  const weight = Number(light[`type.${role}.weight`]?.value ?? 400);
  return { family, style: WEIGHT[weight] ?? "Regular" };
}

export function typeRoles(): string[] {
  return [...new Set(Object.keys(light).filter((k) => k.startsWith("type.") && k.endsWith(".size")).map((k) => k.slice(5, -5)))];
}

export async function loadFonts(): Promise<void> {
  const fonts = new Map<string, FontName>();
  for (const role of typeRoles()) fonts.set(JSON.stringify(fontFor(role)), fontFor(role));
  for (const style of ["Regular", "Medium", "SemiBold", "Bold"]) fonts.set(style, { family: "Plus Jakarta Sans", style });
  for (const font of fonts.values()) await figma.loadFontAsync(font);
}

export function buildTextStyles(): void {
  for (const role of typeRoles()) {
    const style = figma.createTextStyle();
    style.name = role.replace(".", "/");
    style.fontName = fontFor(role);
    style.fontSize = px(light[`type.${role}.size`]!.value);
    style.lineHeight = { unit: "PIXELS", value: px(light[`type.${role}.line-height`]!.value) };
    const tracking = parseFloat(String(light[`type.${role}.tracking`]?.value ?? "0"));
    style.letterSpacing = { unit: "PERCENT", value: tracking * 100 };
    style.description = `--lw-type-${role.replace(".", "-")}-*${String(light[`type.${role}.size`]!.value).startsWith("clamp") ? ". Fluid in code; this style uses the desktop size." : ""}`;
    // Bind every property that has a variable; letter spacing stays a percentage, as in the tokens.
    const fields: Array<[VariableBindableTextField, string]> = [["fontFamily", "family"], ["fontSize", "size"], ["lineHeight", "line-height"], ["fontWeight", "weight"]];
    for (const [field, part] of fields) {
      const v = variable(`type.${role}.${part}`);
      if (!v) continue;
      try {
        style.setBoundVariable(field, v);
      } catch (error) {
        problems.push(`Text style ${style.name} ${field}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    textStyles.set(role, style);
  }
}

// Promises, not styles: texts are built in parallel, and two of them must not create the same variation twice.
const derived = new Map<string, Promise<TextStyle>>();

export interface StyleVariation {
  weight?: "Regular" | "Medium" | "SemiBold" | "Bold" | undefined;
  /** IBM Plex Mono instead of the role's family, for card numbers and codes set at another size. */
  mono?: boolean | undefined;
  decoration?: "UNDERLINE" | "STRIKETHROUGH" | undefined;
}

/**
 * The text style for a role, or a variation of it ("label/md/Bold", "body/md/Underline"). Variations are
 * real styles, so text never drifts from the type scale; size and line height stay bound to the role's variables.
 */
export async function styleFor(role: string, v: StyleVariation = {}): Promise<TextStyle | undefined> {
  const base = textStyles.get(role);
  if (!base || (!v.weight && !v.mono && !v.decoration)) return base;
  const parts = [v.weight, v.mono ? "Mono" : undefined, v.decoration === "UNDERLINE" ? "Underline" : v.decoration === "STRIKETHROUGH" ? "Strikethrough" : undefined].filter(Boolean);
  const name = `${base.name}/${parts.join(" ")}`;
  const cached = derived.get(name);
  if (cached) return cached;
  const created = createVariation(role, base, name, parts, v);
  derived.set(name, created);
  return created;
}

async function createVariation(role: string, base: TextStyle, name: string, parts: Array<string | undefined>, v: StyleVariation): Promise<TextStyle> {
  const family = v.mono ? fontFor("code").family : (base.fontName as FontName).family;
  const font = { family, style: v.weight ?? (base.fontName as FontName).style };
  await figma.loadFontAsync(font);
  const style = figma.createTextStyle();
  style.name = name;
  style.fontName = font;
  style.fontSize = base.fontSize;
  style.lineHeight = base.lineHeight;
  style.letterSpacing = base.letterSpacing;
  if (v.decoration) style.textDecoration = v.decoration;
  style.description = `${base.description} ${parts.join(", ")}.`;
  const fields: Array<[VariableBindableTextField, string]> = [["fontSize", "size"], ["lineHeight", "line-height"], ...(v.mono ? [] : ([["fontFamily", "family"]] as Array<[VariableBindableTextField, string]>)), ...(v.weight ? [] : ([["fontWeight", "weight"]] as Array<[VariableBindableTextField, string]>))];
  for (const [field, part] of fields) {
    const variableForField = variable(`type.${role}.${part}`);
    if (variableForField) style.setBoundVariable(field, variableForField);
  }
  return style;
}

/** Parses "0px 1px 2px 0px rgba(...), ..." into drop shadows. */
function shadows(css: string): DropShadowEffect[] {
  return css.split(/,(?![^(]*\))/).map((part) => {
    const color = part.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/)?.[0] ?? "rgba(0,0,0,0.1)";
    const [x = 0, y = 0, blur = 0, spread = 0] = part.replace(color, "").trim().split(/\s+/).map(px);
    return { type: "DROP_SHADOW", color: rgba(color), offset: { x, y }, radius: blur, spread, visible: true, blendMode: "NORMAL", showShadowBehindNode: false };
  });
}

/** Binds an effect field to a variable when there is one; the number stays as the fallback. */
function bound<T extends DropShadowEffect | InnerShadowEffect>(effect: T, field: VariableBindableEffectField, token: string): T {
  const v = variable(token);
  if (!v) return effect;
  // Figma resets the other numbers when it binds one field, so keep them unless that field is the one bound.
  const result = figma.variables.setBoundVariableForEffect(effect, field, v) as T;
  return { ...result, ...(field === "spread" ? {} : { spread: effect.spread }), ...(field === "radius" ? {} : { radius: effect.radius }), offset: effect.offset };
}

/** Focus rings: the ring and the surface gap are bound to color variables, so they follow the mode. */
function focusRing(name: string): Effect[] {
  const offset = px(light["size.focus-ring.offset"]?.value ?? 2);
  const width = px(light["size.focus-ring.width"]?.value ?? 2);
  const surface = rgba(String(light["fill.surface.default"]?.value ?? "#ffffff"));
  const ringToken = name === "focus-danger" ? "border.danger" : name === "focus-inverse" ? "border.inverse" : "border.focus";
  const ring = rgba(String(light[ringToken]?.value ?? "#4f46e5"));
  const shadow = (spread: number, color: RGBA): DropShadowEffect => ({ type: "DROP_SHADOW", color, offset: { x: 0, y: 0 }, radius: 0, spread, visible: true, blendMode: "NORMAL", showShadowBehindNode: false });
  if (name === "focus-halo") return [shadow(px(light["size.focus-ring.halo"]?.value ?? 4), { ...ring, a: 0.3 })];
  if (name === "focus-inset") return [bound(bound({ type: "INNER_SHADOW", color: ring, offset: { x: 0, y: 0 }, radius: 0, spread: width, visible: true, blendMode: "NORMAL" } as InnerShadowEffect, "color", ringToken), "spread", "size.focus-ring.width")];
  return [bound(shadow(offset + width, ring), "color", ringToken), bound(bound(shadow(offset, surface), "color", "fill.surface.default"), "spread", "size.focus-ring.offset")];
}

export function buildEffectStyles(): void {
  for (const [name, token] of Object.entries(light)) {
    if (!name.startsWith("elevation.")) continue;
    const key = name.slice(10);
    const style = figma.createEffectStyle();
    const focus: Record<string, string> = { focus: "Default", "focus-inset": "Inset", "focus-danger": "Danger", "focus-inverse": "Inverse", "focus-halo": "Halo" };
    style.name = key.startsWith("focus") ? `Focus ring/${focus[key] ?? key}` : `Elevation/${key}`;
    style.effects = key.startsWith("focus") ? focusRing(key) : shadows(String(token.value));
    style.description = token.description ?? `var(${token.cssVar})`;
    effectStyles.set(key, style);
  }
}

// Text styles for every type role and effect styles for elevation and focus rings.
import { light } from "./data.ts";
import { px, rgba } from "./util.ts";

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
    textStyles.set(role, style);
  }
}

/** Parses "0px 1px 2px 0px rgba(...), ..." into drop shadows. */
function shadows(css: string): DropShadowEffect[] {
  return css.split(/,(?![^(]*\))/).map((part) => {
    const color = part.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/)?.[0] ?? "rgba(0,0,0,0.1)";
    const [x = 0, y = 0, blur = 0, spread = 0] = part.replace(color, "").trim().split(/\s+/).map(px);
    return { type: "DROP_SHADOW", color: rgba(color), offset: { x, y }, radius: blur, spread, visible: true, blendMode: "NORMAL", showShadowBehindNode: false };
  });
}

/** Focus rings reference other tokens in CSS; here they are resolved for Leeward light. */
function focusRing(name: string): Effect[] {
  const offset = px(light["size.focus-ring.offset"]?.value ?? 2);
  const width = px(light["size.focus-ring.width"]?.value ?? 2);
  const surface = rgba(String(light["fill.surface.default"]?.value ?? "#ffffff"));
  const ring = rgba(String(light[name === "focus-danger" ? "border.danger" : name === "focus-inverse" ? "border.inverse" : "border.focus"]?.value ?? "#4f46e5"));
  const shadow = (spread: number, color: RGBA): DropShadowEffect => ({ type: "DROP_SHADOW", color, offset: { x: 0, y: 0 }, radius: 0, spread, visible: true, blendMode: "NORMAL", showShadowBehindNode: false });
  if (name === "focus-halo") return [shadow(px(light["size.focus-ring.halo"]?.value ?? 4), { ...ring, a: 0.3 })];
  if (name === "focus-inset") return [{ type: "INNER_SHADOW", color: ring, offset: { x: 0, y: 0 }, radius: 0, spread: width, visible: true, blendMode: "NORMAL" }];
  return [shadow(offset + width, ring), shadow(offset, surface)];
}

export function buildEffectStyles(): void {
  for (const [name, token] of Object.entries(light)) {
    if (!name.startsWith("elevation.")) continue;
    const key = name.slice(10);
    const style = figma.createEffectStyle();
    style.name = `elevation/${key}`;
    style.effects = key.startsWith("focus") ? focusRing(key) : shadows(String(token.value));
    style.description = token.description ?? `var(${token.cssVar})`;
    effectStyles.set(key, style);
  }
}

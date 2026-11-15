// Variable collections, split by what changes them:
// - Primitives: the color ramps, hidden from pickers.
// - Color: every color token, with a mode per brand and theme (Leeward Light ... Business Dark).
// - Dimension: space, size, radius and component sizes, with a mode per brand (they never change with the theme).
// - Typography and Layout: type, motion, layers, breakpoints and grid, the same for every brand.
// Tokens alias the token they come from (across collections), and colors alias their primitive.
import { light, modes, ramps, type Token } from "./data.ts";
import { problems, px, rgba, varName } from "./util.ts";

export type CollectionName = "Color" | "Dimension" | "Typography" | "Layout";

export interface Library {
  collections: Record<CollectionName, VariableCollection>;
  /** Color modes by name, for example "Business Dark". */
  modeIds: Record<string, string>;
  /** Dimension modes by brand, for example "Business". */
  brandModeIds: Record<string, string>;
  vars: Map<string, Variable>;
  primitives: Map<string, Variable>;
}

const brandOf = (modeName: string) => modeName.split(" ")[0]!;

const scopesFor = (name: string, type: VariableResolvedDataType): VariableScope[] => {
  if (type === "COLOR") {
    if (name.startsWith("text.") || name.startsWith("amount.")) return ["TEXT_FILL"];
    if (name.startsWith("border.")) return ["STROKE_COLOR", "EFFECT_COLOR"];
    if (name.startsWith("icon.")) return ["SHAPE_FILL", "STROKE_COLOR"];
    return ["FRAME_FILL", "SHAPE_FILL"];
  }
  if (type === "STRING") return ["FONT_FAMILY"];
  if (name.startsWith("type.") && name.endsWith(".size")) return ["FONT_SIZE"];
  if (name.startsWith("type.") && name.endsWith(".line-height")) return ["LINE_HEIGHT"];
  if (name.startsWith("type.") && name.endsWith(".weight")) return ["FONT_WEIGHT"];
  if (name.startsWith("size.border") || name.startsWith("size.focus-ring") || name.includes("border-width") || name.includes("thickness")) return ["STROKE_FLOAT", "EFFECT_FLOAT"];
  if (name.startsWith("space.") || name.includes("gap") || name.includes("padding") || name.includes("inset")) return ["GAP"];
  if (name.startsWith("radius.") || name.includes("radius")) return ["CORNER_RADIUS"];
  if (name.includes("height") || name.includes("size") || name.includes("width")) return ["WIDTH_HEIGHT"];
  return [];
};

function kind(name: string, token: Token): VariableResolvedDataType | null {
  if (token.type === "color") return "COLOR";
  if (token.type === "fontFamily") return "STRING";
  if (name.startsWith("elevation.") || name.endsWith(".tracking")) return null;
  if (typeof token.value === "number") return "FLOAT";
  if (typeof token.value === "string" && /^(-?[\d.]+(rem|px|ms)?|clamp\(.+\)|0)$/.test(token.value)) return "FLOAT";
  return null;
}

function collectionFor(name: string, type: VariableResolvedDataType): CollectionName {
  if (type === "COLOR") return "Color";
  const group = name.split(".")[0]!;
  if (group === "type") return "Typography";
  if (["motion", "layer", "breakpoint", "grid"].includes(group)) return "Layout";
  return "Dimension";
}

function value(name: string, token: Token, type: VariableResolvedDataType): VariableValue {
  if (type === "COLOR") return rgba(String(token.value));
  if (type === "STRING") return String(token.value).split(",")[0]!.replace(/"/g, "").trim();
  if (typeof token.value === "string" && token.value.endsWith("ms")) return parseFloat(token.value);
  return px(token.value);
}

/**
 * Aliases keep the link a designer would expect: component tokens point at the semantic token they
 * come from, semantic colors at their primitive. An alias is used only when it resolves to the same value.
 */
function valueFor(name: string, t: Token, type: VariableResolvedDataType, tokens: Record<string, Token>, vars: Map<string, Variable>, primitiveVars: Map<string, Variable>): VariableValue {
  const raw = value(name, t, type);
  if (!t.ref) return raw;
  const target = vars.get(t.ref);
  const refToken = tokens[t.ref];
  if (target && target.resolvedType === type && refToken && String(refToken.value).toLowerCase() === String(t.value).toLowerCase()) return figma.variables.createVariableAlias(target);
  if (type === "COLOR") {
    const [, ramp, stepName] = t.ref.split(".");
    const primitive = primitiveVars.get(t.ref);
    if (primitive && (ramps[ramp!]?.[stepName!] ?? "").toLowerCase() === String(t.value).toLowerCase()) return figma.variables.createVariableAlias(primitive);
  }
  return raw;
}

/** Adds modes after the first; Starter files allow only one, which the report then explains. */
function addModes(collection: VariableCollection, names: string[]): Record<string, string> {
  const ids: Record<string, string> = {};
  collection.renameMode(collection.modes[0]!.modeId, names[0]!);
  ids[names[0]!] = collection.modes[0]!.modeId;
  for (const name of names.slice(1)) {
    try {
      ids[name] = collection.addMode(name);
    } catch {
      problems.push(`${collection.name} has only ${names[0]}: this file's plan allows one variable mode. Run the builder in a file on a Professional plan to get every brand and theme.`);
      break;
    }
  }
  return ids;
}

export function buildVariables(): Library {
  const primitives = figma.variables.createVariableCollection("Primitives");
  primitives.renameMode(primitives.modes[0]!.modeId, "Value");
  const primitiveVars = new Map<string, Variable>();
  for (const [ramp, steps] of Object.entries(ramps)) {
    for (const [stepName, hex] of Object.entries(steps)) {
      const v = figma.variables.createVariable(`color/${ramp}/${stepName}`, primitives, "COLOR");
      v.setValueForMode(primitives.modes[0]!.modeId, rgba(hex));
      // Primitives are not for direct use; hiding them keeps them out of the pickers.
      v.hiddenFromPublishing = true;
      v.scopes = [];
      primitiveVars.set(`color.${ramp}.${stepName}`, v);
    }
  }

  const collections = {
    Color: figma.variables.createVariableCollection("Color"),
    Dimension: figma.variables.createVariableCollection("Dimension"),
    Typography: figma.variables.createVariableCollection("Typography"),
    Layout: figma.variables.createVariableCollection("Layout"),
  } satisfies Record<CollectionName, VariableCollection>;
  const modeIds = addModes(collections.Color, modes.map((m) => m.name));
  const brands = [...new Set(modes.map((m) => brandOf(m.name)))];
  const brandModeIds = addModes(collections.Dimension, brands);
  collections.Typography.renameMode(collections.Typography.modes[0]!.modeId, "Value");
  collections.Layout.renameMode(collections.Layout.modes[0]!.modeId, "Value");

  const vars = new Map<string, Variable>();
  const types = new Map<string, VariableResolvedDataType>();
  const homes = new Map<string, CollectionName>();
  for (const [name, token] of Object.entries(light)) {
    const type = kind(name, token);
    if (!type) continue;
    const home = collectionFor(name, type);
    const v = figma.variables.createVariable(varName(name), collections[home], type);
    v.scopes = scopesFor(name, type);
    v.setVariableCodeSyntax("WEB", `var(${token.cssVar})`);
    if (token.description) v.description = token.description;
    vars.set(name, v);
    types.set(name, type);
    homes.set(name, home);
  }
  // Values in a second pass, so a token can alias any other token, in any collection.
  for (const [name, v] of vars) {
    const type = types.get(name)!;
    const home = homes.get(name)!;
    if (home === "Color") {
      for (const mode of modes.filter((m) => modeIds[m.name])) v.setValueForMode(modeIds[mode.name]!, valueFor(name, mode.tokens[name] ?? light[name]!, type, mode.tokens, vars, primitiveVars));
    } else if (home === "Dimension") {
      // Each brand's light file holds its dimensions; the dark theme never changes them.
      for (const brand of brands.filter((b) => brandModeIds[b])) {
        const tokens = modes.find((m) => brandOf(m.name) === brand)!.tokens;
        v.setValueForMode(brandModeIds[brand]!, valueFor(name, tokens[name] ?? light[name]!, type, tokens, vars, primitiveVars));
      }
    } else {
      v.setValueForMode(collections[home].modes[0]!.modeId, valueFor(name, light[name]!, type, light, vars, primitiveVars));
    }
  }
  return { collections, modeIds, brandModeIds, vars, primitives: primitiveVars };
}

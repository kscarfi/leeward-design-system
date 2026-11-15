// Creates two variable collections: Primitives (the color ramps) and Leeward (every semantic and
// component token, with four modes). Colors alias the primitive they come from, so designers see the link.
import { light, modes, ramps, type Token } from "./data.ts";
import { problems, px, rgba, varName } from "./util.ts";

export interface Library {
  collection: VariableCollection;
  modeIds: Record<string, string>;
  vars: Map<string, Variable>;
  primitives: Map<string, Variable>;
}

const scopesFor = (name: string, type: VariableResolvedDataType): VariableScope[] => {
  if (type === "COLOR") {
    if (name.startsWith("text.") || name.startsWith("amount.")) return ["TEXT_FILL"];
    if (name.startsWith("border.")) return ["STROKE_COLOR"];
    if (name.startsWith("icon.")) return ["SHAPE_FILL", "STROKE_COLOR"];
    return ["FRAME_FILL", "SHAPE_FILL"];
  }
  if (type === "STRING") return ["FONT_FAMILY"];
  if (name.startsWith("space.") || name.includes("gap") || name.includes("padding")) return ["GAP"];
  if (name.startsWith("radius.") || name.includes("radius")) return ["CORNER_RADIUS"];
  if (name.startsWith("type.") && name.endsWith(".size")) return ["FONT_SIZE"];
  if (name.startsWith("type.") && name.endsWith(".line-height")) return ["LINE_HEIGHT"];
  if (name.startsWith("type.") && name.endsWith(".weight")) return ["FONT_WEIGHT"];
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

  const collection = figma.variables.createVariableCollection("Leeward");
  const modeIds: Record<string, string> = {};
  collection.renameMode(collection.modes[0]!.modeId, modes[0]!.name);
  modeIds[modes[0]!.name] = collection.modes[0]!.modeId;
  for (const mode of modes.slice(1)) {
    try {
      modeIds[mode.name] = collection.addMode(mode.name);
    } catch {
      // Starter files allow one mode per collection. Build Leeward Light only and say so in the report.
      problems.push(`Only ${modes[0]!.name} was built: this file's plan allows one variable mode. Run the builder in a file on a Professional plan to get all four modes.`);
      break;
    }
  }

  const vars = new Map<string, Variable>();
  const types = new Map<string, VariableResolvedDataType>();
  for (const [name, token] of Object.entries(light)) {
    const type = kind(name, token);
    if (!type) continue;
    const v = figma.variables.createVariable(varName(name), collection, type);
    v.scopes = scopesFor(name, type);
    v.setVariableCodeSyntax("WEB", `var(${token.cssVar})`);
    if (token.description) v.description = token.description;
    vars.set(name, v);
    types.set(name, type);
  }
  // Values in a second pass, so a token can alias any other token in the collection.
  for (const [name, v] of vars) {
    const type = types.get(name)!;
    for (const mode of modes.filter((m) => modeIds[m.name])) {
      const t = mode.tokens[name] ?? light[name]!;
      v.setValueForMode(modeIds[mode.name]!, valueFor(name, t, type, mode.tokens, vars, primitiveVars));
    }
  }
  return { collection, modeIds, vars, primitives: primitiveVars };
}

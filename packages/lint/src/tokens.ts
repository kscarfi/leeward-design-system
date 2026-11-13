// The set of CSS custom properties components may use: semantic and component tokens only.
// Primitives never reach CSS, so anything else under --lw- is a typo or a primitive.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const light = require("@leeward/tokens/tokens.json") as Record<string, { cssVar: string; type?: string }>;

export const allowedVars = new Set(Object.values(light).map((t) => t.cssVar));

/** Primitive ramp names, used to give a better message when someone reaches for one. */
export const primitivePattern = /^--lw-(color-(white|ink|iris|coral|teal|danger|warning|deep)(-\d+)?|space-\d+(_\d+)?|radius-(\d+|full)|size-\d+|font-|duration-|easing-)/;

/** Suggest the closest allowed variable by shared prefix. */
export function suggest(name: string): string | undefined {
  let best: string | undefined;
  let bestScore = 0;
  for (const candidate of allowedVars) {
    let i = 0;
    while (i < name.length && i < candidate.length && name[i] === candidate[i]) i++;
    if (i > bestScore) {
      bestScore = i;
      best = candidate;
    }
  }
  return bestScore > 8 ? best : undefined;
}

export const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i;

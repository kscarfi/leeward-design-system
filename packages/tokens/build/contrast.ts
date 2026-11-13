// Contrast checks shared by the CI report, the partner theme generator and the browser demo.
import Color from "colorjs.io";
import { contrast, requiredPairs, type Pair } from "./semantic.ts";

export interface PairResult extends Pair {
  theme: string;
  fgHex: string;
  bgHex: string;
  wcag: number;
  apca: number;
  pass: boolean;
  apcaOk: boolean;
}

/** APCA guidance (Lc), informational only. WCAG 2.2 AA is the pass/fail bar. */
const apcaGuide = (min: number) => (min >= 4.5 ? 60 : 30);

/** Check every required pair. lookup maps a semantic name such as "text.default" to a CSS color. */
export function checkPairs(theme: string, lookup: (name: string) => string | undefined, pairs: Pair[] = requiredPairs()): PairResult[] {
  return pairs.flatMap((pair) => {
    const fgHex = lookup(pair.fg);
    const bgHex = lookup(pair.bg);
    if (!fgHex || !bgHex) return [];
    const wcag = contrast(fgHex, bgHex);
    const apca = Math.abs(new Color(bgHex).contrast(new Color(fgHex), "APCA"));
    return [{ ...pair, theme, fgHex, bgHex, wcag, apca, pass: wcag >= pair.min, apcaOk: apca >= apcaGuide(pair.min) }];
  });
}

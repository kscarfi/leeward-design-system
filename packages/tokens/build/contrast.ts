// Contrast checks shared by the CI report, the partner theme generator and the browser demo.
import Color from "colorjs.io";
import { requiredPairs, type ContrastPair } from "./themes.ts";

export const AA: Record<ContrastPair["kind"], number> = { text: 4.5, large: 3, ui: 3 };
// APCA guidance (Lc) for reference only. WCAG 2.2 AA is the pass/fail bar.
export const APCA_GUIDE: Record<ContrastPair["kind"], number> = { text: 60, large: 45, ui: 30 };

export interface PairResult extends ContrastPair {
  theme: string;
  fgHex: string;
  bgHex: string;
  wcag: number;
  apca: number;
  pass: boolean;
  apcaOk: boolean;
}

/** Composite a translucent color over its background before measuring. */
function opaque(fg: Color, bg: Color): Color {
  const a = fg.alpha ?? 1;
  if (a >= 1) return fg;
  const [r1, g1, b1] = fg.to("srgb").coords;
  const [r2, g2, b2] = bg.to("srgb").coords;
  return new Color("srgb", [r1! * a + r2! * (1 - a), g1! * a + g2! * (1 - a), b1! * a + b2! * (1 - a)]);
}

/** Check every required pair. lookup maps a semantic color name (without "color.") to a CSS color. */
export function checkPairs(theme: string, lookup: (name: string) => string, pairs: ContrastPair[] = requiredPairs): PairResult[] {
  return pairs.map((pair) => {
    const bg = new Color(lookup(pair.bg));
    const fg = opaque(new Color(lookup(pair.fg)), bg);
    const wcag = fg.contrast(bg, "WCAG21");
    const apca = Math.abs(bg.contrast(fg, "APCA"));
    return { ...pair, theme, fgHex: lookup(pair.fg), bgHex: lookup(pair.bg), wcag, apca, pass: wcag >= AA[pair.kind], apcaOk: apca >= APCA_GUIDE[pair.kind] };
  });
}

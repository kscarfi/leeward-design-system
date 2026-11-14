// Ramp generation in OKLCH for partner brands (scripts/generate-theme.ts).
//
// A ramp has steps 0 to 1000 like the primitive ramps. Each step is defined by its WCAG 2
// contrast against white. Hue stays constant; chroma tapers toward the light and dark ends
// and is clamped to the sRGB gamut. The seed is pinned exactly at the nearest step.
import Color from "colorjs.io";

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975, 1000] as const;
export type Step = (typeof STEPS)[number];

// Contrast against #FFFFFF per step: the median of the 19 vivid primitive ramps
// in Leeward's token source, so generated ramps share the shape of the hand-made ones. Step 0 is white.
export const CONTRAST_TARGETS: Record<Step, number> = {
  50: 1.09,
  100: 1.2,
  200: 1.39,
  300: 1.81,
  400: 2.65,
  500: 3.53,
  600: 4.69,
  700: 6.04,
  800: 8.02,
  900: 9.73,
  950: 11.31,
  975: 13.37,
  1000: 15.57,
};

const WHITE = new Color("#ffffff");

export interface RampSpec {
  /** One or more seed colors. Each is pinned to the step with the nearest contrast. */
  seeds: string[];
  /** Neutral ramps keep low chroma in the light half and let it grow toward the dark end. */
  neutral?: boolean;
  /**
   * Degrees to rotate hue at the darkest step. Warm hues read redder as they darken,
   * so amber needs a nudge toward yellow to stay amber in dark mode surfaces.
   */
  darkHueShift?: number;
}

export type Ramp = Record<string, string>;

interface Anchor {
  step: Step;
  l: number;
  c: number;
  h: number;
  hex: string;
}

function oklch(hex: string): { l: number; c: number; h: number } {
  const [l, c, h] = new Color(hex).to("oklch").coords;
  return { l: l ?? 0, c: c ?? 0, h: Number.isNaN(h) || h == null ? 0 : h };
}

function toHex(l: number, c: number, h: number): string {
  return new Color("oklch", [l, c, h]).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
}

export function contrastOnWhite(hex: string): number {
  return new Color(hex).contrast(WHITE, "WCAG21");
}

function nearestStep(ratio: number): Step {
  let best: Step = STEPS[0];
  let bestDistance = Infinity;
  for (const step of STEPS) {
    const distance = Math.abs(Math.log(ratio / CONTRAST_TARGETS[step]));
    if (distance < bestDistance) {
      best = step;
      bestDistance = distance;
    }
  }
  return best;
}

/** Chroma for a given lightness, shaped around the anchors. */
function chromaAt(l: number, anchors: Anchor[], neutral: boolean): number {
  const sorted = [...anchors].sort((a, b) => b.l - a.l);
  const lightest = sorted[0]!;
  const darkest = sorted[sorted.length - 1]!;
  if (neutral) {
    // Interpolate between anchors, easing so the light half stays close to gray.
    if (l >= lightest.l) return lightest.c;
    if (l <= darkest.l) return darkest.c;
    const t = (lightest.l - l) / (lightest.l - darkest.l);
    return lightest.c + (darkest.c - lightest.c) * t ** 2;
  }
  // Vivid ramps: full seed chroma between anchors, tapering toward white and black.
  if (l > lightest.l) {
    // Hold chroma through the mid tints so light steps stay colorful, then fall off near white.
    const t = (l - lightest.l) / (1 - lightest.l);
    return lightest.c * (1 - t ** 2) + 0.01 * t;
  }
  if (l < darkest.l) {
    const t = (darkest.l - l) / darkest.l;
    return darkest.c * (1 - 0.7 * t);
  }
  const t = (lightest.l - l) / Math.max(lightest.l - darkest.l, 1e-6);
  return lightest.c + (darkest.c - lightest.c) * t;
}

function hueAt(l: number, anchors: Anchor[], darkHueShift = 0): number {
  const sorted = [...anchors].sort((a, b) => b.l - a.l);
  const last = sorted[sorted.length - 1]!;
  if (l < last.l) return (last.h + darkHueShift * ((last.l - l) / last.l) + 360) % 360;
  if (sorted.length === 1 || l >= sorted[0]!.l) return sorted[0]!.h;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    if (l <= a.l && l >= b.l) {
      const t = (a.l - l) / (a.l - b.l);
      let dh = b.h - a.h;
      if (dh > 180) dh -= 360;
      if (dh < -180) dh += 360;
      return (a.h + dh * t + 360) % 360;
    }
  }
  return sorted[0]!.h;
}

/** Find the lightness that hits a contrast target, with chroma and hue following the ramp shape. */
function solveStep(target: number, anchors: Anchor[], neutral: boolean, darkHueShift = 0): string {
  let lo = 0;
  let hi = 1;
  let hex = "#000000";
  for (let i = 0; i < 40; i++) {
    const l = (lo + hi) / 2;
    hex = toHex(l, chromaAt(l, anchors, neutral), hueAt(l, anchors, darkHueShift));
    if (contrastOnWhite(hex) > target) lo = l;
    else hi = l;
  }
  return hex;
}

export function generateRamp(spec: RampSpec): Ramp {
  const anchors: Anchor[] = spec.seeds.map((seed) => {
    const hex = new Color(seed).to("srgb").toString({ format: "hex", collapse: false });
    return { ...oklch(hex), hex, step: nearestStep(contrastOnWhite(hex)) };
  });
  const pinned = new Map(anchors.map((a) => [a.step, a.hex]));
  if (pinned.size !== anchors.length) {
    throw new Error(`Two seeds map to the same step: ${spec.seeds.join(", ")}`);
  }
  const ramp: Ramp = { "0": "#ffffff" };
  for (const step of STEPS) {
    ramp[step] = pinned.get(step) ?? solveStep(CONTRAST_TARGETS[step], anchors, spec.neutral ?? false, spec.darkHueShift ?? 0);
  }
  return ramp;
}

/** Steps where a seed was pinned, for documentation. */
export function seedSteps(spec: RampSpec): Step[] {
  return spec.seeds.map((seed) => nearestStep(contrastOnWhite(seed)));
}


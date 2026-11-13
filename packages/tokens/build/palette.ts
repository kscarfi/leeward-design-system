// Ramp generation in OKLCH. Used by the token build and by scripts/generate-theme.ts.
//
// Each ramp has 11 steps. A step is defined by its WCAG 2 contrast against white,
// so every ramp shares one accessibility shape: step 500 is always the lightest
// step that passes AA as text on white and on the Mist canvas, step 400 always
// passes 3:1 for borders, and so on. Hue stays constant; chroma tapers toward the
// light and dark ends and is clamped to the sRGB gamut.
import Color from "colorjs.io";

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];

// Contrast against #FFFFFF per step. Chosen so that:
// 400 >= 3:1 on white and Mist (borders, icons, large text, WCAG 1.4.11)
// 500 >= 4.5:1 on white and Mist (body text, WCAG 1.4.3)
// 800 and darker carry light text at AAA.
export const CONTRAST_TARGETS: Record<Step, number> = {
  50: 1.06,
  100: 1.15,
  200: 1.35,
  300: 1.8,
  400: 3.3,
  500: 5.0,
  600: 6.6,
  700: 9.2,
  800: 12,
  900: 15,
  950: 17.4,
};

const WHITE = new Color("#ffffff");

export interface RampSpec {
  /** One or more seed colors. Each is pinned to the step with the nearest contrast. */
  seeds: string[];
  /** Neutral ramps keep low chroma in the light half and let it grow toward the dark end. */
  neutral?: boolean;
}

export type Ramp = Record<Step, string>;

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
    const t = (l - lightest.l) / (1 - lightest.l);
    return lightest.c * (1 - t) ** 0.85 + 0.01 * t;
  }
  if (l < darkest.l) {
    const t = (darkest.l - l) / darkest.l;
    return darkest.c * (1 - 0.7 * t);
  }
  const t = (lightest.l - l) / Math.max(lightest.l - darkest.l, 1e-6);
  return lightest.c + (darkest.c - lightest.c) * t;
}

function hueAt(l: number, anchors: Anchor[]): number {
  const sorted = [...anchors].sort((a, b) => b.l - a.l);
  if (sorted.length === 1 || l >= sorted[0]!.l) return sorted[0]!.h;
  const last = sorted[sorted.length - 1]!;
  if (l <= last.l) return last.h;
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
function solveStep(target: number, anchors: Anchor[], neutral: boolean): string {
  let lo = 0;
  let hi = 1;
  let hex = "#000000";
  for (let i = 0; i < 40; i++) {
    const l = (lo + hi) / 2;
    hex = toHex(l, chromaAt(l, anchors, neutral), hueAt(l, anchors));
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
  const ramp = {} as Ramp;
  for (const step of STEPS) {
    ramp[step] = pinned.get(step) ?? solveStep(CONTRAST_TARGETS[step], anchors, spec.neutral ?? false);
  }
  return ramp;
}

/** Steps where a seed was pinned, for documentation. */
export function seedSteps(spec: RampSpec): Step[] {
  return spec.seeds.map((seed) => nearestStep(contrastOnWhite(seed)));
}

/** Low-chroma dark surfaces for dark mode, tinted with the neutral hue. */
export function generateDeepRamp(hueSeed: string): Record<string, string> {
  const { h } = oklch(hueSeed);
  // OKLCH lightness per step. Lighter steps sit higher in the elevation stack.
  const levels: Record<string, [number, number]> = {
    "950": [0.19, 0.024],
    "900": [0.225, 0.028],
    "850": [0.255, 0.03],
    "800": [0.29, 0.032],
    "700": [0.37, 0.034],
  };
  return Object.fromEntries(Object.entries(levels).map(([step, [l, c]]) => [step, toHex(l, c, h)]));
}

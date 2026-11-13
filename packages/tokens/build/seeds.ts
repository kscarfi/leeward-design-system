// Leeward seed palette from PROJECT_BRIEF.md, section 2.
import type { RampSpec } from "./palette.ts";

export const leewardRamps: Record<string, RampSpec> = {
  ink: { seeds: ["#F6F6FB", "#16163A"], neutral: true },
  iris: { seeds: ["#4C3FE0"] },
  coral: { seeds: ["#FF7A59", "#C2410C"] },
  teal: { seeds: ["#08745D"] },
  danger: { seeds: ["#C8283E"] },
  warning: { seeds: ["#B45309"], darkHueShift: 22 },
};

/** Hues for dark mode feedback surfaces. Warning is nudged toward amber. */
export const darkTintSeeds = { info: "#4C3FE0", success: "#08745D", warning: "#B45309", danger: "#C8283E" };
export const darkTintShift = { warning: 25 };

/** Hue source for dark mode surfaces. */
export const deepSeed = "#16163A";

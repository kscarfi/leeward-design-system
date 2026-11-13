// Leeward seed palette from PROJECT_BRIEF.md, section 2.
import type { RampSpec } from "./palette.ts";

export const leewardRamps: Record<string, RampSpec> = {
  ink: { seeds: ["#F6F6FB", "#16163A"], neutral: true },
  iris: { seeds: ["#4C3FE0"] },
  coral: { seeds: ["#FF7A59", "#C2410C"] },
  teal: { seeds: ["#08745D"] },
  danger: { seeds: ["#C8283E"] },
  warning: { seeds: ["#B45309"] },
};

/** Hue source for dark mode surfaces. */
export const deepSeed = "#16163A";

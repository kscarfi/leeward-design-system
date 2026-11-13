import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { generatePartnerTheme } from "./partner.ts";

const basePrimitives = JSON.parse(readFileSync(new URL("../src/primitive/color.json", import.meta.url), "utf8")).color;

// Deterministic pseudo-random seeds across the whole sRGB cube.
function seeds(count: number): string[] {
  let x = 20261113;
  const next = () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  return Array.from({ length: count }, () => "#" + [0, 0, 0].map(() => Math.floor(next() * 256).toString(16).padStart(2, "0")).join(""));
}

test("any seed produces a theme where every required pair passes AA", () => {
  const failing: string[] = [];
  for (const seed of seeds(200)) {
    const theme = generatePartnerTheme({ name: "t", seed, basePrimitives });
    if (theme.failures.length > 0) failing.push(`${seed}: ${theme.failures.map((f) => `${f.theme} ${f.fg}/${f.bg} ${f.wcag.toFixed(2)}`).join("; ")}`);
  }
  assert.deepEqual(failing, []);
});

test("pinning a light seed to buttons is refused", () => {
  const theme = generatePartnerTheme({ name: "sunny", seed: "#FFD000", pinAction: true, basePrimitives });
  assert.ok(theme.failures.length > 0);
  // Only the pinned roles fail: the rest of the mapping still holds.
  const pinned = (name: string) => name.startsWith("action.primary") || name === "control.bg-checked";
  assert.ok(theme.failures.every((f) => pinned(f.fg) || pinned(f.bg)));
});

test("the seed is kept exactly in the ramp", () => {
  const theme = generatePartnerTheme({ name: "harbor", seed: "#0E7490", basePrimitives });
  assert.ok(Object.values(theme.ramp).includes("#0e7490"));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { generatePartnerTheme, rampsFromPrimitives } from "./partner.ts";

const ramps = rampsFromPrimitives(JSON.parse(readFileSync(new URL("../src/primitive/color.json", import.meta.url), "utf8")));

// Deterministic pseudo-random seeds across the whole sRGB cube.
function seeds(count: number): string[] {
  let x = 20261113;
  const next = () => (x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  return Array.from({ length: count }, () => "#" + [0, 0, 0].map(() => Math.floor(next() * 256).toString(16).padStart(2, "0")).join(""));
}

test("any seed produces a brand where every required pair passes AA", () => {
  const failing: string[] = [];
  for (const seed of seeds(120)) {
    const theme = generatePartnerTheme({ name: "t", seed, ramps });
    if (theme.failures.length > 0) failing.push(`${seed}: ${theme.failures.map((f) => `${f.theme} ${f.fg}/${f.bg} ${f.wcag.toFixed(2)}`).join("; ")}`);
  }
  assert.deepEqual(failing, []);
});

test("pinning a light seed to buttons is refused", () => {
  const theme = generatePartnerTheme({ name: "sunny", seed: "#FFD000", pinAction: true, ramps });
  assert.ok(theme.failures.length > 0);
  assert.ok(theme.failures.every((f) => f.fg.includes("primary") || f.bg.includes("primary") || f.fg === "border.focus"));
});

test("the seed is kept exactly in the ramp", () => {
  const theme = generatePartnerTheme({ name: "harbor", seed: "#0E7490", ramps });
  assert.ok(Object.values(theme.ramp).includes("#0e7490"));
});

// Guards the compiled output against the source. Added after a transform bug made every
// referenced dimension 16 times too small while all other checks still passed.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const light = JSON.parse(readFileSync(new URL("../dist/ts/leeward.light.json", import.meta.url), "utf8")) as Record<string, { value: string; ref?: string }>;
const scale = JSON.parse(readFileSync(new URL("../src/primitive/scale.json", import.meta.url), "utf8"));

function primitivePx(ref: string): number | undefined {
  let node: any = scale;
  for (const key of ref.split(".")) node = node?.[key];
  const v = node?.$value;
  return v && typeof v === "object" && v.unit === "px" ? v.value : undefined;
}

const toPx = (css: string) => (css === "0" ? 0 : css.endsWith("rem") ? parseFloat(css) * 16 : css.endsWith("px") ? parseFloat(css) : NaN);

test("every referenced dimension compiles to the primitive's size", () => {
  let checked = 0;
  for (const [name, token] of Object.entries(light)) {
    if (!token.ref) continue;
    const expected = primitivePx(token.ref);
    if (expected === undefined) continue;
    assert.equal(toPx(token.value), expected, `${name} -> ${token.ref}`);
    checked++;
  }
  assert.ok(checked > 40, `only ${checked} dimensions checked`);
});

test("touch target is 44px and the default control height meets it", () => {
  assert.equal(toPx(light["size.touch-target"]!.value), 44);
  assert.equal(toPx(light["size.control.md"]!.value), 44);
});

test("no visible text role is under 12px", () => {
  for (const [name, token] of Object.entries(light)) {
    if (!name.startsWith("type.") || !name.endsWith(".size")) continue;
    const min = token.value.startsWith("clamp(") ? parseFloat(token.value.slice(6)) * 16 : toPx(token.value);
    assert.ok(min >= 12, `${name} is ${min}px`);
  }
});

test("control heights strictly increase and radii never shrink, in every brand", () => {
  for (const brand of ["leeward", "business"]) {
    const t = JSON.parse(readFileSync(new URL(`../dist/ts/${brand}.light.json`, import.meta.url), "utf8")) as Record<string, { value: string }>;
    const sizes = ["xs", "sm", "md", "lg", "xl"];
    const heights = sizes.map((s) => toPx(t[`control.height.${s}`]!.value));
    const radii = sizes.map((s) => toPx(t[`control.radius.${s}`]!.value));
    for (let i = 1; i < sizes.length; i++) {
      assert.ok(heights[i]! > heights[i - 1]!, `${brand}: control.height.${sizes[i]} (${heights[i]}) must be larger than ${sizes[i - 1]} (${heights[i - 1]})`);
      assert.ok(radii[i]! >= radii[i - 1]!, `${brand}: control.radius.${sizes[i]} must not be smaller than ${sizes[i - 1]}`);
    }
  }
});

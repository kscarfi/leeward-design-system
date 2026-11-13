// Guards the compiled output against the source. Added after a transform bug made every
// referenced dimension 16 times too small while all other checks still passed.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const light = JSON.parse(readFileSync(new URL("../dist/ts/light.json", import.meta.url), "utf8")) as Record<string, { value: string; type?: string; ref?: string }>;
const read = (file: string) => JSON.parse(readFileSync(new URL(`../src/primitive/${file}`, import.meta.url), "utf8"));
const primitives = { ...read("space.json"), ...read("radius.json"), ...read("size.json"), ...read("font.json") };

function primitivePx(ref: string): number | undefined {
  let node: any = primitives;
  for (const key of ref.split(".")) node = node?.[key];
  const value = node?.$value;
  return value && typeof value === "object" && value.unit === "px" ? value.value : undefined;
}

function toPx(css: string): number {
  if (css === "0") return 0;
  const n = parseFloat(css);
  if (css.endsWith("rem")) return n * 16;
  if (css.endsWith("px")) return n;
  throw new Error(`Unexpected unit in ${css}`);
}

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

test("touch target is 44px", () => {
  assert.equal(toPx(light["size.touch-target"]!.value), 44);
});

test("body text is 16px and captions are at least 12px", () => {
  assert.equal(toPx(light["type.body.md.size"]!.value), 16);
  assert.ok(toPx(light["type.caption.size"]!.value) >= 12);
});

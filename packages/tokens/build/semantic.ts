// Semantic colors per brand and mode.
//
// 1. Start from the semantic template (436 semantic colors) expressed as role + step.
// 2. Swap in the brand's ramp for each role.
// 3. Dark mode mirrors the step (600 becomes 400, 50 becomes 975) so the same structure holds.
// 4. A contrast resolver checks every required pair and moves the failing token one ramp
//    step at a time toward more contrast, until WCAG 2.2 AA passes. Every move is reported.
import Color from "colorjs.io";
import { ROLES, sourceRoles, type Brand, type Role } from "./brands.ts";
import type { Ramp, TemplateEntry } from "./source.ts";

export type Mode = "light" | "dark";

export interface ResolvedToken {
  name: string;
  ramp: string;
  step: string;
  alpha?: number;
  hex: string;
  /** Reference step before any change, for reporting. */
  from: string;
}

export interface Adjustment {
  token: string;
  ramp: string;
  from: string;
  to: string;
  reason: string;
}

const rampToRole = Object.fromEntries(Object.entries(sourceRoles).map(([role, ramp]) => [ramp, role])) as Record<string, Role>;
const FIXED_SWAP: Record<string, string> = { blackAlpha: "whiteAlpha", whiteAlpha: "blackAlpha", black: "white", white: "black" };

const numeric = (ramp: Ramp) => Object.keys(ramp).map(Number).sort((a, b) => a - b);

function snap(ramp: Ramp, step: number): string {
  let best = numeric(ramp)[0]!;
  for (const s of numeric(ramp)) if (Math.abs(s - step) < Math.abs(best - step)) best = s;
  return String(best);
}

function withAlpha(hex: string, alpha?: number): string {
  if (alpha === undefined || alpha >= 1) return hex;
  return hex.slice(0, 7) + Math.round(alpha * 255).toString(16).padStart(2, "0");
}

/** Composite translucent colors over a background before measuring. */
export function contrast(fg: string, bg: string): number {
  const b = new Color(bg);
  const f = new Color(fg);
  const a = f.alpha ?? 1;
  if (a < 1) {
    const [r1, g1, b1] = f.to("srgb").coords;
    const [r2, g2, b2] = b.to("srgb").coords;
    return new Color("srgb", [r1! * a + r2! * (1 - a), g1! * a + g2! * (1 - a), b1! * a + b2! * (1 - a)]).contrast(b, "WCAG21");
  }
  return f.contrast(b, "WCAG21");
}

export interface Pair {
  fg: string;
  bg: string;
  min: number;
  /** Which side the resolver may move. */
  adjust: "fg" | "bg";
}

const surfaces = ["fill.surface.canvas", "fill.surface.default", "fill.surface.raised", "fill.surface.overlay"];
const tintedSurfaces = ["fill.surface.emphasis", "fill.surface.bold"];

/** Every pair that must pass AA. Shared by the resolver, the contrast report and CI. */
export function requiredPairs(): Pair[] {
  const pairs: Pair[] = [];
  const on = (fgs: string[], bgs: string[], min: number, adjust: Pair["adjust"] = "fg") => fgs.forEach((fg) => bgs.forEach((bg) => pairs.push({ fg, bg, min, adjust })));

  on(["text.default", "text.muted", "text.subtle", "text.placeholder"], [...surfaces, ...tintedSurfaces], 4.5);
  on(["text.subtler"], surfaces, 3);
  on(["icon.default", "icon.muted", "icon.subtle"], [...surfaces, ...tintedSurfaces], 3);
  on(["text.link-default", "text.link-hover", "text.link-visited"], surfaces, 4.5);
  on(["border.default", "border.strong", "border.stronger", "border.focus"], [...surfaces, ...tintedSurfaces], 3);
  on(["text.inverse", "icon.inverse"], ["fill.neutral.default", "fill.neutral.emphasis", "fill.neutral.strong"], 4.5);

  for (const r of ROLES) {
    const text = r === "neutral" ? ["text.neutral", "text.neutral-emphasis", "text.neutral-strong"] : [`text.${r}`, `text.${r}-emphasis`, `text.${r}-strong`];
    if (r !== "attention") on(text, surfaces, 4.5);
    if (r !== "attention") on([`icon.${r}`, `border.${r}`], surfaces, 3);
    on([`text.${r}-on-subtle`, `icon.${r}-on-subtle`], [`fill.${r}.subtlest`, `fill.${r}.weak`], 4.5);
    on([`text.${r}-on-${r}`, `fill.${r}.on-default`], [`fill.${r}.default`, `fill.${r}.emphasis`, `fill.${r}.strong`], 4.5, "bg");
  }
  on(["amount.incoming", "amount.outgoing", "amount.pending"], [...surfaces, ...tintedSurfaces], 4.5);
  on(["fill.control.track"], surfaces, 3);
  on(["fill.primary.default"], surfaces, 3);
  return pairs;
}

/** Extra Leeward tokens on top of the semantic structure, as references to the template or brand ramps. */
/** Extras whose steps are already chosen per mode, so dark mode must not mirror them. */
const MODE_SPECIFIC = new Set(["fill.surface.canvas", "fill.surface.default", "fill.surface.raised", "fill.surface.overlay", "fill.control.thumb", "fill.overlay.scrim"]);

function extras(brand: Brand, mode: Mode): Record<string, TemplateEntry & { role?: string }> {
  const L = mode === "light";
  return {
    // Reference fix: white on yellow is 1.5:1. Attention fills carry dark text, like text.attention-on-attention.
    "fill.attention.on-default": { kind: "ramp", ramp: sourceRoles.attention, step: "1000" },
    "border.focus": { kind: "ramp", ramp: sourceRoles.primary, step: "600" },
    // Leeward surface stack. Light: a soft canvas with white cards. Dark: surfaces get lighter as they rise.
    "fill.surface.canvas": { kind: "ramp", ramp: sourceRoles.neutral, step: L ? "40" : "1000" },
    "fill.surface.default": { kind: "ramp", ramp: sourceRoles.neutral, step: L ? "0" : "975" },
    "fill.surface.raised": { kind: "ramp", ramp: sourceRoles.neutral, step: L ? "0" : "950" },
    "fill.surface.overlay": { kind: "ramp", ramp: sourceRoles.neutral, step: L ? "0" : "900" },
    "fill.control.track": { kind: "ramp", ramp: sourceRoles.neutral, step: "400" },
    "fill.control.thumb": { kind: "ramp", ramp: sourceRoles.neutral, step: L ? "0" : "50" },
    "amount.incoming": { kind: "ramp", ramp: sourceRoles.success, step: "700" },
    "amount.outgoing": { kind: "ref", target: "text.default" },
    "amount.pending": { kind: "ramp", ramp: sourceRoles.warning, step: "700" },
    "fill.overlay.scrim": { kind: "ramp", ramp: "blackAlpha", step: L ? "500" : "700" },
    "fill.skeleton.base": { kind: "ref", target: "fill.surface.bolder" },
    "fill.skeleton.highlight": { kind: "ref", target: "fill.surface.raised" },
    "fill.accent.default": { kind: "ramp", ramp: `accent:${brand.accent}`, step: "400" },
    "fill.accent.subtle": { kind: "ramp", ramp: `accent:${brand.accent}`, step: "100" },
  };
}

/** template: the semantic template (sourceSemantic() in Node, dist/semantic-template.json in the browser). */
export function resolveSemantic(brand: Brand, mode: Mode, ramps: Record<string, Ramp>, semanticTemplateData: Record<string, TemplateEntry>) {
  const template = { ...semanticTemplateData, ...extras(brand, mode) } as Record<string, TemplateEntry>;

  // Refs become copies of their target, so every token can be resolved and adjusted on its own.
  const concrete = (name: string, seen = new Set<string>()): Extract<TemplateEntry, { kind: "ramp" }> => {
    const entry = template[name];
    if (!entry) throw new Error(`Unknown semantic token ${name}`);
    if (entry.kind === "ramp") return entry;
    if (seen.has(name)) throw new Error(`Reference cycle at ${name}`);
    return concrete(entry.target, new Set([...seen, name]));
  };

  const tokens: Record<string, ResolvedToken> = {};
  for (const name of Object.keys(template)) {
    const e = concrete(name);
    let ramp: string;
    if (e.ramp.startsWith("accent:")) ramp = e.ramp.slice(7);
    else if (e.ramp === "violet") ramp = brand.visited;
    else if (rampToRole[e.ramp]) ramp = brand.roles[rampToRole[e.ramp]!];
    else ramp = e.ramp;
    if (mode === "dark" && FIXED_SWAP[ramp] && !MODE_SPECIFIC.has(name)) ramp = FIXED_SWAP[ramp]!;
    const r = ramps[ramp];
    if (!r) throw new Error(`Unknown ramp ${ramp} for ${name}`);
    const base = Number(e.step);
    const mirrored = mode === "dark" && !ramp.endsWith("Alpha") && !FIXED_SWAP[e.ramp] && !MODE_SPECIFIC.has(name);
    const target = mirrored ? 1000 - base : base;
    const step = r[String(target)] ? String(target) : snap(r, target);
    tokens[name] = { name, ramp, step, from: step, hex: withAlpha(r[step]!, e.alpha), ...(e.alpha !== undefined ? { alpha: e.alpha } : {}) };
  }

  // Dark mode tinted fills: the mirrored dark end of a vivid ramp is loud and muddy, so soft role
  // surfaces are a low-ratio mix of the role color into the default dark surface instead.
  if (mode === "dark") {
    const surface = tokens["fill.surface.default"]!.hex;
    const mixes: Record<string, number> = { weak: 0.18, subtlest: 0.26, subtler: 0.36 };
    for (const role of ROLES) {
      const ramp = ramps[brand.roles[role]]!;
      for (const [level, ratio] of Object.entries(mixes)) {
        const name = `fill.${role}.${level}`;
        const t = tokens[name];
        if (!t) continue;
        const mixed = new Color(ramp["500"]!).mix(new Color(surface), 1 - ratio, { space: "oklab" }).to("srgb").toString({ format: "hex", collapse: false });
        tokens[name] = { ...t, hex: mixed, alpha: 1, step: `mix-${ratio}` };
      }
    }
  }

  // Contrast resolver.
  const adjustments: Adjustment[] = [];
  const pairs = requiredPairs().filter((p) => tokens[p.fg] && tokens[p.bg]);
  // A token never returns to a step it already left, so conflicting pairs cannot oscillate.
  const visited = new Map(Object.values(tokens).map((t) => [t.name, new Set([t.step])]));
  for (let pass = 0; pass < 12; pass++) {
    let changed = false;
    for (const pair of pairs) {
      const fg = tokens[pair.fg]!;
      const bg = tokens[pair.bg]!;
      if (contrast(fg.hex, bg.hex) >= pair.min) continue;
      const moving = pair.adjust === "fg" ? fg : bg;
      if (moving.step.startsWith("mix-")) continue;
      const other = pair.adjust === "fg" ? bg : fg;
      const r = ramps[moving.ramp]!;
      const steps = numeric(r).map(String);
      const i = steps.indexOf(moving.step);
      // Try one step in each direction and keep the one that raises contrast most.
      const options = ([steps[i - 1], steps[i + 1]].filter(Boolean) as string[]).filter((s) => !visited.get(moving.name)!.has(s));
      const scored = options.map((s) => {
        const hex = withAlpha(r[s]!, moving.alpha);
        return { s, hex, c: pair.adjust === "fg" ? contrast(hex, other.hex) : contrast(other.hex, hex) };
      });
      const best = scored.sort((a, b) => b.c - a.c)[0];
      const current = pair.adjust === "fg" ? contrast(moving.hex, other.hex) : contrast(other.hex, moving.hex);
      if (!best || best.c <= current) continue;
      adjustments.push({ token: moving.name, ramp: moving.ramp, from: moving.step, to: best.s, reason: `${pair.fg} on ${pair.bg} was ${current.toFixed(2)}:1, needs ${pair.min}:1` });
      visited.get(moving.name)!.add(best.s);
      moving.step = best.s;
      moving.hex = best.hex;
      changed = true;
    }
    if (!changed) break;
  }

  const failures = pairs.map((p) => ({ ...p, ratio: contrast(tokens[p.fg]!.hex, tokens[p.bg]!.hex) })).filter((p) => p.ratio < p.min);
  return { tokens, adjustments, failures, pairs };
}

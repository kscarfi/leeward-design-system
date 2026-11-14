// Primitives (from the token source) and the brand foundation: type roles, control sizes,
// spacing, radii and elevation. Colors live in semantic.ts.
import type { Brand } from "./brands.ts";
import { focusRings } from "./focus.ts";
import { sourceElevation, sourceRamps, sourceScales } from "./source.ts";

const px = (value: number) => ({ value, unit: "px" });
const ref = (path: string) => ({ $value: `{${path}}` });
const dim = (value: number) => ({ $value: px(value) });

/** Step names that are valid in CSS variable names: "1half" -> "1-5", "025" -> "0-25". */
function spaceKey(key: string): string {
  if (key === "025") return "0_25";
  if (key === "050") return "0_5";
  return key.replace("half", "_5");
}

export function primitiveFiles() {
  const ramps = sourceRamps();
  const scales = sourceScales();
  const color: Record<string, unknown> = { $type: "color", $description: "Generated from source/ramps.json. Do not edit by hand." };
  for (const [name, steps] of Object.entries(ramps)) color[name] = Object.fromEntries(Object.entries(steps).map(([s, hex]) => [s, { $value: hex }]));

  const space: Record<string, unknown> = { $type: "dimension" };
  for (const [k, v] of Object.entries(scales.spacing)) space[spaceKey(k)] = dim(v);

  const sizer: Record<string, unknown> = { $type: "dimension" };
  for (const [k, v] of Object.entries(scales.sizer)) sizer[k] = dim(v);

  const radius: Record<string, unknown> = { $type: "dimension" };
  for (const [k, v] of Object.entries(scales.radii)) radius[k] = dim(v);

  const borderWidth: Record<string, unknown> = { $type: "dimension" };
  for (const [k, v] of Object.entries(scales.borderWidth)) borderWidth[k] = dim(v);

  // Type scale: the major second scale. 10 and 11 px are dropped: Leeward's minimum is 12 px.
  const fontSize: Record<string, unknown> = { $type: "dimension" };
  for (const [k, v] of Object.entries(scales.typescale)) if (v >= 12) fontSize[k] = dim(v);

  return {
    "color.json": { color },
    "scale.json": {
      space,
      sizer,
      // "radii" like the source, so it never collides with the semantic "radius" group.
      radii: radius,
      "border-width": borderWidth,
      "font-size": fontSize,
      "font-weight": { $type: "fontWeight", regular: { $value: 400 }, medium: { $value: 500 }, semibold: { $value: 600 }, bold: { $value: 700 }, extrabold: { $value: 800 } },
    },
    "motion.json": {
      duration: { $type: "duration", 100: { $value: { value: 100, unit: "ms" } }, 150: { $value: { value: 150, unit: "ms" } }, 200: { $value: { value: 200, unit: "ms" } }, 300: { $value: { value: 300, unit: "ms" } }, 400: { $value: { value: 400, unit: "ms" } } },
      easing: { $type: "cubicBezier", standard: { $value: [0.2, 0, 0, 1] }, decelerate: { $value: [0, 0, 0, 1] }, accelerate: { $value: [0.3, 0, 1, 1] } },
    },
  };
}

/** Responsive size between 360 px and 1280 px viewports, as a CSS clamp(). */
function fluid(min: number, max: number): string {
  if (min === max) return `${min / 16}rem`;
  const slope = (max - min) / (1280 - 360);
  const intercept = min - slope * 360;
  return `clamp(${min / 16}rem, ${(intercept / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${max / 16}rem)`;
}

const lh = (size: number, ratio: number) => Math.max(16, Math.round((size * ratio) / 4) * 4);

interface Role {
  size: number;
  /** Size at 360 px viewports, for fluid display and title roles. */
  mobile?: number;
  weight: "regular" | "medium" | "semibold" | "bold" | "extrabold";
  ratio: number;
  tracking: number;
  family?: "display" | "body" | "mono";
  tabular?: boolean;
}

// Type roles, following Leeward's text styles (sizes from its major second scale),
// with weights fixed (the export had Medium and SemiBold at 400) and line heights on the 4 px grid.
const TYPE: Record<string, Role> = {
  "display.lg": { size: 58, mobile: 40, weight: "extrabold", ratio: 1.1, tracking: -0.03, family: "display" },
  "display.md": { size: 51, mobile: 36, weight: "extrabold", ratio: 1.1, tracking: -0.03, family: "display" },
  "title.xl": { size: 40, mobile: 32, weight: "bold", ratio: 1.2, tracking: -0.02, family: "display" },
  "title.lg": { size: 36, mobile: 28, weight: "bold", ratio: 1.2, tracking: -0.02, family: "display" },
  "title.md": { size: 32, mobile: 25, weight: "bold", ratio: 1.25, tracking: -0.02, family: "display" },
  "title.sm": { size: 28, mobile: 22, weight: "bold", ratio: 1.25, tracking: -0.015, family: "display" },
  "title.xs": { size: 25, mobile: 20, weight: "bold", ratio: 1.3, tracking: -0.01, family: "display" },
  "subtitle.lg": { size: 25, mobile: 20, weight: "medium", ratio: 1.3, tracking: -0.01 },
  "subtitle.md": { size: 22, mobile: 18, weight: "medium", ratio: 1.3, tracking: -0.01 },
  "subtitle.sm": { size: 20, weight: "medium", ratio: 1.4, tracking: -0.005 },
  "heading.h1": { size: 28, mobile: 25, weight: "bold", ratio: 1.25, tracking: -0.015, family: "display" },
  "heading.h2": { size: 25, mobile: 22, weight: "bold", ratio: 1.3, tracking: -0.01, family: "display" },
  "heading.h3": { size: 22, mobile: 20, weight: "bold", ratio: 1.3, tracking: -0.01, family: "display" },
  "heading.h4": { size: 18, weight: "bold", ratio: 1.35, tracking: -0.005, family: "display" },
  "heading.h5": { size: 16, weight: "bold", ratio: 1.5, tracking: 0, family: "display" },
  "heading.h6": { size: 14, weight: "bold", ratio: 1.45, tracking: 0, family: "display" },
  "body.lg": { size: 18, weight: "regular", ratio: 1.55, tracking: 0 },
  "body.md": { size: 16, weight: "regular", ratio: 1.5, tracking: 0 },
  "body.sm": { size: 14, weight: "regular", ratio: 1.45, tracking: 0 },
  "label.lg": { size: 18, weight: "semibold", ratio: 1.35, tracking: 0 },
  "label.md": { size: 16, weight: "semibold", ratio: 1.25, tracking: 0 },
  "label.sm": { size: 14, weight: "semibold", ratio: 1.3, tracking: 0 },
  "label.xs": { size: 12, weight: "semibold", ratio: 1.35, tracking: 0.01 },
  caption: { size: 12, weight: "medium", ratio: 1.35, tracking: 0.01 },
  badge: { size: 12, weight: "bold", ratio: 1.35, tracking: 0.02 },
  "button.lg": { size: 18, weight: "bold", ratio: 1.35, tracking: 0 },
  "button.md": { size: 16, weight: "bold", ratio: 1.25, tracking: 0 },
  "button.sm": { size: 14, weight: "bold", ratio: 1.3, tracking: 0 },
  "button.xs": { size: 12, weight: "bold", ratio: 1.35, tracking: 0.01 },
  "amount.xl": { size: 51, mobile: 36, weight: "extrabold", ratio: 1.1, tracking: -0.03, family: "display", tabular: true },
  "amount.lg": { size: 36, mobile: 28, weight: "bold", ratio: 1.2, tracking: -0.02, family: "display", tabular: true },
  "amount.md": { size: 20, weight: "bold", ratio: 1.4, tracking: -0.005, tabular: true },
  "amount.sm": { size: 16, weight: "semibold", ratio: 1.5, tracking: 0, tabular: true },
  code: { size: 14, weight: "medium", ratio: 1.45, tracking: 0, family: "mono" },
};

const RADIUS_STEPS = [0, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32];
const radiusRef = (value: number) => {
  const names: Record<number, string> = { 0: "none", 4: "xSmall", 6: "small", 8: "default", 10: "large", 12: "xLarge", 16: "2xLarge", 20: "3xLarge", 24: "4xLarge", 28: "5xLarge", 32: "6xLarge" };
  const nearest = RADIUS_STEPS.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
  return ref(`radii.${names[nearest]}`);
};

/** Non-color semantic tokens for a brand. */
export function foundation(brand: Brand) {
  const r = brand.roundness;
  const compact = brand.density === "compact";
  const type: Record<string, unknown> = { $description: "Type roles. Display and title roles are fluid between 360 and 1280 px viewports." };
  for (const [role, t] of Object.entries(TYPE)) {
    const [group, size] = role.includes(".") ? role.split(".") : [role, undefined];
    const target = (size ? ((type[group!] ??= {}) as Record<string, unknown>) : type) as Record<string, unknown>;
    const lineMax = lh(t.size, t.ratio);
    const lineMin = lh(t.mobile ?? t.size, t.ratio);
    target[size ?? group!] = {
      family: { $type: "fontFamily", $value: brand.font[t.family ?? "body"] },
      size: { $type: "string", $value: fluid(t.mobile ?? t.size, t.size) },
      "line-height": { $type: "string", $value: fluid(lineMin, lineMax) },
      weight: ref(`font-weight.${t.weight}`),
      tracking: { $type: "string", $value: t.tracking === 0 ? "0" : `${t.tracking}em` },
      ...(t.tabular ? { numeric: { $type: "string", $value: "tabular-nums" } } : {}),
    };
  }

  // Control heights. Comfortable: xs 32, sm 36, md 44, lg 48, xl 56. Compact moves one step down.
  const heights = compact ? { xs: "3xSmall", sm: "3xSmall", md: "xSmall", lg: "small", xl: "default" } : { xs: "3xSmall", sm: "2xSmall", md: "small", lg: "default", xl: "large" };
  const padX = compact ? { xs: "2", sm: "3", md: "3", lg: "4", xl: "5" } : { xs: "2", sm: "3", md: "4", lg: "5", xl: "6" };

  return {
    space: {
      $type: "dimension",
      $description: "Layout spacing. 4 px grid, from Leeward's spacing scale.",
      none: ref("space.0"), px: ref("space.0_25"), "3xs": ref("space.0_5"), "2xs": ref("space.1"), "xs-tight": ref("space.1_5"), xs: ref("space.2"), "sm-tight": ref("space.2_5"),
      sm: ref("space.3"), md: ref("space.4"), "md-loose": ref("space.5"), lg: ref("space.6"), xl: ref("space.8"), "2xl": ref("space.12"), "3xl": ref("space.16"), "4xl": ref("space.20"),
      control: Object.fromEntries(Object.entries(padX).map(([k, v]) => [k, ref(`space.${v}`)])),
    },
    size: {
      $type: "dimension",
      "touch-target": { ...ref("sizer.small"), $description: "44 px. Minimum hit area for anything interactive on touch screens." },
      control: Object.fromEntries(Object.entries(heights).map(([k, v]) => [k, ref(`sizer.${v}`)])),
      icon: { xs: dim(12), sm: ref("sizer.6xSmall"), md: ref("sizer.5xSmall"), lg: ref("sizer.4xSmall"), xl: ref("sizer.3xSmall") },
      avatar: { xs: ref("sizer.4xSmall"), sm: ref("sizer.3xSmall"), md: ref("sizer.xSmall"), lg: ref("sizer.default"), xl: ref("sizer.2xLarge") },
      "focus-ring": { width: ref("border-width.thick"), offset: ref("border-width.thick"), halo: ref("border-width.thicker") },
      border: { default: ref("border-width.default"), strong: ref("border-width.thick") },
      dialog: { sm: dim(400), md: dim(520), lg: dim(720) },
      sheet: dim(560),
      "tooltip-max": dim(280),
      content: { sm: dim(480), md: dim(720), lg: dim(1120) },
    },
    radius: {
      $type: "dimension",
      none: ref("radii.none"), xs: ref("radii.xSmall"), sm: ref("radii.small"), md: ref("radii.default"), lg: ref("radii.xLarge"), xl: ref("radii.2xLarge"), "2xl": ref("radii.4xLarge"), pill: ref("radii.pill"),
      control: { ...radiusRef(10 * r), $description: "Buttons, inputs, selects" },
      "control-sm": radiusRef(8 * r),
      card: { ...radiusRef(16 * r), $description: "Cards, sheets" },
      dialog: radiusRef(24 * r),
      badge: ref("radii.pill"),
    },
    motion: {
      duration: { $type: "duration", instant: ref("duration.100"), fast: ref("duration.150"), base: ref("duration.200"), slow: ref("duration.300"), slower: ref("duration.400") },
      easing: { $type: "cubicBezier", standard: ref("easing.standard"), enter: ref("easing.decelerate"), exit: ref("easing.accelerate") },
    },
    layer: { $type: "number", base: { $value: 0 }, raised: { $value: 10 }, sticky: { $value: 100 }, overlay: { $value: 1000 }, toast: { $value: 1100 }, tooltip: { $value: 1200 } },
    breakpoint: { $type: "dimension", $description: "Reference only: CSS cannot read variables in media queries.", sm: dim(640), md: dim(768), lg: dim(1024), xl: dim(1280) },
    type,
  };
}

/** Elevation per mode. Dark mode keeps the light geometry with stronger shadows. */
export function elevation(mode: "light" | "dark") {
  const out: Record<string, unknown> = { $type: "shadow", $description: "Elevation 100 to 800 from Leeward's effect styles, and the focus rings." };
  for (const [name, f] of Object.entries(focusRings())) out[name] = { $type: "string", $value: f.value, $description: f.description };
  for (const [level, css] of Object.entries(sourceElevation())) {
    out[level] = { $type: "string", $value: mode === "light" ? css : css.replace(/rgba\(0, 0, 0, ([0-9.]+)\)/g, (_m, a) => `rgba(0, 0, 0, ${Math.min(0.6, Number(a) * 3).toFixed(2)})`) };
  }
  return { elevation: out };
}

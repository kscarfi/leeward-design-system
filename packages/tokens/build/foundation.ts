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
      // "radii" like in Figma, so it never collides with the semantic "radius" group.
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

// Type roles, following the Figma text styles (sizes from its major second scale),
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

const sizes = (prefix: string, keys: string[], target: (k: string) => string) => Object.fromEntries(keys.map((k) => [`${prefix}-${k}`, ref(target(k))]));

/**
 * Component tier: sizing and radius for every component, as references to the control scale and
 * the semantic tokens. Change a component's look here, without touching its CSS.
 */
function componentTokens() {
  const all = ["xs", "sm", "md", "lg", "xl"];
  const fields = ["sm", "md", "lg"];
  // Pill buttons take the next size's padding so the label clears the round ends.
  const pillPadding: Record<string, string> = { xs: "sm", sm: "md", md: "lg", lg: "xl", xl: "xl" };
  return {
    button: { $type: "dimension", ...sizes("height", all, (k) => `control.height.${k}`), ...sizes("radius", all, (k) => `control.radius.${k}`), ...sizes("padding-x", all, (k) => `control.padding-x.${k}`), ...sizes("gap", all, (k) => `control.gap.${k}`), "radius-pill": ref("radius.pill"), ...sizes("padding-x-pill", all, (k) => `control.padding-x.${pillPadding[k]}`) },
    "icon-button": { $type: "dimension", ...sizes("size", ["xs", "sm", "md", "lg"], (k) => `control.height.${k}`), radius: ref("radius.pill") },
    input: { $type: "dimension", $description: "TextField, Select, AmountInput and OTPInput boxes.", ...sizes("height", fields, (k) => `control.height.${k}`), ...sizes("radius", fields, (k) => `control.radius.${k}`), ...sizes("padding-x", fields, (k) => `control.padding-x.${k}`), "border-width": ref("size.border.default"), "border-width-invalid": ref("size.border.strong"), "radius-pill": ref("radius.pill"), ...sizes("padding-x-pill", fields, (k) => `control.padding-x.${pillPadding[k]}`) },
    textarea: { $type: "dimension", "min-height": ref("control.height.xl"), padding: ref("space.sm"), radius: ref("control.radius.md") },
    segmented: { $type: "dimension", ...sizes("height", fields, (k) => `control.height.${k}`), ...sizes("radius", fields, (k) => `control.radius.${k}`), inset: ref("space.3xs"), "radius-pill": ref("radius.pill"), ...sizes("item-radius", fields, (k) => `control.radius.${k === "sm" ? "xs" : k === "md" ? "sm" : "md"}`) },
    chip: { $type: "dimension", ...sizes("height", ["sm", "md"], (k) => `control.height.${k}`), ...sizes("padding-x", ["sm", "md"], (k) => `control.padding-x.${k}`), radius: ref("radius.pill") },
    badge: { $type: "dimension", "height-sm": ref("sizer.5xSmall"), "height-md": ref("sizer.4xSmall"), "padding-x-sm": ref("space.xs-tight"), "padding-x-md": ref("space.xs"), radius: ref("radius.pill") },
    checkbox: { $type: "dimension", size: ref("size.icon.md"), radius: ref("radii.small") },
    radio: { $type: "dimension", size: ref("size.icon.md"), "dot-size": ref("space.xs") },
    switch: { $type: "dimension", "track-width": ref("sizer.small"), "track-height": ref("sizer.4xSmall"), "thumb-size": ref("sizer.5xSmall"), inset: ref("space.3xs"), radius: ref("radius.pill") },
    avatar: { $type: "dimension", ...sizes("size", all, (k) => `size.avatar.${k}`), radius: ref("radius.pill") },
    card: { $type: "dimension", radius: ref("radius.card"), "padding-sm": ref("space.sm"), "padding-md": ref("space.md"), "padding-lg": ref("space.lg") },
    dialog: { $type: "dimension", radius: ref("radius.dialog"), padding: ref("space.lg"), "width-sm": ref("size.dialog.sm"), "width-md": ref("size.dialog.md"), "width-lg": ref("size.dialog.lg") },
    sheet: { $type: "dimension", radius: ref("radius.dialog"), padding: ref("space.lg"), width: ref("size.sheet") },
    tooltip: { $type: "dimension", radius: ref("radius.md"), "padding-x": ref("space.sm"), "padding-y": ref("space.xs"), "max-width": ref("size.tooltip-max") },
    toast: { $type: "dimension", radius: ref("radius.lg"), padding: ref("space.sm"), "max-width": ref("size.dialog.md") },
    alert: { $type: "dimension", radius: ref("radius.lg"), padding: ref("space.md") },
    menu: { $type: "dimension", radius: ref("radius.lg"), padding: ref("space.2xs"), "item-height": ref("size.touch-target"), "item-radius": ref("radius.md") },
    "list-item": { $type: "dimension", "min-height": ref("sizer.large"), "padding-x": ref("space.md"), "padding-y": ref("space.sm") },
    tabs: { $type: "dimension", height: ref("control.height.md"), "indicator-thickness": ref("size.border.strong") },
    accordion: { $type: "dimension", "trigger-height": ref("control.height.lg"), radius: ref("radius.card") },
    progress: { $type: "dimension", "height-sm": ref("space.2xs"), "height-md": ref("space.xs"), radius: ref("radius.pill") },
    skeleton: { $type: "dimension", "radius-text": ref("radius.xs"), "radius-rect": ref("radius.md") },
    stepper: { $type: "dimension", "marker-size": ref("size.icon.lg") },
    otp: { $type: "dimension", "box-size": ref("control.height.lg"), radius: ref("control.radius.lg") },
    "quick-action": { $type: "dimension", "icon-size": ref("size.avatar.lg"), radius: ref("radius.pill") },
    "empty-state": { $type: "dimension", "art-size": ref("size.avatar.xl") },
    spinner: { $type: "dimension", "size-sm": ref("size.icon.sm"), "size-md": ref("size.icon.md"), "size-lg": ref("size.icon.xl") },
    divider: { $type: "dimension", thickness: ref("size.border.default"), gap: ref("space.sm") },
    "summary-list": { $type: "dimension", "row-padding-y": ref("space.sm"), "column-gap": ref("space.md") },
    "payment-card": { $type: "dimension", radius: ref("radius.card"), padding: ref("space.lg"), "number-gap": ref("space.sm") },
    calendar: { $type: "dimension", "cell-size": ref("sizer.xSmall"), "cell-radius": ref("radius.pill"), gap: ref("space.3xs"), padding: ref("space.sm") },
    slider: { $type: "dimension", "track-height": ref("space.2xs"), "thumb-size": ref("sizer.5xSmall"), radius: ref("radius.pill") },
    "file-upload": { $type: "dimension", radius: ref("radius.card"), padding: ref("space.lg"), gap: ref("space.sm") },
    table: { $type: "dimension", "cell-padding-x": ref("space.md"), "cell-padding-y": ref("space.sm"), "header-height": ref("control.height.md"), radius: ref("radius.card") },
    pagination: { $type: "dimension", "item-size": ref("control.height.sm"), radius: ref("control.radius.sm"), gap: ref("space.2xs") },
    breadcrumbs: { $type: "dimension", gap: ref("space.2xs") },
    "navigation-bar": { $type: "dimension", height: ref("sizer.2xLarge"), "indicator-width": ref("sizer.large"), "indicator-height": ref("sizer.3xSmall"), "indicator-radius": ref("radius.pill") },
    "page-header": { $type: "dimension", height: ref("sizer.large"), "padding-x": ref("space.md"), gap: ref("space.sm") },
    banner: { $type: "dimension", "padding-x": ref("space.lg"), "padding-y": ref("space.sm"), gap: ref("space.sm") },
    popover: { $type: "dimension", radius: ref("radius.lg"), padding: ref("space.md"), "max-width": ref("size.content.sm") },
    "avatar-group": { $type: "dimension", "ring-width": ref("size.border.strong") },
    indicator: { $type: "dimension", "dot-size": ref("space.xs"), "count-height": ref("sizer.5xSmall"), "count-padding-x": ref("space.2xs"), radius: ref("radius.pill") },
    image: { $type: "dimension", radius: ref("radius.lg") },
    spending: { $type: "dimension", "bar-height": ref("space.sm"), "bar-radius": ref("radius.pill"), "bar-gap": ref("space.3xs"), "swatch-size": ref("space.sm"), "swatch-radius": ref("radius.xs") },
    // Not "icon": that group holds the icon colors.
    "icon-size": { $type: "dimension", ...Object.fromEntries(all.map((k) => [k, ref(`size.icon.${k}`)])) },
  };
}

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
  // Comfortable: 32, 36, 44, 48, 56. Compact: 28, 32, 40, 44, 48. Every step differs, so sizes keep their hierarchy.
  const heights = compact ? { xs: null, sm: "3xSmall", md: "xSmall", lg: "small", xl: "default" } : { xs: "3xSmall", sm: "2xSmall", md: "small", lg: "default", xl: "large" };
  const padX = compact ? { xs: "2", sm: "3", md: "3", lg: "4", xl: "5" } : { xs: "2", sm: "3", md: "4", lg: "5", xl: "6" };

  return {
    space: {
      $type: "dimension",
      $description: "Layout spacing. 4 px grid, from the Figma spacing scale.",
      none: ref("space.0"), px: ref("space.0_25"), "3xs": ref("space.0_5"), "2xs": ref("space.1"), "xs-tight": ref("space.1_5"), xs: ref("space.2"), "sm-tight": ref("space.2_5"),
      sm: ref("space.3"), md: ref("space.4"), "md-loose": ref("space.5"), lg: ref("space.6"), xl: ref("space.8"), "2xl": ref("space.12"), "3xl": ref("space.16"), "4xl": ref("space.20"),
      control: Object.fromEntries(Object.entries(padX).map(([k, v]) => [k, ref(`space.${v}`)])),
    },
    size: {
      $type: "dimension",
      "touch-target": { ...ref("sizer.small"), $description: "44 px. Minimum hit area for anything interactive on touch screens." },
      control: Object.fromEntries(Object.entries(heights).map(([k, v]) => [k, v ? ref(`sizer.${v}`) : dim(28)])),
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
      control: { ...ref("control.radius.md"), $description: "Default control radius (md). Size-specific radii live in control.radius." },
      "control-sm": ref("control.radius.sm"),
      card: { ...radiusRef(16 * r), $description: "Cards, sheets" },
      dialog: radiusRef(24 * r),
      badge: ref("radii.pill"),
    },
    motion: {
      duration: { $type: "duration", instant: ref("duration.100"), fast: ref("duration.150"), base: ref("duration.200"), slow: ref("duration.300"), slower: ref("duration.400") },
      easing: { $type: "cubicBezier", standard: ref("easing.standard"), enter: ref("easing.decelerate"), exit: ref("easing.accelerate") },
    },
    control: {
      $description: "The one control scale. Buttons, fields, selects and segmented controls of the same size share height, radius and padding, so they line up side by side.",
      height: { $type: "dimension", xs: ref("size.control.xs"), sm: ref("size.control.sm"), md: ref("size.control.md"), lg: ref("size.control.lg"), xl: ref("size.control.xl") },
      radius: { $type: "dimension", xs: radiusRef(6 * r), sm: radiusRef(8 * r), md: radiusRef(10 * r), lg: radiusRef(12 * r), xl: radiusRef(12 * r) },
      "padding-x": { $type: "dimension", xs: ref("space.control.xs"), sm: ref("space.control.sm"), md: ref("space.control.md"), lg: ref("space.control.lg"), xl: ref("space.control.xl") },
      gap: { $type: "dimension", xs: ref("space.2xs"), sm: ref("space.xs-tight"), md: ref("space.xs"), lg: ref("space.xs"), xl: ref("space.xs") },
    },
    ...componentTokens(),
    layer: { $type: "number", base: { $value: 0 }, raised: { $value: 10 }, sticky: { $value: 100 }, overlay: { $value: 1000 }, toast: { $value: 1100 }, tooltip: { $value: 1200 } },
    breakpoint: { $type: "dimension", $description: "Reference only: CSS cannot read variables in media queries.", sm: dim(640), md: dim(768), lg: dim(1024), xl: dim(1280) },
    // Column grid per screen size: phones (under sm), tablets (sm to lg) and desktops (lg and up).
    grid: {
      $description: "Column grid. Phones use 4 columns, tablets 8, desktops 12. Gutters and page margins come from the spacing scale.",
      columns: { $type: "number", phone: { $value: 4 }, tablet: { $value: 8 }, desktop: { $value: 12 } },
      gutter: { $type: "dimension", phone: ref("space.md"), tablet: ref("space.lg"), desktop: ref("space.lg") },
      margin: { $type: "dimension", phone: ref("space.md"), tablet: ref("space.xl"), desktop: ref("space.2xl") },
    },
    type,
  };
}

/** Elevation per mode. Dark mode keeps the same geometry with stronger shadows. */
export function elevation(mode: "light" | "dark") {
  const out: Record<string, unknown> = { $type: "shadow", $description: "Elevation 100 to 800 from the Figma effect styles, and the focus rings." };
  for (const [name, f] of Object.entries(focusRings())) out[name] = { $type: "string", $value: f.value, $description: f.description };
  for (const [level, css] of Object.entries(sourceElevation())) {
    out[level] = { $type: "string", $value: mode === "light" ? css : css.replace(/rgba\(0, 0, 0, ([0-9.]+)\)/g, (_m, a) => `rgba(0, 0, 0, ${Math.min(0.6, Number(a) * 3).toFixed(2)})`) };
  }
  return { elevation: out };
}

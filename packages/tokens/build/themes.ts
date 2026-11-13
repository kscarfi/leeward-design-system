// Semantic color and elevation tokens per theme, written as references to primitives.
// The brand ramp is a parameter so a partner theme can reuse the same mapping.

export type Mode = "light" | "dark";

export interface ThemeOptions {
  /** Primitive ramp used for actions, links and focus. */
  brand: string;
  /** Primitive ramp used for decorative warmth. */
  accent: string;
}

const r = (path: string) => ({ $value: `{color.${path}}` });

export function semanticColors(mode: Mode, { brand, accent }: ThemeOptions) {
  const L = mode === "light";
  const b = (step: number) => r(`${brand}.${step}`);
  const ink = (step: number) => r(`ink.${step}`);
  const deep = (step: number) => r(`deep.${step}`);

  return {
    color: {
      $type: "color",
      bg: {
        canvas: { ...(L ? ink(50) : deep(950)), $description: "App background behind all surfaces" },
      },
      surface: {
        default: L ? r("white") : deep(900),
        raised: { ...(L ? r("white") : deep(850)), $description: "Cards and menus. Pair with an elevation token." },
        overlay: { ...(L ? r("white") : deep(800)), $description: "Dialogs, popovers, toasts" },
        sunken: L ? ink(100) : deep(950),
        inverse: L ? ink(950) : ink(50),
        hover: L ? ink(100) : deep(800),
        pressed: L ? ink(200) : deep(700),
        brand: { ...(L ? b(50) : deep(800)), $description: "Tinted surface for selected or highlighted items" },
      },
      scrim: { $value: L ? "#16163a7a" : "#0000009e", $description: "Backdrop behind dialogs" },
      text: {
        primary: L ? ink(950) : ink(50),
        secondary: L ? ink(600) : ink(200),
        tertiary: { ...(L ? ink(500) : ink(300)), $description: "Hints, captions, placeholders. Still AA." },
        disabled: { ...(L ? ink(400) : ink(500)), $description: "Exempt from contrast rules. Never the only cue." },
        inverse: L ? ink(50) : ink(950),
        link: L ? b(600) : b(300),
        "link-hover": L ? b(700) : b(200),
        brand: L ? b(600) : b(300),
        accent: { ...(L ? r(`${accent}.500`) : r(`${accent}.300`)), $description: "Rare emphasis text in the accent hue" },
        success: L ? r("teal.500") : r("teal.300"),
        warning: L ? r("warning.500") : r("warning.300"),
        danger: L ? r("danger.500") : r("danger.300"),
      },
      icon: {
        primary: L ? ink(950) : ink(50),
        secondary: L ? ink(600) : ink(200),
        brand: L ? b(600) : b(300),
      },
      border: {
        subtle: { ...(L ? ink(200) : deep(700)), $description: "Dividers and card outlines. Decorative only." },
        default: { ...(L ? ink(400) : ink(400)), $description: "Input and control boundaries. At least 3:1." },
        strong: L ? ink(600) : ink(300),
        focus: { ...(L ? b(600) : b(300)), $description: "Focus ring. At least 3:1 against every surface." },
        brand: L ? b(600) : b(300),
        danger: L ? r("danger.500") : r("danger.300"),
      },
      action: {
        primary: {
          bg: L ? b(600) : b(300),
          "bg-hover": L ? b(700) : b(200),
          "bg-active": L ? b(800) : b(100),
          text: L ? r("white") : ink(950),
        },
        secondary: {
          bg: L ? b(50) : deep(800),
          "bg-hover": L ? b(100) : deep(700),
          "bg-active": L ? b(200) : deep(700),
          text: L ? b(700) : b(200),
          border: L ? b(200) : deep(700),
        },
        ghost: {
          "bg-hover": L ? b(50) : deep(800),
          "bg-active": L ? b(100) : deep(700),
          text: L ? b(600) : b(300),
        },
        danger: {
          bg: L ? r("danger.500") : r("danger.300"),
          "bg-hover": L ? r("danger.600") : r("danger.200"),
          "bg-active": L ? r("danger.700") : r("danger.100"),
          text: L ? r("white") : ink(950),
        },
        disabled: {
          bg: L ? ink(100) : deep(800),
          text: L ? ink(400) : ink(600),
        },
      },
      control: {
        bg: L ? r("white") : deep(900),
        "bg-checked": L ? b(600) : b(300),
        "fg-checked": L ? r("white") : ink(950),
        track: L ? ink(400) : ink(400),
        thumb: L ? r("white") : ink(50),
      },
      feedback: {
        info: { bg: L ? b(50) : deep(800), border: L ? b(200) : b(700), text: L ? b(700) : b(200), icon: L ? b(600) : b(300) },
        success: { bg: L ? r("teal.50") : r("teal.950"), border: L ? r("teal.200") : r("teal.800"), text: L ? r("teal.700") : r("teal.200"), icon: L ? r("teal.600") : r("teal.300") },
        warning: { bg: L ? r("warning.50") : r("warning.950"), border: L ? r("warning.200") : r("warning.800"), text: L ? r("warning.700") : r("warning.200"), icon: L ? r("warning.600") : r("warning.300") },
        danger: { bg: L ? r("danger.50") : r("danger.950"), border: L ? r("danger.200") : r("danger.800"), text: L ? r("danger.700") : r("danger.200"), icon: L ? r("danger.600") : r("danger.300") },
      },
      amount: {
        incoming: { ...(L ? r("teal.500") : r("teal.300")), $description: "Money in. Always with a plus sign." },
        outgoing: { ...(L ? ink(950) : ink(50)), $description: "Money out. Never red. Always with a minus sign." },
        pending: { ...(L ? r("warning.500") : r("warning.300")), $description: "Not settled yet. Always with a pending label." },
      },
      accent: {
        decorative: { ...(L ? r(`${accent}.400`) : r(`${accent}.400`)), $description: "Illustration and highlights only. Never text or the only signal of state." },
        "decorative-subtle": L ? r(`${accent}.100`) : r(`${accent}.950`),
      },
      skeleton: {
        base: L ? ink(100) : deep(800),
        highlight: L ? ink(50) : deep(700),
      },
    },
    shadow: {
      $type: "shadow",
      $description: "Three levels. In dark mode depth comes mostly from lighter surfaces.",
      1: { $value: [
        { color: L ? "#16163a0f" : "#00000052", offsetX: px(0), offsetY: px(1), blur: px(2), spread: px(0) },
        { color: L ? "#16163a0a" : "#00000033", offsetX: px(0), offsetY: px(1), blur: px(3), spread: px(0) },
      ] },
      2: { $value: [
        { color: L ? "#16163a14" : "#0000005c", offsetX: px(0), offsetY: px(4), blur: px(12), spread: px(-2) },
        { color: L ? "#16163a0a" : "#00000033", offsetX: px(0), offsetY: px(2), blur: px(4), spread: px(-1) },
      ] },
      3: { $value: [
        { color: L ? "#16163a1f" : "#0000007a", offsetX: px(0), offsetY: px(16), blur: px(32), spread: px(-8) },
        { color: L ? "#16163a0f" : "#00000040", offsetX: px(0), offsetY: px(4), blur: px(8), spread: px(-2) },
      ] },
    },
  };
}

function px(value: number) {
  return { value, unit: "px" };
}

/** Contrast pairs every theme must pass. Checked by scripts/contrast-report.ts and generate-theme.ts. */
export interface ContrastPair {
  fg: string;
  bg: string;
  /** "text" needs 4.5:1, "large" and "ui" need 3:1 (WCAG 2.2 1.4.3 and 1.4.11). */
  kind: "text" | "large" | "ui";
}

const surfaces = ["bg.canvas", "surface.default", "surface.raised", "surface.overlay"];
const pairsOn = (fgs: string[], bgs: string[], kind: ContrastPair["kind"]): ContrastPair[] =>
  fgs.flatMap((fg) => bgs.map((bg) => ({ fg, bg, kind })));

export const requiredPairs: ContrastPair[] = [
  ...pairsOn(
    ["text.primary", "text.secondary", "text.tertiary", "text.link", "text.brand", "text.success", "text.warning", "text.danger", "amount.incoming", "amount.outgoing", "amount.pending", "action.ghost.text"],
    surfaces,
    "text",
  ),
  ...pairsOn(["text.accent"], ["surface.default", "bg.canvas"], "text"),
  ...pairsOn(["border.default", "border.focus", "border.danger", "icon.secondary", "icon.brand", "control.track"], surfaces, "ui"),
  { fg: "text.inverse", bg: "surface.inverse", kind: "text" },
  { fg: "text.primary", bg: "surface.sunken", kind: "text" },
  { fg: "text.secondary", bg: "surface.sunken", kind: "text" },
  { fg: "text.primary", bg: "surface.brand", kind: "text" },
  { fg: "text.primary", bg: "surface.hover", kind: "text" },
  { fg: "action.primary.text", bg: "action.primary.bg", kind: "text" },
  { fg: "action.primary.text", bg: "action.primary.bg-hover", kind: "text" },
  { fg: "action.primary.text", bg: "action.primary.bg-active", kind: "text" },
  { fg: "action.secondary.text", bg: "action.secondary.bg", kind: "text" },
  { fg: "action.secondary.text", bg: "action.secondary.bg-hover", kind: "text" },
  { fg: "action.ghost.text", bg: "action.ghost.bg-hover", kind: "text" },
  { fg: "action.danger.text", bg: "action.danger.bg", kind: "text" },
  { fg: "action.danger.text", bg: "action.danger.bg-hover", kind: "text" },
  { fg: "control.fg-checked", bg: "control.bg-checked", kind: "ui" },
  ...pairsOn(["control.bg-checked"], surfaces, "ui"),
  ...["info", "success", "warning", "danger"].flatMap((tone): ContrastPair[] => [
    { fg: `feedback.${tone}.text`, bg: `feedback.${tone}.bg`, kind: "text" },
    { fg: "text.primary", bg: `feedback.${tone}.bg`, kind: "text" },
    { fg: `feedback.${tone}.icon`, bg: `feedback.${tone}.bg`, kind: "ui" },
  ]),
];

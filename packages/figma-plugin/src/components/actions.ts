// Button, IconButton, Link and Chip. Colors per variant and state mirror the CSS modules.
import { text } from "../dsl.ts";
import { icon } from "../icons.ts";
import { comp, variantSet } from "../kit.ts";

const SIZES = ["xs", "sm", "md", "lg", "xl"];
const STATES = ["default", "hover", "pressed", "focus", "disabled"];
const ICON_FOR: Record<string, string> = { xs: "icon-size.sm", sm: "icon-size.sm", md: "icon-size.md", lg: "icon-size.md", xl: "icon-size.lg" };
const TYPE_FOR: Record<string, string> = { xs: "button.xs", sm: "button.sm", md: "button.md", lg: "button.md", xl: "button.lg" };

interface Look { fill?: string; text: string; stroke?: string; shadow?: boolean }
const BUTTON: Record<string, Record<string, Look>> = {
  primary: { default: { fill: "fill.primary.default", text: "fill.primary.on-default", shadow: true }, hover: { fill: "fill.primary.emphasis", text: "fill.primary.on-default", shadow: true }, pressed: { fill: "fill.primary.strong", text: "fill.primary.on-default", shadow: true } },
  secondary: { default: { fill: "fill.primary.weak", text: "text.primary-on-subtle", stroke: "border.primary-subtler" }, hover: { fill: "fill.primary.subtlest", text: "text.primary-on-subtle", stroke: "border.primary-subtler" }, pressed: { fill: "fill.primary.subtler", text: "text.primary-on-subtle", stroke: "border.primary-subtler" } },
  outline: { default: { fill: "fill.surface.default", text: "text.default", stroke: "border.default" }, hover: { fill: "fill.surface.bold", text: "text.default", stroke: "border.default" }, pressed: { fill: "fill.surface.bolder", text: "text.default", stroke: "border.default" } },
  ghost: { default: { text: "text.primary" }, hover: { fill: "fill.primary.weak", text: "text.primary" }, pressed: { fill: "fill.primary.subtlest", text: "text.primary" } },
  danger: { default: { fill: "fill.danger.default", text: "fill.danger.on-default", shadow: true }, hover: { fill: "fill.danger.emphasis", text: "fill.danger.on-default", shadow: true }, pressed: { fill: "fill.danger.strong", text: "fill.danger.on-default", shadow: true } },
};

function look(table: Record<string, Record<string, Look>>, variant: string, state: string, disabled: Look): Look {
  if (state === "disabled") return disabled;
  return table[variant]![state === "focus" ? "default" : state]!;
}

export async function buildButton() {
  return variantSet(
    "Button",
    { variant: Object.keys(BUTTON), shape: ["rounded", "pill"], size: SIZES, state: STATES },
    async (p) => {
      const l = look(BUTTON, p.variant!, p.state!, { fill: "fill.disabled.default", text: "text.subtler" });
      const pill = p.shape === "pill";
      const c = await comp(
        {
          dir: "row",
          main: "center",
          cross: "center",
          gap: `button.gap-${p.size}`,
          px: pill ? `button.padding-x-pill-${p.size}` : `button.padding-x-${p.size}`,
          h: `button.height-${p.size}`,
          radius: pill ? "button.radius-pill" : `button.radius-${p.size}`,
          ...(l.fill ? { fill: l.fill } : {}),
          ...(l.stroke ? { stroke: l.stroke } : {}),
          ...(p.state === "focus" ? { effect: "focus" } : l.shadow ? { effect: "100" } : {}),
        },
        [],
      );
      const start = icon("send", ICON_FOR[p.size!], l.text);
      start.name = "?~Icon start";
      start.visible = false;
      const end = icon("arrow-right", ICON_FOR[p.size!], l.text);
      end.name = "?~Icon end";
      end.visible = false;
      c.appendChild(start);
      c.appendChild(await text("Send money", TYPE_FOR[p.size!]!, l.text, { name: "#Label" }));
      c.appendChild(end);
      return c;
    },
    { description: "Starts an action. One primary button per screen. Every size keeps a 44 px hit area in code." },
  );
}

const ICON_BUTTON: Record<string, Record<string, Look>> = {
  ghost: { default: { text: "icon.default" }, hover: { fill: "fill.surface.bold", text: "icon.default" }, pressed: { fill: "fill.surface.bolder", text: "icon.default" } },
  secondary: { default: { fill: "fill.primary.weak", text: "icon.primary-on-subtle", stroke: "border.primary-subtler" }, hover: { fill: "fill.primary.subtlest", text: "icon.primary-on-subtle", stroke: "border.primary-subtler" }, pressed: { fill: "fill.primary.subtler", text: "icon.primary-on-subtle", stroke: "border.primary-subtler" } },
  outline: { default: { fill: "fill.surface.default", text: "icon.default", stroke: "border.default" }, hover: { fill: "fill.surface.bold", text: "icon.default", stroke: "border.default" }, pressed: { fill: "fill.surface.bolder", text: "icon.default", stroke: "border.default" } },
  primary: { default: { fill: "fill.primary.default", text: "fill.primary.on-default" }, hover: { fill: "fill.primary.emphasis", text: "fill.primary.on-default" }, pressed: { fill: "fill.primary.strong", text: "fill.primary.on-default" } },
};

export async function buildIconButton() {
  const ICON_SIZE: Record<string, string> = { xs: "icon-size.sm", sm: "icon-size.md", md: "icon-size.md", lg: "icon-size.lg" };
  return variantSet(
    "IconButton",
    { variant: Object.keys(ICON_BUTTON), shape: ["pill", "rounded"], size: ["xs", "sm", "md", "lg"], state: STATES },
    async (p) => {
      const l = look(ICON_BUTTON, p.variant!, p.state!, { text: "icon.subtler" });
      const c = await comp({
        dir: "row",
        main: "center",
        cross: "center",
        w: `icon-button.size-${p.size}`,
        h: `icon-button.size-${p.size}`,
        radius: p.shape === "pill" ? "icon-button.radius" : `icon-button.radius-${p.size}`,
        ...(l.fill ? { fill: l.fill } : {}),
        ...(l.stroke ? { stroke: l.stroke } : {}),
        ...(p.state === "focus" ? { effect: "focus" } : {}),
      });
      const i = icon("settings", ICON_SIZE[p.size!], l.text);
      i.name = "~Icon";
      c.appendChild(i);
      return c;
    },
    { description: "An action shown only as an icon. Always give it a label in code; the label becomes the tooltip and the accessible name." },
  );
}

export async function buildLink() {
  return variantSet(
    "Link",
    { variant: ["inline", "standalone"], state: ["default", "hover", "visited", "focus"] },
    async (p) => {
      const color = p.state === "hover" ? "text.link-hover" : p.state === "visited" ? "text.link-visited" : "text.link-default";
      const inline = p.variant === "inline";
      const c = await comp({ dir: "row", cross: "center", gap: "space.3xs", radius: "radius.xs", ...(p.state === "focus" ? { effect: "focus" } : {}) });
      c.appendChild(await text(inline ? "See all fees" : "See all transactions", inline ? "body.md" : "label.md", color, { name: "#Label", underline: inline || p.state === "hover", weight: "SemiBold" }));
      if (!inline) {
        const end = icon("arrow-right", "icon-size.sm", color);
        end.name = "?Show arrow";
        c.appendChild(end);
      }
      return c;
    },
    { description: "Goes to another place. Inline links sit in a sentence and are underlined; standalone links stand on their own line." },
  );
}

export async function buildChip() {
  return variantSet(
    "Chip",
    { selected: ["false", "true"], size: ["sm", "md"], state: ["default", "hover", "focus", "disabled"] },
    async (p) => {
      const sel = p.selected === "true";
      const dis = p.state === "disabled";
      const color = dis ? "text.subtler" : sel ? "text.primary" : "text.default";
      const c = await comp({
        dir: "row",
        cross: "center",
        gap: "space.2xs",
        h: `chip.height-${p.size}`,
        px: `chip.padding-x-${p.size}`,
        radius: "chip.radius",
        fill: sel ? "fill.primary.weak" : p.state === "hover" ? "fill.surface.bold" : "fill.surface.default",
        stroke: dis ? "border.subtle" : sel ? "border.primary" : "border.default",
        ...(p.state === "focus" ? { effect: "focus" } : {}),
      });
      if (sel) c.appendChild(icon("check", "icon-size.sm", color));
      c.appendChild(await text("Money in", p.size === "md" ? "label.md" : "label.sm", color, { name: "#Label" }));
      return c;
    },
    { description: "Filters a list or picks an option. Selected chips show a check, so the state never depends on color alone." },
  );
}

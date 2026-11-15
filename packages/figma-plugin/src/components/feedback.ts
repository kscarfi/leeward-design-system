// Messages, status and overlays: Alert, Banner, Toast, Tooltip, Popover, Badge, Indicator,
// ProgressBar, Spinner, Skeleton, EmptyState, Dialog, Sheet and DropdownMenu.
import { bindNum, box, ellipse, fillParent, rect, text } from "../dsl.ts";
import { icon, swapIcon } from "../icons.ts";
import { comp, instance, instances, variantSet } from "../kit.ts";

const named = <T extends SceneNode>(node: T, name: string): T => {
  node.name = name;
  return node;
};
const TONES = ["info", "success", "warning", "danger", "neutral"];
const TONE_ICON: Record<string, string> = { info: "info", success: "check-circle", warning: "alert-triangle", danger: "alert-circle", neutral: "info" };
const surface = (tone: string) => ({ fill: `fill.${tone}.weak`, stroke: `border.${tone}-subtler` });
const onSubtle = (tone: string) => `text.${tone}-on-subtle`;

const close = (size = "sm") => {
  const b = instance("IconButton", { variant: "ghost", shape: "pill", size, state: "default" });
  swapIcon(b, "close");
  if (b) b.name = "?Dismiss";
  return b;
};

export async function buildAlert() {
  return variantSet(
    "Alert",
    { tone: TONES },
    async (p) => {
      const t = p.tone!;
      const body = await box({ name: "Body", dir: "column", gap: "space.2xs" }, [
        await text("Your card is frozen", "label.md", onSubtle(t), { name: "#Title" }),
        await text("Card payments stop until you unfreeze it. Direct debits keep working.", "body.sm", onSubtle(t), { name: "#Text", w: "fill" }),
      ]);
      const c = await comp({ dir: "row", gap: "space.sm", px: "alert.padding", py: "alert.padding", radius: "alert.radius", w: 400, ...surface(t) }, [icon(TONE_ICON[t]!, "icon-size.md", `icon.${t}-on-subtle`, "bold"), fillParent(body), close()]);
      return c;
    },
    { description: "A message about part of the page. Tone sets the color and icon together, so meaning never rests on color alone." },
  );
}

export async function buildBanner() {
  return variantSet(
    "Banner",
    { tone: TONES },
    async (p) => {
      const t = p.tone!;
      const body = await box({ name: "Body", dir: "row", wrap: true, gap: "space.2xs" }, [await text("Transfers to other banks pause on Sunday from 02:00 to 04:00.", "body.sm", onSubtle(t), { name: "#Text" }), await text("See details", "label.sm", onSubtle(t), { name: "?Action", underline: true })]);
      return comp({ dir: "row", gap: "banner.gap", cross: "start", px: "banner.padding-x", py: "banner.padding-y", w: 720, fill: `fill.${t}.weak`, stroke: `border.${t}-subtler`, strokeSides: { bottom: true }, strokeWidth: 1 }, [icon(TONE_ICON[t]!, "icon-size.md", `icon.${t}-on-subtle`, "bold"), fillParent(body), close("xs")]);
    },
    { description: "A full-width message at the top of the app or a page, about something that affects everything there." },
  );
}

export async function buildToast() {
  return variantSet(
    "Toast",
    { tone: ["success", "neutral", "warning", "danger"], action: ["false", "true"] },
    async (p) => {
      const t = p.tone!;
      const iconTone = t === "neutral" ? "info" : t;
      const wrap = await box({ name: "Icon", dir: "row", main: "center", cross: "center", w: "size.avatar.md", h: "size.avatar.md", radius: "radius.pill", fill: `fill.${iconTone}.weak` }, [icon(TONE_ICON[t]!, "icon-size.md", `icon.${iconTone}-on-subtle`, "bold")]);
      const copy: Record<string, [string, string]> = { success: ["Money sent", "Deniz gets ₺250,00 in a few seconds."], neutral: ["Statement ready", "Your November statement is in Documents."], warning: ["Card limit almost reached", "You have ₺800 left for today."], danger: ["Payment failed", "Nothing left your account. Try again."] };
      const [title, body] = copy[t]!;
      const texts = await box({ name: "Text", dir: "column" }, [await text(title, "label.md", "text.default", { name: "Title", w: "fill" }), await text(body, "body.sm", "text.muted", { name: "Description", w: "fill" })]);
      const action = p.action === "true" ? await box({ name: "Action", dir: "row", cross: "center", px: "space.sm", h: "size.control.sm", radius: "radius.control" }, [await text("Undo", "label.sm", "text.link-default", { name: "#Action" })]) : null;
      return comp({ dir: "row", cross: "center", gap: "space.sm", px: "toast.padding", py: "toast.padding", radius: "toast.radius", fill: "fill.surface.overlay", stroke: "border.muted", effect: "600", w: 400 }, [wrap, fillParent(texts), action, close()]);
    },
    { description: "A short confirmation after an action. It never holds the only way to do something, and stays while focused or hovered." },
  );
}

export async function buildTooltip() {
  return variantSet(
    "Tooltip",
    { side: ["top", "bottom"] },
    async (p) => {
      const bubble = await box({ name: "Bubble", dir: "row", px: "tooltip.padding-x", py: "tooltip.padding-y", radius: "tooltip.radius", fill: "fill.neutral.default", effect: "400" }, [await text("The fee is the same for every amount.", "body.sm", "text.inverse", { name: "#Text" })]);
      const arrow = figma.createPolygon();
      arrow.name = "Arrow";
      arrow.pointCount = 3;
      arrow.resize(12, 6);
      arrow.rotation = p.side === "top" ? 180 : 0;
      arrow.fills = bubble.fills;
      const parts = p.side === "top" ? [bubble, arrow] : [arrow, bubble];
      return comp({ dir: "column", cross: "center" }, parts);
    },
    { description: "A short hint about an icon or control, shown on hover and focus. Never put actions or essential information in it." },
  );
}

export async function buildPopover() {
  return variantSet(
    "Popover",
    {},
    async () => {
      const header = await box({ name: "Header", dir: "row", main: "between", cross: "start", gap: "space.sm", w: "fill" }, [await text("How is this fee calculated?", "label.md", "text.default", { name: "#Title" }), close("xs")]);
      const body = await box({ name: "Body", dir: "column", gap: "space.sm", w: "fill" }, [await text("Transfers to other banks cost ₺4,50. Transfers between Leeward accounts are free.", "body.sm", "text.muted", { name: "#Text", w: "fill" }), await text("See all fees", "body.sm", "text.link-default", { underline: true })]);
      return comp({ dir: "column", gap: "space.2xs", px: "popover.padding", py: "popover.padding", radius: "popover.radius", fill: "fill.surface.overlay", stroke: "border.muted", effect: "500", w: 320 }, [header, body]);
    },
    { description: "Extra detail or a small form next to the control that opened it. Closes with Escape and returns focus." },
  );
}

export async function buildBadge() {
  return variantSet(
    "Badge",
    { tone: ["neutral", "info", "success", "warning", "danger"], emphasis: ["subtle", "solid"], size: ["sm", "md"] },
    async (p) => {
      const t = p.tone!;
      const solid = p.emphasis === "solid";
      const color = solid ? `fill.${t}.on-default` : `text.${t}-on-subtle`;
      const dot = icon(TONE_ICON[t === "neutral" ? "info" : t]!, "icon-size.xs", color, "bold");
      dot.name = "?~Icon";
      dot.visible = false;
      return comp({ dir: "row", cross: "center", gap: p.size === "sm" ? "space.3xs" : "space.2xs", h: `badge.height-${p.size}`, px: `badge.padding-x-${p.size}`, radius: "badge.radius", fill: solid ? `fill.${t}.default` : `fill.${t}.weak`, ...(solid ? {} : { stroke: `border.${t}-subtler` }) }, [dot, await text("Pending", "badge", color, { name: "#Label" })]);
    },
    { description: "A short status next to the thing it describes. Always says the status in words." },
  );
}

export async function buildIndicator() {
  return variantSet(
    "Indicator",
    { tone: ["danger", "primary", "success"], kind: ["dot", "count"] },
    async (p) => {
      const t = p.tone!;
      if (p.kind === "dot") return comp({ dir: "none", w: "indicator.dot-size", h: "indicator.dot-size", radius: "indicator.radius", fill: `fill.${t}.default`, stroke: "fill.surface.default", strokeWidth: "size.border.strong" });
      return comp({ dir: "row", main: "center", cross: "center", h: "indicator.count-height", minW: "indicator.count-height", px: "indicator.count-padding-x", radius: "indicator.radius", fill: `fill.${t}.default` }, [await text("3", "badge", `fill.${t}.on-default`, { name: "#Count" })]);
    },
    { description: "A dot or count on the corner of another element. On circles it sits on the edge; on rectangles at the corner. Code adds a screen reader label." },
  );
}

export async function buildProgressBar() {
  return variantSet(
    "ProgressBar",
    { tone: ["brand", "success", "warning", "danger"], size: ["sm", "md"] },
    async (p) => {
      const fill = p.tone === "brand" ? "fill.primary.default" : `icon.${p.tone}`;
      const header = await box({ name: "Header", dir: "row", main: "between", gap: "space.sm", w: "fill" }, [await text("Holiday fund", "label.sm", "text.default", { name: "#Label" }), await text("₺4.500 of ₺10.000", "body.sm", "text.muted", { name: "#Value" })]);
      const track = await box({ name: "Track", dir: "row", h: `progress.height-${p.size}`, radius: "progress.radius", fill: "fill.surface.emphasis", stroke: "border.muted", w: "fill", clip: true }, [rect({ name: "Indicator", w: 144, h: `progress.height-${p.size}`, radius: "radius.pill", fill })]);
      return comp({ dir: "column", gap: "space.xs", w: 320 }, [header, track]);
    },
    { description: "Progress toward a known total. Always shows the value in words next to the bar." },
  );
}

export async function buildSpinner() {
  return variantSet(
    "Spinner",
    { size: ["sm", "md", "lg"] },
    async (p) => {
      const ring = ellipse({ name: "Track", size: `spinner.size-${p.size}`, stroke: "border.muted", strokeWidth: "size.border.strong" });
      const arc = ellipse({ name: "Arc", size: `spinner.size-${p.size}`, stroke: "fill.primary.default", strokeWidth: "size.border.strong" });
      arc.arcData = { startingAngle: 0, endingAngle: Math.PI / 2, innerRadius: 1 };
      const c = await comp({ dir: "none", w: `spinner.size-${p.size}`, h: `spinner.size-${p.size}` });
      c.appendChild(ring);
      c.appendChild(arc);
      return c;
    },
    { description: "Something is loading and the wait is short. For content, prefer Skeleton." },
  );
}

export async function buildSkeleton() {
  return variantSet(
    "Skeleton",
    { shape: ["text", "rect", "circle"] },
    async (p) => {
      if (p.shape === "circle") return comp({ dir: "none", w: "size.avatar.md", h: "size.avatar.md", radius: "radius.pill", fill: "fill.skeleton.base" });
      if (p.shape === "rect") return comp({ dir: "none", w: 240, h: "size.control.lg", radius: "skeleton.radius-rect", fill: "fill.skeleton.base" });
      return comp({ dir: "none", w: 240, h: "type.body.md.size", radius: "skeleton.radius-text", fill: "fill.skeleton.base" });
    },
    { description: "A placeholder in the shape of content that is loading. Shimmers in code unless people prefer reduced motion." },
  );
}

export async function buildEmptyState() {
  return variantSet(
    "EmptyState",
    {},
    async () => {
      const art = await box({ name: "Art", dir: "row", main: "center", cross: "center", w: "empty-state.art-size", h: "empty-state.art-size", radius: "radius.pill", fill: "fill.primary.weak" }, [named(icon("wallet", "icon-size.xl", "icon.primary", "duotone"), "~Icon")]);
      const action = instance("Button", { variant: "primary", shape: "rounded", size: "md", state: "default" }, { Label: "Send money" });
      return comp({ dir: "column", cross: "center", gap: "space.xs", px: "space.md", py: "space.xl", w: 360 }, [art, await text("No payments yet", "heading.h4", "text.default", { name: "#Title", align: "center" }), await text("Your payments and transfers show up here as soon as you make them.", "body.sm", "text.muted", { name: "#Description", align: "center", w: "fill" }), action ? await box({ name: "?Action", dir: "row", pad: ["space.sm", 0, 0, 0] }, [action]) : null]);
    },
    { description: "Explains why a place is empty and what to do next." },
  );
}

async function actions(primary: string, secondary: string, danger = false): Promise<FrameNode> {
  const a = instance("Button", { variant: danger ? "danger" : "primary", shape: "rounded", size: "md", state: "default" }, { Label: primary });
  const b = instance("Button", { variant: "ghost", shape: "rounded", size: "md", state: "default" }, { Label: secondary });
  const footer = await box({ name: "Footer", dir: "row", main: "end", gap: "space.sm", pad: ["space.xs", 0, 0, 0], w: "fill" }, [b, a]);
  return footer;
}

export async function buildDialog() {
  return variantSet(
    "Dialog",
    { kind: ["default", "destructive"] },
    async (p) => {
      const danger = p.kind === "destructive";
      const header = await box({ name: "Header", dir: "row", main: "between", cross: "start", gap: "space.sm", w: "fill" }, [await text(danger ? "Close your account?" : "Freeze your card?", "heading.h3", "text.default", { name: "#Title" }), close()]);
      const body = await text(danger ? "This cannot be undone. Move your money out first: the balance must be ₺0,00." : "Card payments and cash withdrawals stop until you unfreeze it. Direct debits keep working.", "body.md", "text.muted", { name: "#Description", w: "fill" });
      return comp({ dir: "column", gap: "space.md", px: "dialog.padding", py: "dialog.padding", radius: "dialog.radius", fill: "fill.surface.overlay", effect: "700", w: "dialog.width-md" }, [header, body, await actions(danger ? "Close account" : "Freeze card", danger ? "Cancel" : "Keep it active", danger)]);
    },
    { description: "Asks for a decision before going on. On phones it becomes a bottom sheet with full width actions. Focus stays inside until it closes." },
  );
}

export async function buildSheet() {
  return variantSet(
    "Sheet",
    { side: ["bottom", "end", "start"] },
    async (p) => {
      const bottom = p.side === "bottom";
      const header = await box({ name: "Header", dir: "row", main: "between", cross: "center", w: "fill" }, [await text(p.side === "start" ? "Menu" : "Filter transactions", "heading.h3", "text.default", { name: "#Title" }), close()]);
      const content =
        p.side === "start"
          ? await box({ name: "Content", dir: "column", w: "fill" }, [instance("ListItem", { kind: "link", state: "default" }, { Title: "Home" }, { "Show description": false }), instance("ListItem", { kind: "link", state: "default" }, { Title: "Payments" }, { "Show description": false }), instance("ListItem", { kind: "link", state: "default" }, { Title: "Cards" }, { "Show description": false })])
          : await box({ name: "Content", dir: "column", gap: "space.sm", w: "fill" }, [instance("Checkbox", { checked: "true", state: "default" }, { Label: "Money in" }), instance("Checkbox", { checked: "true", state: "default" }, { Label: "Money out" }), instance("Checkbox", { checked: "false", state: "default" }, { Label: "Pending only" })]);
      for (const c of content.children) if (c.type === "INSTANCE") c.layoutSizingHorizontal = "FILL";
      const parts: SceneNode[] = [header, content];
      if (p.side !== "start") {
        const a = instance("Button", { variant: "primary", shape: "rounded", size: "lg", state: "default" }, { Label: "Show results" });
        const b = instance("Button", { variant: "ghost", shape: "rounded", size: "lg", state: "default" }, { Label: "Clear" });
        const footer = await box({ name: "Footer", dir: "column", gap: "space.xs", w: "fill" }, [a, b]);
        for (const c of footer.children) (c as InstanceNode).layoutSizingHorizontal = "FILL";
        parts.push(footer);
      }
      const c = await comp({ dir: "column", gap: "space.md", px: "sheet.padding", py: "sheet.padding", fill: "fill.surface.overlay", effect: "700", w: bottom ? 390 : 360, ...(bottom ? {} : { h: 640 }) }, parts);
      // Only the corners that face the content are rounded.
      const corners = bottom ? (["topLeftRadius", "topRightRadius"] as const) : p.side === "end" ? (["topLeftRadius", "bottomLeftRadius"] as const) : (["topRightRadius", "bottomRightRadius"] as const);
      for (const corner of corners) bindNum(c, corner, "sheet.radius");
      return c;
    },
    { description: "A panel from the bottom on phones or from the side on larger screens, for filters, details and short tasks." },
  );
}

export async function buildDropdownMenu() {
  await variantSet(
    "_Menu item",
    { state: ["default", "hover", "selected", "destructive", "disabled"] },
    async (p) => {
      const s = p.state!;
      const color = s === "destructive" ? "text.danger" : s === "disabled" ? "text.subtler" : "text.default";
      const lead = icon("copy", "icon-size.md", s === "destructive" ? "text.danger" : s === "disabled" ? "icon.subtler" : "icon.muted");
      lead.name = "?~Icon";
      const shortcut = await text("⌘C", "caption", "text.muted", { name: "?#Shortcut" });
      shortcut.visible = false;
      const check = icon("check", "icon-size.md", "icon.primary");
      check.name = "Check";
      check.visible = s === "selected";
      return comp({ dir: "row", cross: "center", gap: "space.xs", h: "menu.item-height", px: "space.sm", radius: "menu.item-radius", w: 240, ...(s === "hover" ? { fill: "fill.surface.bold" } : {}) }, [lead, fillParent(await text("Menu item", "label.sm", color, { name: "#Label" })), shortcut, check]);
    },
    { description: "One row of a menu or option list: default, hover, selected (with a check), destructive and disabled." },
  );
  return variantSet(
    "DropdownMenu",
    {},
    async () => {
      const separator = rect({ name: "Separator", w: 220, h: "size.border.default", fill: "border.muted" });
      const list = await comp({ dir: "column", px: "menu.padding", py: "menu.padding", radius: "menu.radius", fill: "fill.surface.overlay", stroke: "border.muted", effect: "500", w: 248 }, [
        await box({ name: "Group label", dir: "row", pad: ["space.xs", "space.sm", "space.2xs", "space.sm"] }, [await text("Card", "caption", "text.muted", { name: "#Group" })]),
        ...instances([
          ["_Menu item", { state: "hover" }, { Label: "Freeze card" }, {}, { Icon: "lock" }],
          ["_Menu item", { state: "default" }, { Label: "Copy card number", Shortcut: "⌘C" }, { "Show shortcut": true }, { Icon: "copy" }],
          ["_Menu item", { state: "default" }, { Label: "Download statement" }, {}, { Icon: "download" }],
        ]),
        separator,
        ...instances([["_Menu item", { state: "destructive" }, { Label: "Report as lost" }, {}, { Icon: "shield-warning" }]]),
      ]);
      for (const c of list.children) (c as FrameNode).layoutSizingHorizontal = "FILL";
      return list;
    },
    { description: "A short list of _Menu item instances behind a button. Destructive actions sit last and are marked with color, icon and words." },
  );
}

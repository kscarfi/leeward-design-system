// Avatar, AvatarGroup, Card, Divider, Heading, Text, Image, ListItem, Table and Stack.
import { box, fillParent, paint, rect, text } from "../dsl.ts";
import { icon } from "../icons.ts";
import { comp, instance, variantSet } from "../kit.ts";

const AVATAR_TYPE: Record<string, string> = { xs: "label.xs", sm: "label.sm", md: "label.sm", lg: "heading.h3", xl: "title.xs" };

export async function buildAvatar() {
  return variantSet(
    "Avatar",
    { tone: ["primary", "secondary", "info", "success", "warning"], size: ["xs", "sm", "md", "lg", "xl"] },
    async (p) =>
      comp({ dir: "row", main: "center", cross: "center", w: `avatar.size-${p.size}`, h: `avatar.size-${p.size}`, radius: "avatar.radius", fill: `fill.${p.tone}.weak`, clip: true }, [await text("DY", AVATAR_TYPE[p.size!]!, `text.${p.tone}-on-subtle`, { name: "#Initials" })]),
    { description: "A person or business. Initials when there is no photo; the tone comes from the name, so it stays the same everywhere." },
  );
}

export async function buildAvatarGroup() {
  return variantSet(
    "AvatarGroup",
    { size: ["xs", "sm", "md", "lg"] },
    async (p) => {
      const tones = ["primary", "success", "info"];
      const avatars = tones.map((tone) => instance("Avatar", { tone, size: p.size! }));
      const more = await box({ name: "More", dir: "row", main: "center", cross: "center", w: `avatar.size-${p.size}`, h: `avatar.size-${p.size}`, radius: "avatar.radius", fill: "fill.surface.bolder", stroke: "fill.surface.default", strokeWidth: "avatar-group.ring-width" }, [await text("+2", "label.xs", "text.default")]);
      const sizes: Record<string, number> = { xs: 24, sm: 32, md: 40, lg: 48 };
      const c = await comp({ dir: "row", cross: "center", gap: -Math.round(sizes[p.size!]! / 6) }, [...avatars, more]);
      for (const a of avatars) {
        if (!a) continue;
        a.strokes = [paint("fill.surface.default")];
        a.strokeAlign = "OUTSIDE";
        a.strokeWeight = 2;
      }
      c.itemReverseZIndex = true;
      return c;
    },
    { description: "A few people at once, overlapping, with the rest as a count." },
  );
}

export async function buildCard() {
  return variantSet(
    "Card",
    { variant: ["outlined", "elevated", "filled"], padding: ["none", "sm", "md", "lg"] },
    async (p) => {
      const look = p.variant === "outlined" ? { fill: "fill.surface.default", stroke: "border.muted" } : p.variant === "elevated" ? { fill: "fill.surface.raised", effect: "200" } : { fill: "fill.surface.emphasis" };
      const pad = p.padding === "none" ? 0 : `card.padding-${p.padding}`;
      const slot = await box({ name: "Content", dir: "column", gap: "space.xs", w: "fill" }, [await text("Everyday account", "heading.h5", "text.default"), await text("Replace this content with your own.", "body.sm", "text.muted")]);
      return comp({ dir: "column", gap: "space.md", px: pad, py: pad, radius: "card.radius", w: 320, ...look }, [slot]);
    },
    { description: "Groups content about one thing. Use padding none for cards that hold lists." },
  );
}

export async function buildDivider() {
  return variantSet(
    "Divider",
    { orientation: ["horizontal", "vertical", "labelled"] },
    async (p) => {
      if (p.orientation === "vertical") return comp({ dir: "none", w: "divider.thickness", h: 48, fill: "border.muted" });
      if (p.orientation === "horizontal") return comp({ dir: "none", w: 320, h: "divider.thickness", fill: "border.muted" });
      const line = () => fillParent(rect({ name: "Line", w: 100, h: "divider.thickness", fill: "border.muted" }));
      return comp({ dir: "row", cross: "center", gap: "divider.gap", w: 320 }, [line(), await text("or", "caption", "text.subtle", { name: "#Label" }), line()]);
    },
    { description: "Separates groups of content. Prefer space; use a divider only when space is not enough." },
  );
}

const HEADING_ROLES: Record<string, string> = { "display-lg": "display.lg", "display-md": "display.md", "title-xl": "title.xl", "title-lg": "title.lg", "title-md": "title.md", "title-sm": "title.sm", "title-xs": "title.xs", h1: "heading.h1", h2: "heading.h2", h3: "heading.h3", h4: "heading.h4", h5: "heading.h5", h6: "heading.h6" };
const HEADING_TONES: Record<string, string> = { default: "text.default", muted: "text.muted", primary: "text.primary", inverse: "text.inverse" };

export async function buildHeading() {
  return variantSet(
    "Heading",
    { tone: Object.keys(HEADING_TONES), size: Object.keys(HEADING_ROLES) },
    async (p) => comp({ dir: "row", ...(p.tone === "inverse" ? { fill: "fill.neutral.default", px: "space.xs" } : {}) }, [await text("Your accounts", HEADING_ROLES[p.size!]!, HEADING_TONES[p.tone!]!, { name: "#Text" })]),
    { description: "Titles of pages and sections. The level in code is separate from the size, so the outline stays right." },
  );
}

const TEXT_ROLES: Record<string, string> = { "body-lg": "body.lg", "body-md": "body.md", "body-sm": "body.sm", "label-lg": "label.lg", "label-md": "label.md", "label-sm": "label.sm", "label-xs": "label.xs", "subtitle-lg": "subtitle.lg", "subtitle-md": "subtitle.md", "subtitle-sm": "subtitle.sm", caption: "caption", code: "code" };
const TEXT_TONES: Record<string, string> = { primary: "text.default", secondary: "text.muted", tertiary: "text.subtle", brand: "text.primary", success: "text.success", warning: "text.warning", danger: "text.danger", inverse: "text.inverse" };

export async function buildText() {
  return variantSet(
    "Text",
    { tone: Object.keys(TEXT_TONES), variant: Object.keys(TEXT_ROLES) },
    async (p) => comp({ dir: "row", ...(p.tone === "inverse" ? { fill: "fill.neutral.default", px: "space.xs" } : {}) }, [await text("Your money arrives in seconds.", TEXT_ROLES[p.variant!]!, TEXT_TONES[p.tone!]!, { name: "#Text" })]),
    { description: "Body text, labels and captions. Pick by role, not by size." },
  );
}

export async function buildImage() {
  return variantSet(
    "Image",
    { state: ["loaded", "fallback"] },
    async (p) => {
      if (p.state === "fallback") return comp({ dir: "column", main: "center", cross: "center", gap: "space.2xs", w: 320, h: 180, radius: "image.radius", fill: "fill.surface.bold" }, [icon("document", "icon-size.lg", "icon.muted"), await text("Image unavailable", "caption", "text.muted", { name: "#Text" })]);
      return comp({ dir: "none", w: 320, h: 180, radius: "image.radius", fill: "fill.primary.default", clip: true });
    },
    { description: "A picture with a fixed ratio and a fallback when it fails to load. Decorative images get an empty alt text." },
  );
}

/** _Icon tile: the tinted circle or rounded square behind an icon, shared by lists, rows and cards. */
export async function buildIconTile() {
  return variantSet(
    "_Icon tile",
    { tone: ["primary", "secondary", "info", "success", "warning", "danger", "neutral"], shape: ["circle", "rounded"] },
    async (p) => {
      const glyph = icon("wallet", "icon-size.md", `icon.${p.tone}`);
      glyph.name = "~Icon";
      return comp({ dir: "row", main: "center", cross: "center", w: "size.avatar.md", h: "size.avatar.md", radius: p.shape === "circle" ? "radius.pill" : "radius.lg", fill: `fill.${p.tone}.weak` }, [glyph]);
    },
    { description: "A tinted tile behind an icon. Swap the icon; the tone sets both colors together." },
  );
}

export async function buildListItem() {
  await buildIconTile();
  return variantSet(
    "ListItem",
    { kind: ["static", "button", "link", "toggle"], state: ["default", "hover", "focus"] },
    async (p) => {
      const lead = instance("_Icon tile", { tone: "primary", shape: "circle" }, {}, {}, { Icon: p.kind === "toggle" ? "bell" : "document" });
      if (lead) lead.name = "?Leading";
      const texts = await box({ name: "Text", dir: "column" }, [await text(p.kind === "toggle" ? "Notifications" : "Statements", "label.md", "text.default", { name: "#Title" }), await text(p.kind === "toggle" ? "Payments and security" : "Download monthly PDFs", "body.sm", "text.muted", { name: "?#Description" })]);
      const end = p.kind === "button" || p.kind === "link" ? icon("chevron-right", "icon-size.md", "icon.muted") : p.kind === "toggle" ? instance("_Switch track", { checked: "true", state: "default" }) : null;
      const interactive = p.kind !== "static";
      return comp({ dir: "row", cross: "center", gap: "space.sm", px: "list-item.padding-x", py: "list-item.padding-y", w: 360, fill: interactive && p.state === "hover" ? "fill.surface.bold" : "fill.surface.default", ...(interactive && p.state === "focus" ? { effect: "focus-inset" } : {}) }, [lead, fillParent(texts), end]);
    },
    { description: "A row in a list: static text, a button, a link or a row with a switch. Built from _Icon tile and, for toggles, _Switch track." },
  );
}

export async function buildTable() {
  await variantSet(
    "_Table cell",
    { kind: ["header", "body", "body-end"] },
    async (p) => {
      if (p.kind === "header") return comp({ dir: "row", cross: "center", gap: "space.2xs", px: "table.cell-padding-x", h: "table.header-height", w: 140, fill: "fill.surface.bold", stroke: "border.default", strokeSides: { bottom: true }, strokeWidth: 1 }, [await text("Merchant", "label.sm", "text.muted", { name: "#Label" }), Object.assign(icon("arrows-up-down", "icon-size.sm", "icon.subtler"), { name: "?Sort" })]);
      const end = p.kind === "body-end";
      return comp({ dir: "row", cross: "center", main: end ? "end" : "start", px: "table.cell-padding-x", py: "table.cell-padding-y", w: 140, stroke: "border.subtle", strokeSides: { bottom: true }, strokeWidth: 1 }, [await text(end ? "−₺642,40" : "Migros", "body.sm", "text.default", { name: "#Value", numeric: end })]);
    },
    { description: "One table cell: a header with an optional sort icon, a body cell, or a number aligned to the end." },
  );
  return variantSet(
    "Table",
    {},
    async () => {
      const cols = [{ name: "Date", w: 96 }, { name: "Merchant", w: 140 }, { name: "Category", w: 120 }, { name: "Amount", w: 140, end: true }];
      const rows = [["Nov 11", "Salary", "Income", "+₺52.000,00"], ["Nov 10", "Migros", "Groceries", "−₺642,40"], ["Nov 8", "Istanbulkart", "Transport", "−₺150,00"]];
      const sized = (n: InstanceNode | null, w: number) => {
        if (n) n.resize(w, n.height);
        return n;
      };
      const header = await box({ name: "Header", dir: "row" }, cols.map((c) => sized(instance("_Table cell", { kind: "header" }, { Label: c.name }), c.w)));
      const body = await Promise.all(rows.map((r, ri) => box({ name: `Row ${ri + 1}`, dir: "row" }, r.map((v, i) => sized(instance("_Table cell", { kind: cols[i]!.end ? "body-end" : "body" }, { Value: v }), cols[i]!.w)))));
      const caption = await box({ name: "Caption", dir: "row", px: "table.cell-padding-x", py: "table.cell-padding-y" }, [await text("Transactions in November", "heading.h5", "text.default", { name: "#Caption" })]);
      return comp({ dir: "column", radius: "table.radius", fill: "fill.surface.default", stroke: "border.subtle", clip: true }, [caption, header, ...body]);
    },
    { description: "Rows and columns of _Table cell instances. Sortable headers say their sort order; on small screens the table scrolls inside its frame." },
  );
}

export async function buildStack() {
  return variantSet(
    "Stack",
    { direction: ["vertical", "horizontal"] },
    async (p) => {
      const item = async (label: string) => box({ name: label, dir: "row", px: "space.sm", py: "space.xs", radius: "radius.sm", fill: "fill.primary.weak" }, [await text(label, "label.sm", "text.primary-on-subtle")]);
      return comp({ dir: p.direction === "vertical" ? "column" : "row", gap: "space.md" }, [await item("One"), await item("Two"), await item("Three")]);
    },
    { description: "Spacing between children with a space token. In Figma this is auto layout with a bound gap." },
  );
}

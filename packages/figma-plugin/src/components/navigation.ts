// Tabs, Breadcrumbs, Pagination, NavigationBar, PageHeader, Stepper, SkipLink and Accordion,
// each put together from base parts that hold the states.
import { box, fillParent, rect, text } from "../dsl.ts";
import { icon } from "../icons.ts";
import { comp, instance, instances, variantSet } from "../kit.ts";

const named = <T extends SceneNode>(node: T, name: string, visible = true): T => {
  node.name = name;
  node.visible = visible;
  return node;
};

export async function buildTabs() {
  await variantSet(
    "_Tab",
    { state: ["active", "default", "hover", "focus", "disabled"] },
    async (p) => {
      const s = p.state!;
      const active = s === "active";
      const color = active ? "text.primary" : s === "hover" ? "text.default" : s === "disabled" ? "text.subtler" : "text.muted";
      const content = await box({ name: "Content", dir: "row", cross: "center", gap: "space.2xs" }, [named(icon("history", "icon-size.sm", color), "?~Icon", false), await text("Activity", "label.md", color, { name: "#Label", ...(active ? { weight: "Bold" as const } : {}) })]);
      const tab = await comp({ dir: "column", cross: "center", main: "center", px: "space.2xs", h: "tabs.height", ...(s === "focus" ? { effect: "focus-inset" } : {}) }, [fillParent(content, "h")]);
      const bar = rect({ name: "Indicator", w: 10, h: "tabs.indicator-thickness", radius: "radius.pill", fill: "border.primary" });
      tab.appendChild(bar);
      bar.layoutSizingHorizontal = "FILL";
      bar.visible = active;
      return tab;
    },
    { description: "One tab. The active tab has a bar and bolder text, not only color." },
  );
  return variantSet(
    "Tabs",
    { icons: ["false", "true"] },
    async (p) => {
      const withIcons = p.icons === "true";
      const tabs = instances([
        ["_Tab", { state: "active" }, { Label: "Activity" }, { "Show icon": withIcons }, { Icon: "history" }],
        ["_Tab", { state: "default" }, { Label: "Statements" }, { "Show icon": withIcons }, { Icon: "documents" }],
        ["_Tab", { state: "default" }, { Label: "Details" }, { "Show icon": withIcons }, { Icon: "info" }],
      ]);
      return comp({ dir: "row", gap: "space.lg", w: 360, stroke: "border.muted", strokeSides: { bottom: true }, strokeWidth: 1 }, tabs);
    },
    { description: "Switches between views at the same level. Built from _Tab instances." },
  );
}

export async function buildBreadcrumbs() {
  await variantSet(
    "_Breadcrumb",
    { kind: ["link", "more", "current"] },
    async (p) => {
      if (p.kind === "current") return comp({ dir: "row" }, [await text("Everyday account", "body.sm", "text.default", { name: "#Label", weight: "SemiBold" })]);
      const label = p.kind === "more" ? await text("…", "body.sm", "text.link-default", { name: "More" }) : await text("Accounts", "body.sm", "text.link-default", { name: "#Label", underline: true });
      return comp({ dir: "row", cross: "center", gap: "breadcrumbs.gap" }, [label, icon("chevron-right", "icon-size.sm", "icon.muted")]);
    },
    { description: "One crumb: a link with its separator, the collapsed more button, or the current page in bold." },
  );
  return variantSet(
    "Breadcrumbs",
    { collapsed: ["false", "true"] },
    async (p) => {
      const items =
        p.collapsed === "true"
          ? instances([["_Breadcrumb", { kind: "link" }, { Label: "Home" }], ["_Breadcrumb", { kind: "more" }], ["_Breadcrumb", { kind: "link" }, { Label: "Statements" }], ["_Breadcrumb", { kind: "current" }, { Label: "November 2026" }]])
          : instances([["_Breadcrumb", { kind: "link" }, { Label: "Home" }], ["_Breadcrumb", { kind: "link" }, { Label: "Accounts" }], ["_Breadcrumb", { kind: "current" }, { Label: "Everyday account" }]]);
      return comp({ dir: "row", cross: "center", gap: "breadcrumbs.gap" }, items);
    },
    { description: "Shows where a page sits and links back up. Built from _Breadcrumb instances; the current page is the last item." },
  );
}

export async function buildPagination() {
  await variantSet(
    "_Page",
    { state: ["default", "hover", "current", "focus", "gap"] },
    async (p) => {
      const s = p.state!;
      if (s === "gap") return comp({ dir: "row", main: "center", minW: "space.lg" }, [await text("…", "label.sm", "text.muted")]);
      const current = s === "current";
      return comp({ dir: "row", main: "center", cross: "center", minW: "pagination.item-size", h: "pagination.item-size", px: "space.xs", radius: "pagination.radius", ...(current ? { fill: "fill.primary.weak", stroke: "border.primary-subtler" } : s === "hover" ? { fill: "fill.surface.bold" } : {}), ...(s === "focus" ? { effect: "focus" } : {}) }, [await text("6", "label.sm", current ? "text.primary-on-subtle" : "text.default", { name: "#Page", ...(current ? { weight: "SemiBold" as const } : {}) })]);
    },
    { description: "One page button, the current page, or the gap that stands for skipped pages." },
  );
  return variantSet(
    "Pagination",
    { kind: ["pages", "unknown-total"] },
    async (p) => {
      const step = (name: string) => instance("IconButton", { variant: "ghost", shape: "rounded", size: "sm", state: "default" }, {}, {}, { Icon: name });
      const middle: SceneNode[] =
        p.kind === "pages"
          ? instances([["_Page", { state: "default" }, { Page: "1" }], ["_Page", { state: "gap" }], ["_Page", { state: "default" }, { Page: "5" }], ["_Page", { state: "current" }, { Page: "6" }], ["_Page", { state: "default" }, { Page: "7" }], ["_Page", { state: "gap" }], ["_Page", { state: "default" }, { Page: "12" }]])
          : [await box({ name: "Status", dir: "row", px: "space.sm" }, [await text("Page 3", "label.sm", "text.default", { name: "#Status" })])];
      return comp({ dir: "row", cross: "center", gap: "pagination.gap" }, [step("chevron-left"), ...middle, step("chevron-right")]);
    },
    { description: "Moves through pages of results with _Page instances and IconButton arrows." },
  );
}

export async function buildNavigationBar() {
  await variantSet(
    "_Nav item",
    { active: ["true", "false"] },
    async (p) => {
      const active = p.active === "true";
      const glyph = named(icon("home", "icon-size.lg", active ? "icon.primary-on-subtle" : "text.muted"), "~Icon");
      const pill = await box({ name: "Indicator", dir: "row", main: "center", cross: "center", w: "navigation-bar.indicator-width", h: "navigation-bar.indicator-height", radius: "navigation-bar.indicator-radius", ...(active ? { fill: "fill.primary.weak" } : {}) }, [glyph]);
      const count = instance("Indicator", { tone: "danger", kind: "count" });
      if (count) {
        pill.appendChild(count);
        count.layoutPositioning = "ABSOLUTE";
        count.x = 34;
        count.y = -4;
        count.name = "?Count";
        count.visible = false;
      }
      return comp({ dir: "column", cross: "center", main: "center", gap: "space.3xs", pad: ["space.2xs", "space.3xs", "space.2xs", "space.3xs"], h: "navigation-bar.height", w: 96 }, [pill, await text("Home", "label.xs", active ? "text.default" : "text.muted", { name: "#Label", ...(active ? { weight: "SemiBold" as const } : {}) })]);
    },
    { description: "One destination: icon, label and an optional Indicator count. The active item has a pill and bolder text." },
  );
  return variantSet(
    "NavigationBar",
    {},
    async () => {
      const items = instances([
        ["_Nav item", { active: "true" }, { Label: "Home" }, {}, { Icon: "home" }],
        ["_Nav item", { active: "false" }, { Label: "Payments" }, {}, { Icon: "arrows-left-right" }],
        ["_Nav item", { active: "false" }, { Label: "Cards" }, {}, { Icon: "card" }],
        ["_Nav item", { active: "false" }, { Label: "Inbox" }, { Count: true }, { Icon: "inbox" }],
      ]);
      return comp({ dir: "row", w: 390, fill: "fill.surface.raised", stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, items.map((n) => fillParent(n)));
    },
    { description: "The main destinations of a phone app, three to five _Nav item instances, always with icon and label." },
  );
}

export async function buildPageHeader() {
  return variantSet(
    "PageHeader",
    { level: ["sub-page", "top-level"] },
    async (p) => {
      const sub = p.level === "sub-page";
      const back = sub ? instance("IconButton", { variant: "ghost", shape: "pill", size: "md", state: "default" }, {}, {}, { Icon: "arrow-left" }) : null;
      const action = instance("IconButton", { variant: "ghost", shape: "pill", size: "md", state: "default" }, {}, {}, { Icon: sub ? "help" : "bell" });
      if (action) action.name = "?Action";
      return comp({ dir: "row", cross: "center", gap: "page-header.gap", h: "page-header.height", px: "page-header.padding-x", w: 390, fill: "fill.surface.canvas" }, [back, fillParent(await text(sub ? "Send money" : "Home", "title.xs", "text.default", { name: "Title", truncate: true })), action]);
    },
    { description: "The title of a screen with a back IconButton on sub-pages and up to two actions." },
  );
}

export async function buildStepper() {
  await variantSet(
    "_Step",
    { state: ["done", "current", "upcoming"] },
    async (p) => {
      const s = p.state!;
      const number = await text("2", "label.xs", s === "current" ? "fill.primary.on-default" : "text.muted", { name: "#Number" });
      number.visible = s !== "done";
      const check = icon("check", "icon-size.sm", "icon.primary-on-subtle");
      check.visible = s === "done";
      const marker = await box({ name: "Marker", dir: "row", main: "center", cross: "center", w: "stepper.marker-size", h: "stepper.marker-size", radius: "radius.pill", ...(s === "current" ? { fill: "fill.primary.default" } : s === "done" ? { fill: "fill.primary.weak" } : {}), stroke: s === "upcoming" ? "border.default" : "fill.primary.default", strokeWidth: "size.border.strong" }, [number, check]);
      return comp({ dir: "row", cross: "center", gap: "space.xs" }, [marker, await text("Amount", "label.sm", s === "current" ? "text.default" : "text.muted", { name: "#Label" })]);
    },
    { description: "One step: done (check), current (filled) or upcoming (outline)." },
  );
  return variantSet(
    "Stepper",
    { variant: ["full", "compact"] },
    async (p) => {
      if (p.variant === "compact") {
        const top = await box({ name: "Text", dir: "row", main: "between", w: "fill" }, [await text("Step 2 of 4", "label.sm", "text.muted", { name: "#Progress" }), await text("Amount", "label.sm", "text.default", { name: "#Current" })]);
        const bar = await box({ name: "Bar", dir: "row", h: "space.2xs", radius: "radius.pill", fill: "fill.surface.bolder", w: "fill", clip: true }, [rect({ name: "Fill", w: 180, h: "space.2xs", radius: "radius.pill", fill: "fill.primary.default" })]);
        return comp({ dir: "column", gap: "space.xs", w: 360 }, [top, bar]);
      }
      const names = ["Recipient", "Amount", "Review", "Confirm"];
      const parts: SceneNode[] = [];
      names.forEach((name, i) => {
        if (i > 0) parts.push(fillParent(rect({ name: "Connector", w: 16, h: "size.border.strong", radius: "radius.pill", fill: i <= 1 ? "fill.primary.default" : "border.muted" })));
        const step = instance("_Step", { state: i < 1 ? "done" : i === 1 ? "current" : "upcoming" }, { Number: String(i + 1), Label: name });
        if (step) parts.push(step);
      });
      return comp({ dir: "row", cross: "center", gap: "space.xs", w: 560 }, parts);
    },
    { description: "Shows the steps of a flow with _Step instances. Under 480 px wide, only the current step keeps its name." },
  );
}

export async function buildSkipLink() {
  return variantSet(
    "SkipLink",
    {},
    async () => comp({ dir: "row", px: "space.md", py: "space.sm", radius: "control.radius.md", fill: "fill.surface.raised", effect: "focus" }, [await text("Skip to main content", "label.md", "text.default", { name: "#Label", underline: true })]),
    { description: "The first focusable element on every page. Hidden until it gets keyboard focus." },
  );
}

export async function buildAccordion() {
  await variantSet(
    "_Accordion item",
    { open: ["false", "true"], state: ["default", "hover", "focus"] },
    async (p) => {
      const open = p.open === "true";
      const trigger = await box({ name: "Trigger", dir: "row", cross: "center", gap: "space.sm", px: "space.md", py: "space.sm", w: "fill", ...(p.state === "hover" ? { fill: "fill.surface.bold" } : {}), ...(p.state === "focus" ? { effect: "focus-inset" } : {}) }, [fillParent(await text("How long does a transfer take?", "label.md", "text.default", { name: "#Title" })), icon(open ? "chevron-up" : "chevron-down", "icon-size.md", "icon.muted")]);
      trigger.minHeight = 48;
      const content = await box({ name: "Content", dir: "column", pad: [0, "space.md", "space.md", "space.md"], w: "fill" }, [await text("Transfers between Leeward accounts arrive in seconds. Other banks take up to one working day.", "body.sm", "text.muted", { name: "#Body", w: "fill" })]);
      content.visible = open;
      return comp({ dir: "column", w: 400, fill: "fill.surface.default" }, [trigger, content]);
    },
    { description: "One question or section, open or closed. The heading stays visible and the chevron turns." },
  );
  return variantSet(
    "Accordion",
    {},
    async () => {
      const items = instances([
        ["_Accordion item", { open: "true", state: "default" }, { Title: "How long does a transfer take?" }],
        ["_Accordion item", { open: "false", state: "default" }, { Title: "What are the fees?" }],
        ["_Accordion item", { open: "false", state: "default" }, { Title: "Can I cancel a transfer?" }],
      ]);
      const rows: FrameNode[] = [];
      for (const [i, item] of items.entries()) rows.push(await box({ name: `Item ${i + 1}`, dir: "column", w: "fill", ...(i ? { stroke: "border.muted", strokeSides: { top: true }, strokeWidth: 1 } : {}) }, [fillParent(item)]));
      return comp({ dir: "column", radius: "accordion.radius", fill: "fill.surface.default", stroke: "border.muted", w: 400, clip: true }, rows);
    },
    { description: "Questions or sections people open one at a time, built from _Accordion item instances." },
  );
}

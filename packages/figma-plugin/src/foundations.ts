// Cover, getting started and foundations: color, typography, spacing, radius, elevation and layout.
// Every sample is bound to the variable or style it shows.
import { light, modes, ramps } from "./data.ts";
import { box, fillParent, library, paint, primitivePaint, rect, setMode, text } from "./dsl.ts";
import { textStyles, effectStyles, typeRoles } from "./styles.ts";
import { icon } from "./icons.ts";
import { px } from "./util.ts";

const W = 1440;

async function page(title: string, intro: string, parts: SceneNode[], width: number = W): Promise<FrameNode> {
  return box({ name: title, dir: "column", gap: "space.2xl", px: "space.3xl", py: "space.3xl", w: width, fill: "fill.surface.default" }, [await box({ name: "Header", dir: "column", gap: "space.sm" }, [await text(title, "display.md", "text.default"), await text(intro, "body.lg", "text.muted", { w: 900 })]), ...parts]);
}

const hex = (v: unknown) => String(v).toUpperCase();

export async function buildCover(stats: { components: number; patterns: number; variables: number; icons: number; modes: number }): Promise<FrameNode> {
  const stat = async (n: number, label: string) => box({ name: label, dir: "column", gap: "space.2xs" }, [await text(String(n), "title.lg", "text.inverse"), await text(label, "body.md", "text.inverse")]);
  const cover = await box({ name: "Cover", dir: "column", main: "between", px: "space.3xl", py: "space.3xl", w: 1920, h: 960, fill: "fill.neutral.default" }, [
    await box({ name: "Top", dir: "column", gap: "space.md" }, [await text("Leeward Design System", "display.lg", "text.inverse"), await text("An open-source, accessible design system for digital banking. Tokens, components and banking patterns, generated from the same source as the React package.", "title.xs", "text.inverse", { w: 1100 })]),
    await box({ name: "Stats", dir: "row", gap: "space.3xl" }, [await stat(stats.components, "components"), await stat(stats.patterns, "banking patterns"), await stat(stats.variables, stats.modes === 1 ? "variables" : `variables in ${stats.modes} modes`), await stat(stats.icons, "icons")]),
    await text("By Kemal Salih Carfi · MIT license · github.com/kscarfi/leeward-design-system", "body.md", "text.inverse"),
  ]);
  return cover;
}

export async function buildGettingStarted(): Promise<FrameNode> {
  const step = async (n: string, title: string, body: string) => fillParent(await box({ name: title, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.lg", fill: "fill.surface.canvas", stroke: "border.subtle" }, [await text(n, "title.md", "text.primary"), await text(title, "heading.h4", "text.default"), await text(body, "body.md", "text.muted", { w: "fill" })]));
  const result = await page("Getting started", "This file is generated from the Leeward repository, so names and values match the code one to one.", [
    await box({ name: "Steps", dir: "row", gap: "space.md", w: "fill", cross: "start" }, [
      await step("1", "Pick a brand and mode", "Select a frame, then in the right panel under Layer choose the Leeward collection mode: Leeward Light, Leeward Dark, Business Light or Business Dark. Everything inside follows."),
      await step("2", "Use components, not copies", "Insert components from the Assets panel and set their properties. Detaching breaks the link to the variables and to future updates."),
      await step("3", "Use variables for anything custom", "Fill, stroke, gap, padding and radius pickers show only the variables that fit, because each variable has scopes. Primitives are hidden on purpose."),
      await step("4", "Hand off with names", "Every variable shows its CSS name in Dev Mode, for example var(--lw-fill-primary-default), the same name the React package uses."),
    ]),
    await box({ name: "Rules", dir: "column", gap: "space.sm", w: "fill" }, [
      await text("Rules that keep designs and code in sync", "title.sm", "text.default"),
      ...(await Promise.all(
        [
          "Never use color alone for meaning. Status needs a word or an icon too.",
          "Every interactive element has a 44 by 44 px target, even when it looks smaller.",
          "Money always shows an explicit sign and follows the locale: ₺1.250,00 in Turkish, TRY 1,250.00 in English.",
          "One primary button per screen. Destructive actions use the danger variant and say what they do.",
          "Text contrast is checked for every pair in every mode. If a combination is missing, ask before inventing one.",
        ].map(async (rule) => box({ name: "Rule", dir: "row", gap: "space.xs", w: "fill" }, [icon("check-circle", "icon-size.md", "icon.success", "bold"), await text(rule, "body.md", "text.default", { w: "fill" })])),
      )),
    ]),
  ]);
  // Step cards share the height of the tallest one.
  const steps = result.findChild((n) => n.name === "Steps") as FrameNode | null;
  for (const card of steps?.children ?? []) (card as FrameNode).layoutSizingVertical = "FILL";
  return result;
}

/** Semantic colors as rows: swatch, name, CSS variable and the value in each mode. */
export async function buildColors(): Promise<FrameNode> {
  const groups = ["fill", "text", "icon", "border", "amount"];
  const colorNames = Object.keys(light).filter((k) => light[k]!.type === "color" && groups.includes(k.split(".")[0]!) && !k.includes("-alpha"));
  const sections: FrameNode[] = [];
  for (const group of groups) {
    const names = colorNames.filter((n) => n.startsWith(`${group}.`));
    const rows = await Promise.all(
      names.map(async (name) => {
        const swatch = rect({ name: "Swatch", w: 48, h: 32, radius: "radius.sm", fill: name, stroke: "border.subtle" });
        const values = await Promise.all(modes.map(async (m) => box({ name: m.name, dir: "row", w: 130 }, [await text(hex(m.tokens[name]?.value ?? light[name]!.value), "code", "text.muted")])));
        return box({ name, dir: "row", cross: "center", gap: "space.md", py: "space.2xs", w: "fill" }, [swatch, await box({ name: "Name", dir: "column", w: 360 }, [await text(name.replace(/\./g, "/"), "label.sm", "text.default"), await text(light[name]!.cssVar, "code", "text.subtle")]), ...values]);
      }),
    );
    const head = await box({ name: "Columns", dir: "row", gap: "space.md", w: "fill" }, [await box({ name: "Pad", dir: "none", w: 48, h: 1 }), await box({ name: "Token", dir: "row", w: 360 }, [await text("Token", "label.xs", "text.muted")]), ...(await Promise.all(modes.map(async (m) => box({ name: m.name, dir: "row", w: 130 }, [await text(m.name, "label.xs", "text.muted")]))))]);
    sections.push(await box({ name: group, dir: "column", gap: "space.xs", w: "fill" }, [await text(`${group[0]!.toUpperCase()}${group.slice(1)} (${names.length})`, "title.sm", "text.default"), head, ...rows]));
  }
  const columns = await box({ name: "Groups", dir: "row", wrap: true, gap: "space.3xl", w: "fill" }, sections);
  for (const section of sections) section.layoutSizingHorizontal = "HUG";
  return page("Color", "Semantic colors are what you use. Each is a variable with four modes. The contrast resolver in the token build checks 1,336 text and UI pairs against WCAG 2.2 AA in every mode, so any documented pair is safe.", [columns], 2300);
}

export async function buildPrimitives(): Promise<FrameNode> {
  const rows = await Promise.all(
    Object.entries(ramps).map(async ([ramp, steps]) => {
      const chips = await Promise.all(
        Object.entries(steps).map(async ([stepName, value]) => {
          const swatch = rect({ name: stepName, w: 72, h: 48, radius: "radius.sm" });
          swatch.fills = [primitivePaint(`${ramp}.${stepName}`)];
          return box({ name: `${ramp}/${stepName}`, dir: "column", gap: "space.3xs", w: 72 }, [swatch, await text(stepName, "label.xs", "text.default"), await text(String(value).toUpperCase(), "caption", "text.muted")]);
        }),
      );
      return box({ name: ramp, dir: "column", gap: "space.xs", w: "fill" }, [await text(ramp, "title.xs", "text.default"), await box({ name: "Steps", dir: "row", wrap: true, gap: "space.xs", w: "fill" }, chips)]);
    }),
  );
  return page("Primitive palette", "The raw OKLCH ramps behind the semantic colors. They are hidden from the pickers: design with semantic variables, which change with brand and mode.", rows);
}

export async function buildTypography(): Promise<FrameNode> {
  const rows = await Promise.all(
    typeRoles().map(async (role) => {
      const style = textStyles.get(role)!;
      const size = light[`type.${role}.size`]!.value;
      const lh = light[`type.${role}.line-height`]?.value;
      const weight = light[`type.${role}.weight`]?.value;
      const sample = role.startsWith("amount") ? "₺24.580,35" : role === "code" ? "TR33 0006 1005 1978 6457 8413 26" : role.startsWith("display") || role.startsWith("title") ? "Steady money, whatever the weather" : "Your money arrives in seconds.";
      return box({ name: role, dir: "row", cross: "center", gap: "space.xl", py: "space.md", w: "fill", stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, [await box({ name: "Meta", dir: "column", gap: "space.3xs", w: 240 }, [await text(style.name, "label.md", "text.default"), await text(`${px(size)} / ${lh === undefined ? "" : px(lh)} px · ${weight ?? ""}`, "code", "text.muted", { w: "fill" }), await text(`--lw-type-${role.replace(".", "-")}-*`, "code", "text.subtle", { w: "fill" })]), fillParent(await text(sample, role, "text.default", { w: "fill" }))]);
    }),
  );
  return page("Typography", "Plus Jakarta Sans for everything, IBM Plex Mono for codes and IBANs. Display and title sizes are fluid in code; the styles use the desktop size. Amount styles use tabular numbers so columns line up.", rows);
}

export async function buildSpacing(): Promise<FrameNode> {
  const spaces = Object.keys(light).filter((k) => /^space\.[a-z0-9-]+$/.test(k) && k !== "space.none");
  const rows = await Promise.all(spaces.map(async (name) => box({ name, dir: "row", cross: "center", gap: "space.lg", w: "fill" }, [await box({ name: "Name", dir: "column", w: 240 }, [await text(name, "label.sm", "text.default"), await text(String(light[name]!.value), "code", "text.muted")]), rect({ name: "Bar", w: name, h: 16, fill: "fill.primary.default", radius: "radius.xs" })])));
  const radii = Object.keys(light).filter((k) => k.startsWith("radius."));
  const radiusTiles = await Promise.all(radii.map(async (name) => box({ name, dir: "column", gap: "space.xs", cross: "center", w: 120 }, [rect({ name: "Shape", w: 80, h: 80, radius: name, fill: "fill.primary.weak", stroke: "border.primary" }), await text(name, "label.sm", "text.default"), await text(String(light[name]!.value), "code", "text.muted")])));
  const elevations = [...effectStyles.entries()];
  const elevationTiles = await Promise.all(elevations.map(async ([key, style]) => {
    const card = await box({ name: "Card", dir: "none", w: 120, h: 80, radius: "radius.lg", fill: "fill.surface.raised" });
    await card.setEffectStyleIdAsync(style.id);
    return box({ name: key, dir: "column", gap: "space.sm", cross: "center", w: 160 }, [card, await text(style.name, "label.sm", "text.default")]);
  }));
  return page("Space, radius and elevation", "Spacing follows a 4 px base. Radius tokens are semantic: controls, cards and dialogs each have their own. Elevation is a shadow scale plus focus rings.", [
    await box({ name: "Space", dir: "column", gap: "space.sm", w: "fill" }, [await text("Space", "title.sm", "text.default"), ...rows]),
    await box({ name: "Radius", dir: "column", gap: "space.md", w: "fill" }, [await text("Radius", "title.sm", "text.default"), await box({ name: "Tiles", dir: "row", wrap: true, gap: "space.lg", w: "fill" }, radiusTiles)]),
    await box({ name: "Elevation", dir: "column", gap: "space.md", w: "fill", px: "space.lg", py: "space.lg", fill: "fill.surface.canvas", radius: "radius.lg" }, [await text("Elevation", "title.sm", "text.default"), await box({ name: "Tiles", dir: "row", wrap: true, gap: "space.xl", w: "fill" }, elevationTiles)]),
  ]);
}

export async function buildLayout(): Promise<FrameNode> {
  const devices = [
    { name: "Phone", w: 390, cols: "grid.columns.phone", gutter: "grid.gutter.phone", margin: "grid.margin.phone" },
    { name: "Tablet", w: 768, cols: "grid.columns.tablet", gutter: "grid.gutter.tablet", margin: "grid.margin.tablet" },
  ];
  const tiles = await Promise.all(
    devices.map(async (d) => {
      const n = Number(light[d.cols]?.value ?? 4);
      const g = parseFloat(String(light[d.gutter]?.value ?? "1")) * 16;
      const m = parseFloat(String(light[d.margin]?.value ?? "1")) * 16;
      const frame = figma.createFrame();
      frame.name = `${d.name} grid`;
      frame.resize(d.w, 240);
      frame.fills = [paint("fill.surface.canvas")];
      frame.layoutGrids = [{ pattern: "COLUMNS", alignment: "STRETCH", count: n, gutterSize: g, offset: m, visible: true, color: { r: 0.31, g: 0.27, b: 0.9, a: 0.1 } }];
      return box({ name: d.name, dir: "column", gap: "space.sm" }, [await text(`${d.name}: ${n} columns, ${g} px gutter, ${m} px margin`, "label.md", "text.default"), frame]);
    }),
  );
  const bps = Object.keys(light).filter((k) => k.startsWith("breakpoint."));
  const bpRows = await Promise.all(bps.map(async (b) => box({ name: b, dir: "row", gap: "space.lg" }, [await text(b, "label.sm", "text.default", { w: 200 }), await text(String(light[b]!.value), "code", "text.muted")])));
  return page("Layout", "Column grids for phone and tablet as layout grids, and the breakpoints the components use. Content widths keep lines readable.", [await box({ name: "Grids", dir: "row", gap: "space.xl", cross: "start" }, tiles), await box({ name: "Breakpoints", dir: "column", gap: "space.xs" }, [await text("Breakpoints", "title.sm", "text.default"), ...bpRows])]);
}

/** Frames showing the same screen in every mode. */
export async function inModes(name: string, build: () => Promise<SceneNode>): Promise<FrameNode> {
  const tiles = await Promise.all(
    modes.filter((m) => library().modeIds[m.name]).map(async (m) => {
      const tile = await box({ name: m.name, dir: "column", gap: "space.sm", px: "space.lg", py: "space.lg", radius: "radius.xl", fill: "fill.surface.canvas" }, [await text(m.name, "label.sm", "text.muted"), await build()]);
      setMode(tile, m.name);
      return tile;
    }),
  );
  return box({ name, dir: "row", gap: "space.lg" }, tiles);
}


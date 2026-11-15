// Cover, getting started and foundations: color, typography, spacing, radius, elevation and layout.
// Every sample is bound to the variable or style it shows.
import { light, modes, ramps } from "./data.ts";
import { box, fillParent, paint, primitivePaint, rect, text } from "./dsl.ts";
import { docPage } from "./docs.ts";
import { textStyles, effectStyles, typeRoles } from "./styles.ts";
import { icon } from "./icons.ts";
import { px } from "./util.ts";

const W = 1440;

/** A foundations page: the shared _Doc header and _Doc footer around the content. */
async function page(title: string, intro: string, parts: SceneNode[], width: number = W): Promise<FrameNode> {
  return docPage({ section: "Foundations", title, description: intro, body: parts, width });
}

/** Leeward and Business values side by side, since dimensions follow the brand. */
const business = () => modes.find((m) => m.name.startsWith("Business"))?.tokens ?? light;
const shown = (v: unknown) => (typeof v === "number" ? String(v) : px(String(v)) >= 9999 ? "Full" : `${px(String(v))} px`);

/** Token | Leeward | Business | Usage, with a visual sample per row. */
async function tokenTable(names: string[], sample: (name: string) => Promise<SceneNode> | SceneNode): Promise<FrameNode> {
  // The usage column appears only when some token in the table has a description.
  const usage = names.some((n) => light[n]?.description);
  const titles = usage ? ["Token", "Leeward", "Business", "Usage", "Sample"] : ["Token", "Leeward", "Business", "Sample"];
  const widths = usage ? [300, 120, 120, 420, 312] : [360, 140, 140, 632];
  const header = await box({ name: "Header", dir: "row", w: "fill", fill: "fill.surface.bold" }, await Promise.all(titles.map(async (h, i) => box({ name: h, dir: "row", px: "space.sm", py: "space.xs", w: widths[i]! }, [await text(h, "label.sm", "text.muted")]))));
  const rows = await Promise.all(
    names.map(async (name) => {
      const t = light[name]!;
      const cells = [await text(t.cssVar, "code", "text.default", { w: "fill" }), await text(shown(t.value), "code", "text.muted"), await text(shown(business()[name]?.value ?? t.value), "code", "text.muted"), usage ? await text(t.description ?? "", "body.sm", "text.muted", { w: "fill" }) : null, await sample(name)].filter((c): c is SceneNode => c !== null);
      return box({ name, dir: "row", cross: "center", w: "fill", stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, await Promise.all(cells.map(async (c, i) => box({ name: "Cell", dir: "row", cross: "center", px: "space.sm", py: "space.xs", w: widths[i]! }, [c]))));
    }),
  );
  return box({ name: "Table", dir: "column", radius: "radius.lg", stroke: "border.subtle", fill: "fill.surface.default", clip: true }, [header, ...rows]);
}

/** "#4F46E5", or "#FFFFFF 96%" for colors with alpha, so every value fits its column. */
const hex = (v: unknown) => {
  const m = String(v).match(/rgba?\(([^)]+)\)/);
  if (!m) return String(v).toUpperCase();
  const [r, g, b, a = "1"] = m[1]!.split(",").map((x) => x.trim());
  const h = [r, g, b].map((x) => Number(x).toString(16).padStart(2, "0")).join("").toUpperCase();
  return `#${h} ${Math.round(Number(a) * 100)}%`;
};

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
      await step("1", "Pick a brand and mode", "Select a frame, then in the right panel under Layer set the Color mode (Leeward or Business, light or dark) and the Dimension mode (Leeward or Business). Everything inside follows."),
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
        const values = await Promise.all(modes.map(async (m) => box({ name: m.name, dir: "row", w: 150 }, [await text(hex(m.tokens[name]?.value ?? light[name]!.value), "code", "text.muted")])));
        return box({ name, dir: "row", cross: "center", gap: "space.md", py: "space.2xs", w: "fill" }, [swatch, await box({ name: "Name", dir: "column", w: 360 }, [await text(name.replace(/\./g, "/"), "label.sm", "text.default"), await text(light[name]!.cssVar, "code", "text.subtle")]), ...values]);
      }),
    );
    const head = await box({ name: "Columns", dir: "row", gap: "space.md", w: "fill" }, [await box({ name: "Pad", dir: "none", w: 48, h: 1 }), await box({ name: "Token", dir: "row", w: 360 }, [await text("Token", "label.xs", "text.muted")]), ...(await Promise.all(modes.map(async (m) => box({ name: m.name, dir: "row", w: 150 }, [await text(m.name, "label.xs", "text.muted")]))))]);
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
  const names = Object.keys(light).filter((k) => /^space\.([a-z0-9-]+|control\.[a-z]+)$/.test(k) && k !== "space.none");
  return page("Spacing", "Gaps and padding on a 4 px base. The scale is the same for both brands; Business has tighter control padding (space.control) for dense desktop screens, applied by the Dimension mode.", [await tokenTable(names, (name) => rect({ name: "Bar", w: name, h: 12, fill: "fill.primary.default", radius: "radius.xs" }))]);
}

export async function buildSize(): Promise<FrameNode> {
  const names = Object.keys(light).filter((k) => /^size\.(control|icon|avatar|touch-target)/.test(k));
  return page("Size", "Control heights, icon and avatar sizes, and the 44 px touch target every interactive element keeps.", [await tokenTable(names, (name) => rect({ name: "Box", w: name.startsWith("control") || name.includes("control") ? 120 : name, h: name, fill: "fill.primary.weak", stroke: "border.primary", radius: "radius.xs" }))]);
}

export async function buildRadius(): Promise<FrameNode> {
  const radii = Object.keys(light).filter((k) => k.startsWith("radius.") || k.startsWith("control.radius."));
  const borders = Object.keys(light).filter((k) => k.startsWith("size.border.") || k.startsWith("size.focus-ring."));
  return page("Radius and border", "Radius tokens are semantic: controls, cards and dialogs each have their own. Border widths cover strokes and focus rings.", [
    await box({ name: "Radius", dir: "column", gap: "space.md" }, [await text("Radius", "title.sm", "text.default"), await tokenTable(radii, (name) => rect({ name: "Shape", w: 64, h: 40, radius: name, fill: "fill.primary.weak", stroke: "border.primary" }))]),
    await box({ name: "Border", dir: "column", gap: "space.md" }, [await text("Border and focus ring", "title.sm", "text.default"), await tokenTable(borders, (name) => rect({ name: "Line", w: 120, h: name, fill: "border.default" }))]),
  ]);
}

export async function buildElevation(): Promise<FrameNode> {
  const rows = await Promise.all(
    [...effectStyles.values()].map(async (style) => {
      const sampleCard = await box({ name: "Sample", dir: "none", w: 120, h: 72, radius: "radius.lg", fill: "fill.surface.raised", clip: style.name.startsWith("Focus") });
      await sampleCard.setEffectStyleIdAsync(style.id);
      const params = style.effects
        .map((e) => {
          if (e.type !== "DROP_SHADOW" && e.type !== "INNER_SHADOW") return e.type;
          const color = e.boundVariables?.color ? "bound to a color variable" : `rgba(0, 0, 0, ${Math.round(e.color.a * 100) / 100})`;
          return `${e.type === "INNER_SHADOW" ? "Inner" : "Drop"} ${e.offset.x} ${e.offset.y} blur ${e.radius} spread ${e.spread ?? 0}, ${color}`;
        })
        .join("\n");
      return box({ name: style.name, dir: "row", cross: "center", gap: "space.xl", py: "space.lg", w: "fill", stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, [
        await box({ name: "Meta", dir: "column", gap: "space.3xs", w: 300 }, [await text(style.name, "label.md", "text.default"), await text(style.description, "body.sm", "text.muted", { w: "fill" })]),
        fillParent(await text(params, "code", "text.muted", { w: "fill" })),
        // The inverse ring is for dark surfaces, so it is shown on one.
        await box({ name: "Stage", dir: "row", main: "center", cross: "center", w: 200, h: 120, radius: "radius.lg", fill: style.name.includes("Inverse") ? "fill.neutral.default" : "fill.surface.canvas" }, [sampleCard]),
      ]);
    }),
  );
  return page("Elevation", "A shadow scale for surfaces and the focus rings. Focus rings are bound to color variables, so they follow the brand and theme; the gap between element and ring uses the surface color.", rows);
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
      // Layout grids do not show in exports or prototypes, so the columns are drawn too.
      const colW = (d.w - m * 2 - g * (n - 1)) / n;
      for (let i = 0; i < n; i++) {
        const col = rect({ name: `Column ${i + 1}`, w: Math.round(colW), h: 240, fill: "fill.primary.weak" });
        frame.appendChild(col);
        col.x = Math.round(m + i * (colW + g));
      }
      return box({ name: d.name, dir: "column", gap: "space.sm" }, [await text(`${d.name}: ${n} columns, ${g} px gutter, ${m} px margin`, "label.md", "text.default"), frame]);
    }),
  );
  const bps = Object.keys(light).filter((k) => k.startsWith("breakpoint."));
  const bpRows = await Promise.all(bps.map(async (b) => box({ name: b, dir: "row", gap: "space.lg" }, [await text(light[b]!.cssVar, "code", "text.default", { w: 260 }), await text(`${px(String(light[b]!.value))} px`, "code", "text.muted")])));
  return page("Layout", "Column grids for phone and tablet as layout grids, and the breakpoints the components use. Content widths keep lines readable.", [await box({ name: "Grids", dir: "row", gap: "space.xl", cross: "start" }, tiles), await box({ name: "Breakpoints", dir: "column", gap: "space.xs" }, [await text("Breakpoints", "title.sm", "text.default"), ...bpRows])]);
}

// The full Solar icon library: every icon as a component set with six styles, grouped by category.
// Vectors are bound to icon.default, so the library follows the brand and theme like everything else.
// Leeward's own icons (the Icons page) are a curated subset with names that describe their meaning.
import solar from "./solar.generated.json";
import { box, text } from "./dsl.ts";
import { docPage } from "./docs.ts";
import { recolor } from "./icons.ts";

const STYLES: Record<string, string> = { Linear: "Linear", Bold: "Bold", BoldDuotone: "Bold Duotone", LineDuotone: "Line Duotone", Broken: "Broken", Outline: "Outline" };
const library = solar as Record<string, Record<string, Record<string, string>>>;

const title = (category: string) => category.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
/** Lets Figma draw and stay responsive between categories. */
const breathe = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function styleComponent(markup: string, style: string): ComponentNode {
  const frame = figma.createNodeFromSvg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${markup}</svg>`);
  const component = figma.createComponent();
  component.name = `Style=${STYLES[style] ?? style}`;
  component.resize(24, 24);
  component.fills = [];
  for (const child of [...frame.children]) {
    component.appendChild(child);
    if ("constraints" in child) child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }
  frame.remove();
  recolor(component, "icon.default");
  return component;
}

export function solarCount(): number {
  return Object.values(library).reduce((n, icons) => n + Object.keys(icons).length, 0);
}

export async function buildSolarLibrary(page: PageNode): Promise<FrameNode> {
  const sections: FrameNode[] = [];
  for (const [category, icons] of Object.entries(library)) {
    figma.notify(`Leeward: Solar ${title(category)}…`, { timeout: 1500 });
    const sets: ComponentSetNode[] = [];
    for (const [name, styles] of Object.entries(icons)) {
      const variants = Object.keys(STYLES)
        .filter((s) => styles[s])
        .map((s) => styleComponent(styles[s]!, s));
      for (const v of variants) page.appendChild(v);
      const set = figma.combineAsVariants(variants, page);
      set.name = `${title(category)}/${name}`;
      set.layoutMode = "HORIZONTAL";
      set.itemSpacing = 8;
      set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 8;
      set.fills = [];
      sets.push(set);
    }
    const grid = await box({ name: "Grid", dir: "row", wrap: true, gap: "space.lg", w: 1600 });
    for (const set of sets) grid.appendChild(set);
    sections.push(await box({ name: title(category), dir: "column", gap: "space.md" }, [await text(`${title(category)} (${sets.length})`, "title.sm", "text.default"), grid]));
    await breathe();
  }
  const frame = await docPage({
    section: "Assets",
    title: "Solar library",
    description: `All ${solarCount()} Solar icons in six styles: Linear, Bold, Bold Duotone, Line Duotone, Broken and Outline. Use the Leeward icons for UI; take an icon from here when the curated set has nothing that fits, then add it to the code set so the name and meaning are shared.`,
    width: 1728,
    body: [await text("Solar Icons Set by 480 Design, licensed CC BY 4.0. Packaged by Hakim Saoudi (github.com/saoudi-h/solar-icons, MIT).", "body.sm", "text.muted"), ...sections],
  });
  page.appendChild(frame);
  return frame;
}

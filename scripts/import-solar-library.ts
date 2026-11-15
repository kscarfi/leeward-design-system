// Builds the full Solar icon library for the Figma builder plugin: every icon in all six styles.
// Icons: Solar Icons Set by 480 Design (CC BY 4.0), packaged by Hakim Saoudi (github.com/saoudi-h/solar-icons, MIT).
//
//   git clone --depth 1 --filter=blob:none --sparse https://github.com/saoudi-h/solar-icons.git /tmp/solar
//   git -C /tmp/solar sparse-checkout set packages/core/svgs
//   node scripts/import-solar-library.ts /tmp/solar/packages/core/svgs
//
// Writes packages/figma-plugin/src/solar.generated.json: { category: { icon: { Style: "<svg inner markup>" } } }.
// The React package keeps its own curated set (scripts/import-solar-icons.ts); this file only feeds Figma.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STYLES = ["Linear", "Bold", "BoldDuotone", "LineDuotone", "Broken", "Outline"];

/** Keeps only the shapes, rounds coordinates to one decimal and shortens the color. */
function compact(svg: string): string {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\d+\.\d)\d+/g, "$1")
    .replace(/(stroke|fill)="black"/g, '$1="#000"');
}

const root = process.argv[2];
if (!root || !existsSync(root)) {
  console.error("Pass the path to solar-icons/packages/core/svgs.");
  process.exit(1);
}

const library: Record<string, Record<string, Record<string, string>>> = {};
let count = 0;
for (const category of readdirSync(root).sort()) {
  if (!statSync(join(root, category)).isDirectory()) continue;
  for (const style of STYLES) {
    const dir = join(root, category, style);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith(".svg")) continue;
      const name = file.slice(0, -4);
      const icons = (library[category] ??= {});
      const styles = (icons[name] ??= {});
      if (!Object.keys(styles).length) count++;
      styles[style] = compact(readFileSync(join(dir, file), "utf8"));
    }
  }
}

const out = "packages/figma-plugin/src/solar.generated.json";
writeFileSync(out, JSON.stringify(library));
console.log(`Wrote ${count} icons in ${Object.keys(library).length} categories, ${STYLES.length} styles each, to ${out}.`);

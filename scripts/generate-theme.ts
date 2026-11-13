// Generates a partner theme from one seed color and refuses to write it if any required
// color pair misses WCAG 2.2 AA in light or dark mode.
//
//   pnpm theme:generate --name harbor --seed "#0E7490"
//   pnpm theme:generate --name sunny --seed "#FFD000" --pin-action   (uses the seed itself for buttons)
//
// Output: packages/tokens/partners/<name>.css for data-brand="<name>" in light and dark,
// plus a Markdown contrast report in docs/themes/.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { contrastOnWhite } from "@leeward/tokens/palette";
import { generatePartnerTheme, rampsFromPrimitives, type PartnerTheme } from "@leeward/tokens/partner";

const root = new URL("../", import.meta.url).pathname;

function report(theme: PartnerTheme): string {
  const rows = theme.results.map((r) => `| ${r.theme} | \`${r.fg}\` | \`${r.bg}\` | ${r.min}:1 | ${r.wcag.toFixed(2)}:1 | ${r.pass ? "Pass" : "**Fail**"} |`);
  return [
    `# Partner theme: ${theme.name}`,
    "",
    `Generated from \`${theme.seed}\` (${contrastOnWhite(theme.seed).toFixed(2)}:1 on white, pinned at step ${theme.seedStep}).`,
    "",
    "## Ramp",
    "",
    "| Step | Hex | Contrast on white |",
    "|---|---|---|",
    ...Object.entries(theme.ramp).map(([step, hex]) => `| ${step} | ${hex} | ${contrastOnWhite(hex).toFixed(2)}:1 |`),
    "",
    `## Contrast: ${theme.results.length} pairs, ${theme.failures.length} failures`,
    "",
    "| Theme | Foreground | Background | Min | WCAG | Result |",
    "|---|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}

if (import.meta.main) {
  const { values } = parseArgs({ options: { name: { type: "string" }, seed: { type: "string" }, "pin-action": { type: "boolean", default: false } } });
  if (!values.name || !values.seed) {
    console.error('Usage: pnpm theme:generate --name <name> --seed "#RRGGBB" [--pin-action]');
    process.exit(2);
  }
  const started = performance.now();
  const ramps = rampsFromPrimitives(JSON.parse(readFileSync(`${root}packages/tokens/src/primitive/color.json`, "utf8")));
  const theme = generatePartnerTheme({ name: values.name, seed: values.seed, pinAction: values["pin-action"], ramps });
  const ms = Math.round(performance.now() - started);
  console.log(`Seed ${theme.seed} pinned at step ${theme.seedStep}. Ramp: ${Object.values(theme.ramp).join(" ")}`);
  console.log(`Checked ${theme.results.length} pairs in light and dark in ${ms} ms.`);
  if (theme.failures.length > 0) {
    for (const f of theme.failures) console.error(`FAIL [${f.theme}] ${f.fg} on ${f.bg}: ${f.wcag.toFixed(2)}:1`);
    console.error(`\nTheme "${theme.name}" not written: ${theme.failures.length} pair(s) miss WCAG 2.2 AA.`);
    process.exit(1);
  }
  mkdirSync(`${root}packages/tokens/partners`, { recursive: true });
  mkdirSync(`${root}docs/themes`, { recursive: true });
  writeFileSync(`${root}packages/tokens/partners/${theme.name}.css`, theme.css);
  writeFileSync(`${root}docs/themes/${theme.name}.md`, report(theme));
  console.log(`Wrote packages/tokens/partners/${theme.name}.css and docs/themes/${theme.name}.md. Use data-brand="${theme.name}" with data-theme="light" or "dark".`);
}

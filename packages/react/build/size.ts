// Measures what an app ships: builds the package, then bundles small apps against it with Vite,
// minified and tree-shaken, and reports raw and gzip sizes. React and React DOM are left out because
// every app already has them; Radix is counted because Leeward brings it in.
// Run: pnpm size
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const pkg = new URL("..", import.meta.url).pathname;
const tokens = join(pkg, "../tokens/dist/css");
execFileSync("pnpm", ["run", "build:pkg"], { cwd: pkg, stdio: "ignore" });

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
const sizes = (code: string | Buffer) => ({ raw: Buffer.byteLength(code), gzip: gzipSync(code).length });

const exportsOf = Object.keys(await import(join(pkg, "dist/index.js"))).filter((name) => /^[A-Z]/.test(name));
const apps: Record<string, string> = {
  "Button only": `import { Button } from "${join(pkg, "dist/index.js")}"; export default Button;`,
  "Button, TextField, Dialog": `import { Button, TextField, Dialog } from "${join(pkg, "dist/index.js")}"; export default [Button, TextField, Dialog];`,
  [`Everything (${exportsOf.length} exports)`]: `import * as all from "${join(pkg, "dist/index.js")}"; export default all;`,
};

const work = mkdtempSync(join(tmpdir(), "leeward-size-"));
const rows: string[] = [];
try {
  for (const [label, source] of Object.entries(apps)) {
    const entry = join(work, "entry.js");
    writeFileSync(entry, source);
    const out = join(work, "out");
    await build({
      logLevel: "silent",
      configFile: false,
      build: {
        outDir: out,
        emptyOutDir: true,
        minify: true,
        lib: { entry, formats: ["es"], fileName: "app" },
        rolldownOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/] },
      },
    });
    const js = readdirSync(out).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(out, f)));
    const s = sizes(Buffer.concat(js));
    rows.push(`| ${label} | JS | ${kb(s.raw)} | ${kb(s.gzip)} |`);
  }
  const css = sizes(readFileSync(join(pkg, "dist/styles.css")));
  rows.push(`| \`@leeward/react/styles.css\`: base and component styles | CSS | ${kb(css.raw)} | ${kb(css.gzip)} |`);
  // styles.css imports @leeward/tokens/css: both brands, light and dark.
  const t = sizes(readFileSync(join(tokens, "tokens.css")));
  rows.push(`| \`@leeward/tokens/css\`: every token for Leeward and Business, light and dark | CSS | ${kb(t.raw)} | ${kb(t.gzip)} |`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log("| What an app imports | Type | Minified | Gzip |\n|---|---|---|---|\n" + rows.join("\n"));

// tsc rewrites relative ".ts" imports to ".js" in emitted JavaScript, but not in .d.ts files.
// Published declarations must point at files that exist in the package, so this fixes them.
// Usage: node scripts/rewrite-dts-imports.ts <dir>
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Pass the folder with .d.ts files");

function walk(path: string): string[] {
  return readdirSync(path).flatMap((name) => {
    const full = join(path, name);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith(".d.ts") ? [full] : [];
  });
}

let changed = 0;
for (const file of walk(dir)) {
  const source = readFileSync(file, "utf8");
  const next = source.replace(/(from\s+|import\(\s*)(["'])(\.{1,2}\/[^"']+?)\.tsx?\2/g, "$1$2$3.js$2");
  if (next !== source) {
    writeFileSync(file, next);
    changed++;
  }
}
console.log(`Rewrote imports in ${changed} declaration files under ${dir}.`);

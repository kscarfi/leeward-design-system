// Every relative link in the repository's Markdown files points at a file that exists.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "*.md", "*.mdx"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter((f) => f && existsSync(join(root, f)) && !f.startsWith("apps/demo/runs/"));

const broken: string[] = [];
let checked = 0;
for (const file of files) {
  const text = readFileSync(join(root, file), "utf8").replace(/```[\s\S]*?```/g, "");
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1]!;
    if (/^(https?:|mailto:|#|\?path=)/.test(target)) continue;
    checked++;
    const path = join(root, dirname(file), decodeURIComponent(target.split("#")[0]!));
    if (!existsSync(path)) broken.push(`${file}: ${target}`);
  }
}
if (broken.length) {
  console.error(`Broken links (${broken.length}):\n${broken.join("\n")}`);
  process.exit(1);
}
console.log(`All ${checked} relative links in ${files.length} Markdown files resolve.`);

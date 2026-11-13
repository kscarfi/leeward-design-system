// Fails if any tracked text file contains an em dash (U+2014).
// Copy rule from PROJECT_BRIEF.md, section 2: never use em dashes.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const EM_DASH = "—";
const TEXT_FILE = /\.(md|mdx|txt|ts|tsx|js|mjs|cjs|json|css|yml|yaml|html)$/;

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  encoding: "utf8",
})
  .split("\n")
  // Skip files deleted in the working tree but still in the index.
  // Demo outputs in apps/demo/runs are kept exactly as the agent wrote them, so they are measured, not fixed.
  .filter((file) => TEXT_FILE.test(file) && file !== "scripts/check-copy.ts" && !file.startsWith("apps/demo/runs/") && existsSync(file));

const failures: string[] = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (line.includes(EM_DASH)) failures.push(`${file}:${index + 1}: ${line.trim()}`);
  });
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} em dash(es). Use a comma, colon or period instead.\n`);
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Copy check passed: ${files.length} files, no em dashes.`);

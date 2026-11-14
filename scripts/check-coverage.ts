// Every component and pattern ships with docs, stories with interaction tests, and unit tests.
import { readdirSync, readFileSync, existsSync } from "node:fs";

const src = new URL("../packages/react/src/", import.meta.url).pathname;
const tests = ["components/components.test.tsx", "components/new-components.test.tsx", "patterns/patterns.test.tsx"].map((f) => readFileSync(src + f, "utf8")).join("\n");
const index = readFileSync(src + "index.ts", "utf8");
const problems: string[] = [];
let count = 0;
for (const kind of ["components", "patterns"]) {
  for (const name of readdirSync(src + kind)) {
    const dir = `${src}${kind}/${name}`;
    if (!existsSync(`${dir}/${name}.tsx`)) continue;
    if (name === "Field") continue; // internal building block
    count++;
    const exported = name === "Toast" ? "ToastProvider" : name; // Toast ships as ToastProvider and useToast
    if (!new RegExp(`export \\{[^}]*\\b${exported}\\b`).test(index)) problems.push(`${name}: not exported from index.ts`);
    if (!existsSync(`${dir}/${name}.docs.md`)) problems.push(`${name}: missing ${name}.docs.md`);
    const stories = `${dir}/${name}.stories.tsx`;
    if (!existsSync(stories)) problems.push(`${name}: missing stories`);
    else {
      const s = readFileSync(stories, "utf8");
      if (!s.includes("play:")) problems.push(`${name}: stories have no interaction test`);
      if (!s.includes("docsDescription(docsMd)")) problems.push(`${name}: stories do not show the docs page`);
    }
    if (!new RegExp(`\\b${name}\\b`).test(tests)) problems.push(`${name}: no unit test`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`All ${count} components and patterns have docs, stories with interaction tests, and unit tests.`);

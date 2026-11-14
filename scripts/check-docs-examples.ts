// Type-checks every code example in the component docs, so the examples people and agents
// copy always compile against the real component API. Run: pnpm check:examples
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const src = `${root}packages/react/src/`;
const out = `${root}apps/docs/.examples/`;
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let count = 0;
for (const kind of ["components", "patterns"]) {
  for (const dir of readdirSync(`${src}${kind}`)) {
    let md: string;
    try {
      md = readFileSync(`${src}${kind}/${dir}/${dir}.docs.md`, "utf8");
    } catch {
      continue;
    }
    const blocks = [...md.matchAll(/```tsx\n([\s\S]*?)```/g)].map((m) => m[1]!);
    blocks.forEach((code, i) => {
      writeFileSync(`${out}${dir}-${i + 1}.tsx`, `// From ${kind}/${dir}/${dir}.docs.md, example ${i + 1}\n${code}`);
      count++;
    });
  }
}
// Screen recipes for people and agents (docs/recipes) compile against the same API.
for (const file of readdirSync(`${root}docs/recipes`)) {
  if (!file.endsWith(".tsx")) continue;
  writeFileSync(`${out}recipe-${file}`, readFileSync(`${root}docs/recipes/${file}`, "utf8"));
  count++;
}
writeFileSync(
  `${out}tsconfig.json`,
  JSON.stringify({ extends: "../../../tsconfig.base.json", compilerOptions: { types: ["vite/client", "node"], allowImportingTsExtensions: true, noUnusedLocals: false }, include: ["*.tsx", "../../../packages/react/src/css-modules.d.ts"] }, null, 2),
);
try {
  execFileSync(`${root}node_modules/.bin/tsc`, ["-p", `${out}tsconfig.json`], { stdio: "inherit", cwd: `${root}apps/docs` });
  console.log(`All ${count} documentation examples and recipes compile.`);
} catch {
  console.error(`Some of the ${count} documentation examples do not compile. Fix the docs.md files above.`);
  process.exit(1);
} finally {
  rmSync(out, { recursive: true, force: true });
}

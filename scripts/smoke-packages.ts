// Packs every package exactly as npm would publish it, installs the tarballs into a clean
// project outside the workspace with plain npm, and checks what a user would do with them:
// type check and build a React app, use the tokens in Node, run the lint rules, start the MCP server.
// Run: pnpm smoke:packages
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const work = mkdtempSync(join(tmpdir(), "leeward-smoke-"));
const packs = join(work, "packs");
const app = join(work, "app");

const run = (cmd: string, args: string[], cwd: string) => execFileSync(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, NPM_CONFIG_UPDATE_NOTIFIER: "false" } });
const runOutput = (cmd: string, args: string[], cwd: string) => {
  try {
    return execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string };
    return `${e.stdout ?? ""}${e.stderr ?? ""}`;
  }
};

try {
  for (const name of ["tokens", "react", "lint", "mcp-server"]) run("pnpm", ["pack", "--pack-destination", packs], join(root, "packages", name));
  const tarball = (name: string) => `file:${join(packs, readdirSync(packs).find((f) => f.startsWith(`leeward-${name}-`))!)}`;

  cpSync(join(root, "scripts/package-smoke"), app, { recursive: true });
  const pin = (name: string) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version as string;
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify(
      {
        name: "leeward-package-smoke",
        private: true,
        type: "module",
        dependencies: { "@leeward/react": tarball("react"), "@leeward/tokens": tarball("tokens"), react: "19.3.1", "react-dom": "19.3.1" },
        devDependencies: {
          "@leeward/lint": tarball("lint"),
          "@leeward/mcp-server": tarball("mcp-server"),
          "@modelcontextprotocol/client": "2.4.0",
          "@types/react": "19.3.0",
          "@types/react-dom": "19.2.3",
          "@vitejs/plugin-react": "6.3.0",
          eslint: pin("eslint"),
          stylelint: pin("stylelint"),
          typescript: pin("typescript"),
          vite: "8.3.8",
        },
        // The tarball, not the registry, must satisfy @leeward/react's dependency on @leeward/tokens.
        overrides: { "@leeward/tokens": tarball("tokens") },
      },
      null,
      2,
    ),
  );

  run("npm", ["install", "--no-audit", "--no-fund"], app);
  run("npx", ["tsc", "--noEmit"], app);
  console.log("react: types ok (skipLibCheck off, so the published declarations are checked too)");
  run("npx", ["vite", "build", "--logLevel", "error"], app);
  const css = readdirSync(join(app, "dist/assets")).find((f) => f.endsWith(".css"))!;
  if (!readFileSync(join(app, "dist/assets", css), "utf8").includes("--lw-fill-primary-default")) throw new Error("Built app CSS has no Leeward tokens");
  console.log("react: build ok, styles include tokens and components");

  run("node", ["node-test.mjs"], app);

  const eslint = runOutput("npx", ["eslint", "lintcase"], app);
  const stylelint = runOutput("npx", ["stylelint", "lintcase/*.css"], app);
  for (const rule of ["leeward/no-raw-color", "leeward/known-token", "leeward/no-icon-only-money-action"]) if (!eslint.includes(rule)) throw new Error(`ESLint did not report ${rule}:\n${eslint}`);
  for (const rule of ["leeward/no-raw-color", "leeward/spacing-scale", "leeward/known-token"]) if (!stylelint.includes(rule)) throw new Error(`Stylelint did not report ${rule}:\n${stylelint}`);
  console.log("lint: ok (ESLint and Stylelint report every planted problem)");

  run("node", ["mcp-test.mjs"], app);
  console.log("\nAll packages work when installed from their tarballs.");
} finally {
  if (!process.env.KEEP_SMOKE) rmSync(work, { recursive: true, force: true });
}

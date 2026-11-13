// Runs the demo with Claude Code in headless mode, the same way for both runs.
//
//   pnpm --filter @leeward/demo run-demo            # both runs
//   pnpm --filter @leeward/demo run-demo -- --only a
//
// Each run starts in a fresh empty folder outside the repo, with user settings, plugins and
// MCP servers switched off. The only difference: Run B gets the Leeward MCP server and DESIGN.md.
// Output and the full transcript are copied into runs/<id>/ unchanged.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

const demo = new URL("../", import.meta.url).pathname;
const repo = new URL("../../../", import.meta.url).pathname;
const { values } = parseArgs({
  options: {
    only: { type: "string" },
    model: { type: "string", default: "claude-opus-5-5" },
    claude: { type: "string", default: process.env.CLAUDE_BIN ?? "claude" },
  },
});

const promptFile = readFileSync(`${demo}PROMPT.md`, "utf8");
const prompt = promptFile.split("\n---\n")[1]!.trim();
const runBLine = promptFile.match(/Run B adds one line at the end: "([^"]+)"/)![1]!;

interface Run {
  id: "a-without-system" | "b-with-system";
  key: "a" | "b";
  prompt: string;
  withSystem: boolean;
}

const runs: Run[] = [
  { id: "a-without-system", key: "a", prompt, withSystem: false },
  { id: "b-with-system", key: "b", prompt: `${prompt}\n\n${runBLine}`, withSystem: true },
];

for (const run of runs.filter((r) => !values.only || r.key === values.only)) {
  const cwd = mkdtempSync(join(tmpdir(), `leeward-${run.key}-`));
  const args = ["-p", run.prompt, "--model", values.model!, "--output-format", "stream-json", "--verbose", "--setting-sources", "local", "--strict-mcp-config", "--permission-mode", "acceptEdits"];
  const tools = ["Read", "Write", "Edit", "Glob", "Grep"];
  if (run.withSystem) {
    copyFileSync(`${repo}DESIGN.md`, join(cwd, "DESIGN.md"));
    const mcp = join(cwd, "mcp.json");
    writeFileSync(mcp, JSON.stringify({ mcpServers: { leeward: { command: "node", args: [`${repo}packages/mcp-server/src/index.ts`] } } }, null, 2));
    args.push("--mcp-config", mcp);
    tools.push("mcp__leeward");
  }
  args.push("--allowedTools", tools.join(","));

  console.log(`\n${run.id}: running in ${cwd}`);
  const started = Date.now();
  const result = spawnSync(values.claude!, args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const seconds = Math.round((Date.now() - started) / 1000);

  const out = `${demo}runs/${run.id}/`;
  mkdirSync(out, { recursive: true });
  writeFileSync(`${out}transcript.jsonl`, result.stdout ?? "");
  const final = (result.stdout ?? "").trim().split("\n").map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean).find((m) => m.type === "result");
  const produced = join(cwd, "TransferScreen.tsx");
  const ok = existsSync(produced);
  if (ok) copyFileSync(produced, `${out}TransferScreen.tsx`);

  writeFileSync(
    `${out}RUN.md`,
    [
      `# ${run.id}`,
      "",
      `- Agent: Claude Code ${spawnSync(values.claude!, ["--version"], { encoding: "utf8" }).stdout.trim()}, headless (\`-p\`)`,
      `- Model: ${values.model}`,
      `- Date: ${new Date().toISOString()}`,
      `- Wall time: ${seconds} s`,
      `- Turns: ${final?.num_turns ?? "n/a"}`,
      `- Cost reported by Claude Code: ${final?.total_cost_usd != null ? `$${final.total_cost_usd.toFixed(2)}` : "n/a"}`,
      `- Context: ${run.withSystem ? "Leeward MCP server and DESIGN.md in the working folder" : "empty folder, no MCP servers"}`,
      "- Settings: user settings, plugins and other MCP servers off (`--setting-sources local --strict-mcp-config`)",
      "- Follow-up messages: none",
      `- Produced TransferScreen.tsx: ${ok ? "yes, copied unchanged" : "no"}`,
      `- Exit code: ${result.status}`,
      "",
      "The full transcript, including every tool call, is in `transcript.jsonl`.",
      "",
    ].join("\n"),
  );
  console.log(`${run.id}: ${ok ? "saved" : "no TransferScreen.tsx produced"} in ${seconds} s`);
  if (result.status !== 0) console.error(result.stderr);
}

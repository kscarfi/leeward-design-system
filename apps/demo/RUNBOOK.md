# Runbook: same prompt, two results

The point of this demo is honesty. Outputs are saved exactly as the agent wrote them. Nobody edits them to make the comparison look better.

## Run A: without the design system

1. Start a fresh agent session in an empty folder outside this repo, so the agent cannot read Leeward files.
2. No MCP servers connected. No DESIGN.md.
3. Paste the prompt from `PROMPT.md` (without the Run B line).
4. Copy the produced `TransferScreen.tsx` unchanged into `runs/a-without-system/`.
5. Record in `runs/a-without-system/RUN.md`: agent and model, date, time taken, number of turns, any follow-up messages (target: none).

## Run B: with the design system

1. Start a fresh agent session in this repo's `apps/demo` folder.
2. Connect the MCP server: `claude mcp add leeward -- node "<repo>/packages/mcp-server/src/index.ts"`.
3. Paste the prompt from `PROMPT.md` including the Run B line.
4. Copy the produced `TransferScreen.tsx` unchanged into `runs/b-with-system/`.
5. Record the same facts in `runs/b-with-system/RUN.md`.

## Compare

```bash
pnpm --filter @leeward/demo compare
```

This renders both screens in Chromium, runs axe (including color contrast), runs the `validate_ui` checks and counts lines of code. It writes `COMPARISON.md`. View both side by side with:

```bash
pnpm --filter @leeward/demo dev
```

## Rules

- Same agent, same model, same prompt text for both runs.
- One attempt per run. If a run fails to compile, that is the result: record it.
- If a dependency is missing for Run A (for example a CSS framework), install it in `apps/demo` and record that in `RUN.md`. Do not change the code.

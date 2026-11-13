# Runbook: same prompt, two results

The point of this demo is honesty. Outputs are saved exactly as the agent wrote them. Nobody edits them to make the comparison look better.

## Run both with one command

The agent is Claude Code (decided by Kemal). The runner gives both runs identical conditions:

- a fresh empty folder outside this repo, so the agent cannot read Leeward files
- the same model and the same prompt text from `PROMPT.md`
- user settings, plugins and other MCP servers switched off
- one attempt, no follow-up messages

The only difference: Run B gets the Leeward MCP server and a copy of `DESIGN.md` in its folder, and the extra prompt line.

```bash
pnpm --filter @leeward/demo run-demo
```

If `claude` is not on your PATH, point to it with `CLAUDE_BIN`. Claude Code must be logged in (`claude`, then `/login`) because headless mode cannot log in by itself.

Each run writes to `runs/<id>/`: `TransferScreen.tsx` unchanged, `transcript.jsonl` with every tool call, and `RUN.md` with model, time, turns and cost.

## Compare

```bash
pnpm --filter @leeward/demo compare
```

This renders both screens in Chromium, runs axe (including color contrast), runs the `validate_ui` checks and counts lines of code. It writes `COMPARISON.md`. View both side by side with:

```bash
pnpm --filter @leeward/demo dev
```

## Rules

- One attempt per run. If a run fails to compile, that is the result: record it.
- If a dependency is missing for Run A (for example a CSS framework), install it in `apps/demo` and record that in `RUN.md`. Do not change the code.

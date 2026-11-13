# Build log

The evidence for this project. Updated at the end of every task.

- **Time spent** is measured during the session.
- **Estimated time without AI** is Kemal's estimate only. It is never filled in by the AI.

## Log

| Date | Task | What AI did | What Kemal decided or corrected | Time spent | Estimated time without AI | Notes |
|---|---|---|---|---|---|---|
| 2026-11-13 | Day 1: read brief, plan | Read the brief, wrote a 5-point summary, listed blocking decisions, proposed the Day 1 plan | Approved the plan. Repo name: `leeward-design-system`. Repo stays private until done, then goes public. Seed palette kept. Hosting, demo agent and Business accent deferred. | _Kemal to confirm_ | _Kemal_ | Brief file renamed to `PROJECT_BRIEF.md` to match its own references |
| 2026-11-13 | Day 1: monorepo and tooling | Checked current pnpm and TypeScript docs, set up pnpm 12 workspaces, strict TS 7 base config, 6 package skeletons | | _Kemal to confirm_ | _Kemal_ | See ADR 0002 |
| 2026-11-13 | Day 1: docs and governance skeleton | Wrote CLAUDE.md, README draft, LICENSE, ADR 0001 (tokens) and 0002 (tooling), PR template with accessibility checklist, CI workflow, em dash check script | | _Kemal to confirm_ | _Kemal_ | README headline is a draft until Kemal approves |

## AI mistakes

| Date | What was wrong | How it was caught | How it was fixed |
|---|---|---|---|
| 2026-11-13 | Tried to install pnpm globally with `npm install -g` without checking write access to the global prefix | The command failed with a permissions error | Installed pnpm through Corepack into a user directory instead, and pinned the version with `packageManager` |
| 2026-11-13 | Assumed the Corepack pnpm shim would be on `PATH`, so root scripts that call `pnpm -r` failed locally | `pnpm typecheck` failed with `pnpm: command not found` | Added the shim directory to `PATH` for the session. README tells contributors to run `corepack enable pnpm`. CI is not affected because `pnpm/action-setup` puts pnpm on `PATH`. |

## Day summaries

### Day 1: Foundations

To be filled at the Day 1 checkpoint.

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

| 2026-11-13 | Tokens, themes, components, patterns, governance | OKLCH ramps, light and dark themes, CSS/TS/Figma outputs, contrast gate (208 pairs, 0 failures), 20 components and 5 patterns with stories, docs and tests, ESLint and Stylelint rules, visual regression, CI | Asked to build everything without day gates, and delegated color, type and dark mode choices | _Kemal to confirm_ | _Kemal_ | See ADR 0003 |
| 2026-11-13 | Agent layer, partner themes, demo scaffold, README | Manifest from component source and docs, DESIGN.md and llms.txt from one guidelines source, MCP server on SDK v2 with 5 tools and tests, partner theme generator with AA gate and live Storybook page, demo prompt, runbook and comparison script, README with numbers from scripts | | _Kemal to confirm_ | _Kemal_ | Demo runs wait for Kemal's choice of agent |

## AI mistakes

| Date | What was wrong | How it was caught | How it was fixed |
|---|---|---|---|
| 2026-11-13 | Tried to install pnpm globally with `npm install -g` without checking write access to the global prefix | The command failed with a permissions error | Installed pnpm through Corepack into a user directory instead, and pinned the version with `packageManager` |
| 2026-11-13 | Assumed the Corepack pnpm shim would be on `PATH`, so root scripts that call `pnpm -r` failed locally | `pnpm typecheck` failed with `pnpm: command not found` | Added the shim directory to `PATH` for the session. README tells contributors to run `corepack enable pnpm`. CI is not affected because `pnpm/action-setup` puts pnpm on `PATH`. |

| 2026-11-13 | Chose TypeScript 7 on Day 1 without checking lint tool support | typescript-eslint peer range `<6.1.0` | Moved to TypeScript 6.0.3, ADR 0002 updated |
| 2026-11-13 | Dark mode tertiary text and control borders missed AA on the overlay surface | Contrast script failed 3 pairs | Moved those tokens one step lighter |
| 2026-11-13 | Loading Button hid its label with `visibility: hidden`, so it had no accessible name | axe in Storybook tests | Switched to `opacity: 0` |
| 2026-11-13 | OTPInput `maxLength` cut "482 913" pasted from an SMS to 5 digits | Story interaction test | Removed `maxLength`, digits are sliced after stripping spaces |
| 2026-11-13 | TransactionRow used an `aria-label` that did not contain the visible text (WCAG 2.5.3) | axe `label-content-name-mismatch` | Name now comes from a hidden sentence that starts with the merchant |
| 2026-11-13 | A Style Dictionary transitive transform ran twice, making every spacing and size token 16 times too small. All tests and the contrast gate still passed. | Looking at the visual regression screenshots | Fixed the transform and added a token output test that compares compiled sizes to the source |
| 2026-11-13 | Committed twice while a check in the same command had failed, because the command used `;` instead of `&&` | Reading the command output after the commit | Fixed in the next commit each time (copy check, em dash escape) |
| 2026-11-13 | The validator's money rule flagged "Send ₺250", a button label the guidelines recommend | Its own unit test on clean code | The rule now flags only text that is nothing but an amount |
| 2026-11-13 | First drafted the MCP server for SDK v1 | Checking the official docs before writing code: v2 is the current stable line | Built on `@modelcontextprotocol/server` 2.4.0 |

## Day summaries

### Day 1: Foundations

To be filled at the Day 1 checkpoint.

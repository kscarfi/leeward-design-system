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
| 2026-11-13 | Demo runs | Ran Run A and Run B with Claude Code headless under identical conditions, measured both with axe and validate_ui | Chose Claude Code as the demo agent, logged in to the CLI | _Kemal to confirm_ | _Kemal_ | Run A 333 s, Run B 240 s (from RUN.md) |
| 2026-11-13 | v2: token source, brands, icons, new components | Built Leeward's token source, built brands x modes with a contrast resolver, dark mode from step mirroring, Plus Jakarta Sans after checking 10 OFL fonts for the lira sign and tabular figures, 142 Solar icons, 12 new components and 2 new patterns, responsive sizes, v1 compatibility layer | Supplied the color and token values and the Solar icon source, asked for multi-brand, accessible, responsive and a better font | _Kemal to confirm_ | _Kemal_ | See ADR 0005 |

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
| 2026-11-13 | Started researching the MCP SDK from the v1 docs, the version I knew | The v1 README says v2 is now the current stable line | Built on `@modelcontextprotocol/server` 2.4.0 |
| 2026-11-13 | The comparison undercounted Run A: raw colors were counted once per string (1 instead of 17), CSS inside strings was not checked for spacing (0 instead of 38), and Run A's own `--lw-` variables were reported as 73 unknown Leeward tokens | Reading Run A's source after the first comparison looked wrong | Count every match, check CSS in strings, treat variables the code defines as its own. Applied to both runs, with tests |
| 2026-11-13 | The validator flagged 2 inputs in Run A as unlabelled, but they were wrapped in `<label>` | Checking each finding by hand against the source | Implicit labels are now accepted, with a test |
| 2026-11-13 | The first demo host loaded Leeward CSS for both runs, which would have restyled Run A | Reviewing the host before the comparison | Run A renders on a plain page, Run B with the setup DESIGN.md asks for |
| 2026-11-13 | The first resolver run reported 75 to 86 adjustments per theme: two pairs on the attention fill wanted opposite text colors and the resolver flipped back and forth | Reading the adjustment list, which repeated the same steps | Fixed an inconsistency in the source mapping (white on yellow) and made tokens never return to a step they left. Real adjustments: 8 to 12 tokens per theme |
| 2026-11-13 | Primitive and semantic radius tokens collided (`radius.none`, `radius.pill`), the same mistake as in v1 | Style Dictionary reported a circular reference | Primitives are now `radii`, as in the source |
| 2026-11-13 | Visual check screenshots showed the old system | All three brand screenshots were identical | Playwright reused a preview server still serving the old build. Stopped it and recaptured |
| 2026-11-13 | The partner generator read the token source files with `node:fs`, so the live Storybook page broke | Story test failed to import | The template is written to `dist/semantic-template.json` and passed in as data |
| 2026-11-13 | Dark mode alerts used the mirrored dark end of each ramp, which read rust red and loud | Looking at dark screenshots | Soft role fills in dark are an OKLab mix of the role color into the surface |
| 2026-11-13 | The token rename would have broken any code written against v1, including the recorded demo | Checking Run B's variables against the new token list | Added `compat-v1.css` with every v1 name as an alias |

## Day summaries

### Day 1: Foundations

To be filled at the Day 1 checkpoint.

# Leeward Design System: Project Brief

> Read this whole file before doing anything. It is the single source of truth for this project.
> Owner: Kemal Salih Carfi (Lead Product Designer, Design Systems & DesignOps)
> Builder: Claude Code, working with Kemal

---

## 1. What this project is

Leeward Design System is an open-source, AI-ready design system for a fictional digital bank called **Leeward**. It is built from zero in 7 working days, in public, as a portfolio showcase.

It is **not a commercial product** and earns no money. Its only job is to prove, with evidence anyone can inspect, that Kemal can use AI as serious infrastructure for UI/UX work: faster, scalable, sustainable and of high quality.

### The one question this project answers

> When an AI agent (Claude Code, Cursor or similar) generates a banking screen, how do you guarantee it is on-brand, accessible and consistent?

Every decision in this repo should serve that answer.

### Success criteria

The project is done when all of these are true:

1. A public GitHub repo with an MIT license, a clear README and a working install.
2. Design tokens in DTCG format, compiled to CSS variables, TypeScript and a Figma-importable JSON.
3. 20 core components and 5 banking patterns, coded in React, documented, tested and accessible.
4. Light and dark themes, plus a **live multi-brand demo**: a new partner theme generated from one seed color.
5. Automated governance in CI: contrast checks, token lint, visual regression and accessibility tests.
6. An **agent-ready layer**: `DESIGN.md`, `llms.txt`, a machine-readable component manifest and an MCP server.
7. A recorded **"same prompt, two results"** demo: an agent builds the same screen without and with the system.
8. A complete build log with real time measurements and documented AI mistakes.

---

## 2. The brand: Leeward

All of this is fictional. Leeward is not a real company and must not resemble any real bank's branding.

### Name and story

In sailing, the *lee* is the side of the ship sheltered from the wind: the calm place you steer toward when the weather turns. Leeward brings that idea to banking: **however rough the world gets, your money sits on the sheltered side.** Calm, clear and protected, with every number and fee in plain sight.

- **Name:** Leeward
- **Tagline:** Steady money, whatever the weather.
- **Category:** Digital-only retail bank (with a business tier)
- **Market:** Türkiye first, built for international use (tr-TR and en-US)
- **Audience:** People aged 22 to 40 who manage money on their phone and distrust traditional banking jargon

### Brand principles (these also become design system principles)

| Principle | Meaning | Design consequence |
|---|---|---|
| **Clear over clever** | Plain language, no jargon | Labels describe outcomes; no icon-only actions for money movement |
| **Honest numbers** | Amounts, fees and rates are never hidden or styled down | Amounts use tabular figures; fees use the same text size as the amount they belong to |
| **Calm confidence** | Money is stressful; the interface is not | Restrained motion, no alarming red unless a real error, generous spacing |
| **Accessible by default** | Everyone can bank independently | WCAG 2.2 AA minimum everywhere, APCA reported, 44px touch targets |

### Voice

- Short, direct sentences. Second person ("you").
- Say what happens, not what the system does: "Your money arrives in seconds", not "Transfer request is being processed".
- Numbers always formatted for the locale: `₺1.250,00` in tr-TR, `TRY 1,250.00` in en-US.
- Never use em dashes in any copy, docs or UI text. Use commas, colons or periods.

### Visual direction (seeds, not final values)

The palette is chosen with color psychology in mind. Money creates anxiety, so the system pairs the trust of deep blue with warmth, and keeps alarm colors for real problems only.

| Role | Seed | Psychology | Contrast on white | Use |
|---|---|---|---|---|
| Ink (text, dark surfaces) | `#16163A` | Navy depth: security, seriousness, stability | 17.4:1 | All body text, dark mode surfaces |
| Brand primary: Iris | `#4C3FE0` | Blue for trust, a touch of violet for innovation and intelligence; modern without feeling like a traditional bank | 6.8:1 | Primary actions, links, focus |
| Accent: Coral | `#FF7A59` | Warmth and optimism; humanizes money and lowers stress | 2.6:1 | **Decorative only:** illustration, highlights, onboarding. Never text or the only signal of state |
| Accent text: Coral dark | `#C2410C` | Same warmth, readable | 5.2:1 | Rare emphasis text if needed |
| Positive: Teal | `#08745D` | Growth and balance; signals money coming in without the heavy "money green" look | 5.7:1 | Incoming amounts, success |
| Danger | `#C8283E` | Urgency; used sparingly so it keeps its meaning | 5.5:1 | Real errors and irreversible actions only |
| Warning | `#B45309` | Caution without panic | 5.0:1 | Limits, pending states |
| Background: Mist | `#F6F6FB` | Cool, calm, clean; reduces visual noise | n/a | App background |

Rules that follow from the psychology:

- Outgoing amounts are **not red**. Red for every payment makes normal spending feel like a failure. Outgoing amounts use Ink with a minus sign; incoming use Teal with a plus sign.
- Danger and Iris have similar lightness, so state is never carried by color alone: always pair with an icon and text.
- Coral appears in small doses. If it covers more than about 10% of a screen it stops feeling warm and starts feeling loud.
- Validate every pair with the contrast script; these seeds are a starting point, not a guarantee.

Kemal may replace these seeds with a palette exported from **ColorsMine** (his own tool, DTCG export). If he does, use his export as the source and keep the same semantic role names.

**Typography** (Google Fonts, OFL licensed):

- Display: **Inter Tight** (600, 700)
- Text: **Inter** (400, 500, 600)
- Numbers: Inter with `font-variant-numeric: tabular-nums` for every amount, balance and table column
- Type scale: modular, around 1.2 ratio, 12px minimum for any visible text

**Shape and space:**

- 4px base spacing grid
- Radius scale: 4, 8, 12, 16, full
- Elevation: 3 levels max, soft and low contrast

---

## 3. Tech stack

Use the **latest stable version** of each tool. Check the official docs before installing; do not rely on memory for APIs or config formats.

| Area | Choice |
|---|---|
| Package manager | pnpm workspaces (monorepo) |
| Language | TypeScript, strict mode |
| UI | React (latest stable) |
| Accessible primitives | Radix UI primitives where a component needs complex behavior (dialog, tabs, tooltip, select) |
| Styling | CSS custom properties generated from tokens + CSS Modules. No hardcoded colors or spacing in components |
| Tokens | DTCG JSON as source, compiled with Style Dictionary |
| Docs and playground | Storybook |
| Unit and interaction tests | Vitest + Testing Library |
| Accessibility tests | axe-core (via Storybook test runner or Playwright) |
| Visual regression | Playwright screenshots |
| Lint and governance | ESLint + Stylelint with custom rules forbidding raw hex values and off-scale spacing |
| CI | GitHub Actions |
| MCP server | Official TypeScript MCP SDK |
| Docs site hosting | Netlify or GitHub Pages (Kemal decides) |

Ask Kemal before adding any dependency that is not in this table.

---

## 4. Repository structure

```
leeward-design-system/
├── CLAUDE.md                  # Short pointer to this brief + working rules
├── PROJECT_BRIEF.md           # This file
├── README.md                  # Public face of the project
├── DESIGN.md                  # Agent-readable system summary (generated)
├── llms.txt                   # Entry point for AI tools (generated)
├── LICENSE                    # MIT
├── packages/
│   ├── tokens/                # DTCG source + Style Dictionary build
│   │   ├── src/               # color, typography, space, radius, elevation, motion
│   │   ├── themes/            # light, dark, business, partner (generated)
│   │   └── dist/              # css, ts, figma-variables.json
│   ├── react/                 # Component library
│   │   └── src/components/<Name>/  # Name.tsx, Name.module.css, Name.stories.tsx, Name.test.tsx, Name.docs.md
│   ├── lint/                  # ESLint + Stylelint governance rules
│   └── mcp-server/            # MCP server exposing tokens, components and rules
├── apps/
│   ├── docs/                  # Storybook
│   └── demo/                  # "Same prompt, two results" demo screens
├── scripts/
│   ├── contrast-report.ts     # WCAG 2.2 + APCA report for every token pair in use
│   ├── generate-theme.ts      # New partner theme from one seed color
│   ├── build-manifest.ts      # components.manifest.json from component source + docs
│   └── build-agent-docs.ts    # DESIGN.md + llms.txt
└── docs/
    ├── build-log.md           # Daily time log + AI mistakes (see section 8)
    ├── decisions/             # Short ADRs for every non-obvious decision
    └── media/                 # Screenshots and recordings for LinkedIn
```

---

## 5. Scope

### 5.1 Tokens

Three tiers, named consistently:

1. **Primitive:** raw ramps (`color.iris.600`, `space.4`)
2. **Semantic:** meaning (`color.text.primary`, `color.surface.raised`, `color.action.primary.bg`)
3. **Component:** only where truly needed (`button.primary.bg`)

Components may only use semantic or component tokens, never primitives. This is enforced by lint.

Outputs: CSS variables per theme, typed TS object, `figma-variables.json` that Kemal imports into Figma.

### 5.2 Core components (20)

Priority order. Each one ships with: TSX, CSS Module, stories for every variant and state, tests, axe check and a `Name.docs.md` with usage rules.

1. Button (primary, secondary, ghost, danger; sizes; loading; disabled)
2. IconButton (requires `aria-label`)
3. Text and Heading
4. Icon (inline SVG set, stroke style, about 30 icons needed by the patterns)
5. TextField (label, hint, error, prefix/suffix)
6. Select
7. Checkbox
8. Radio group
9. Switch
10. Badge
11. Chip
12. Avatar
13. Card
14. ListItem
15. Tabs
16. Dialog
17. Toast
18. Tooltip
19. Skeleton
20. ProgressBar

### 5.3 Banking patterns (5)

These make the system feel like a real bank, not a generic kit:

1. **AmountDisplay:** locale-aware currency formatting, tabular figures, positive/negative states that do not rely on color alone
2. **BalanceHeader:** account balance with hide/show amount control
3. **TransactionRow:** merchant, category, date, amount; accessible as one readable sentence for screen readers
4. **AccountCard:** account type, masked IBAN, balance, quick actions
5. **OTPInput:** 6-digit one-time code with paste support, autofill hints and clear error states

### 5.4 Themes

- Light and dark for Leeward
- **Leeward Business:** same components, denser layout, different accent
- **Partner theme:** generated by `scripts/generate-theme.ts` from one seed color. The script builds ramps in OKLCH, maps semantic roles and **fails if any required pair misses WCAG 2.2 AA**. This powers the Day 7 live demo.

### 5.5 Governance

- `contrast-report.ts` runs in CI and writes a Markdown report.
- Lint rules: no raw hex/rgb, no px values off the spacing scale, no primitive tokens in components.
- Visual regression on every component story.
- axe runs on every story; any violation fails CI.
- A PR template with an accessibility checklist.

### 5.6 Agent-ready layer

This is the core of the showcase.

- **`components.manifest.json`:** for every component: name, import path, props with types, variants, do and don't rules, accessibility requirements, a minimal correct example.
- **`DESIGN.md`:** human and agent readable summary: principles, token usage rules, component list with one-line purpose, layout rules, copy rules (including "no em dashes").
- **`llms.txt`:** short index pointing agents to DESIGN.md, the manifest and the docs.
- **MCP server** with these tools:
  - `get_tokens(theme?, category?)`
  - `get_component(name)`: props, rules and example from the manifest
  - `search_components(query)`
  - `get_guidelines(topic)`: for example "forms", "amounts", "errors"
  - `validate_ui(code)`: checks generated code for raw colors, unknown components, missing labels and returns fixes

### 5.7 The demo: "Same prompt, two results"

In `apps/demo/`:

- One fixed prompt, stored in `apps/demo/PROMPT.md`, for example: "Build a money transfer screen: choose a recipient, enter an amount, review fees, confirm with a one-time code."
- **Run A:** agent with no design system context. Save the output as-is.
- **Run B:** agent with the MCP server and DESIGN.md. Save the output as-is.
- A comparison page that renders both and lists measurable differences: raw colors used, contrast failures, axe violations, number of custom components invented, lines of code.
- Do not edit either output to make the comparison look better. Honesty is the point.

### Out of scope

- A real banking backend, real data or real authentication
- Native iOS/Android components
- Writing Figma components directly (Kemal builds the Figma side; the repo provides the variables JSON)
- Anything that imitates a real bank, including Tera Bank, Akbank or any other

---

## 6. Seven-day plan

Each day ends with a checkpoint: show Kemal what changed, update the build log, list screenshots captured for LinkedIn. **Do not start the next day without Kemal's approval.**

| Day | Goal | Definition of done | LinkedIn capture |
|---|---|---|---|
| **1** | Foundations | Monorepo, CI skeleton, principles in README, token architecture ADR, Day 1 build log | Repo structure, principles graphic |
| **2** | Tokens and themes | Primitive + semantic tokens, light/dark, Style Dictionary outputs, contrast report passing, Figma JSON | Token pipeline diagram, contrast report |
| **3** | Core components 1 to 10 | Built, stories, tests, axe passing | Storybook screen recording |
| **4** | Core components 11 to 20 + banking patterns | All 25 done, docs.md for each | AmountDisplay and TransactionRow close-ups |
| **5** | Governance | Lint rules, visual regression, PR template, CI green | A failing PR caught by CI, then fixed |
| **6** | Agent-ready layer | Manifest, DESIGN.md, llms.txt, MCP server with all 5 tools working | Agent calling `get_component` in a terminal |
| **7** | Proof | Partner theme generator, "same prompt, two results" demo, docs site deployed, final metrics | Side-by-side demo, live theme generation video |

If something takes longer, cut scope inside the day (fewer variants) rather than skipping governance or accessibility.

---

## 7. Working rules for Claude Code

1. **Plan first.** At the start of each day, write a short plan and wait for Kemal's OK.
2. **Decisions reserved for Kemal.** Ask before deciding any of these:
   - final colors, fonts or type scale
   - component API naming that affects many components
   - adding a dependency outside section 3
   - anything that will appear in a LinkedIn post or the README headline
3. **Small, meaningful commits.** Conventional commit messages (`feat(tokens): ...`, `fix(button): ...`).
4. **Accessibility is non-negotiable.** WCAG 2.2 AA. Every interactive element is reachable by keyboard and has a visible focus state and an accessible name. Never use color alone to carry meaning.
5. **No hardcoded values** in components. If a token is missing, propose one.
6. **No fabricated numbers.** Every metric in the README, docs or demo must come from the build log or a script output.
7. **Verify, do not assume.** Check current official docs for every tool before configuring it.
8. **Copy rules apply to everything you write:** clear, short, no em dashes, no hype words ("revolutionary", "seamless", "magic").
9. **Write an ADR** in `docs/decisions/` for any decision someone might later ask "why?" about.
10. **Keep `CLAUDE.md` short:** it should point to this brief and list the working rules only.

---

## 8. Build log (the evidence)

`docs/build-log.md` is the most important file for the showcase. Update it at the end of every task.

```markdown
| Date | Task | What AI did | What Kemal decided or corrected | Time spent | Estimated time without AI | Notes |
|---|---|---|---|---|---|---|
```

Rules:

- "Estimated time without AI" is Kemal's estimate. Ask him; never fill it in yourself.
- Record **AI mistakes** honestly in a separate section of the same file: what was wrong, how it was caught, how it was fixed. These become the most credible LinkedIn content.
- At the end of Day 7, produce a summary: total hours, estimated manual hours, number of components, test count, axe violations at the end (target: 0), contrast pairs checked.

---

## 9. README outline (public face)

1. One-line pitch: *An open-source, AI-ready design system for a fictional digital bank, built in 7 days.*
2. A hero image or GIF of the docs site
3. Why it exists (the one question from section 1)
4. What is inside (tokens, components, patterns, themes, governance, agent layer)
5. The "same prompt, two results" demo with screenshots
6. Use it with an AI agent (MCP setup in 3 steps)
7. Build log summary with real numbers
8. Toolchain: Claude Code, Figma, ColorsMine, Coverage Report, DesignOps.Tools
9. Credits: designed and directed by Kemal Salih Carfi, links to kscarfi.com and LinkedIn
10. License

---

## 10. Open decisions for Kemal

Answer these before or during Day 1:

1. Keep the seed palette above, or replace it with a ColorsMine export?
2. Repo name: `leeward-design-system` or something else?
3. Docs hosting: Netlify or GitHub Pages?
4. Public from Day 1 (build in public) or published on Day 7?
5. Which agent runs the demo: Claude Code, Cursor, or both?
6. Business theme accent color.

---

## 11. First message to send to Claude Code

> Read PROJECT_BRIEF.md fully. Then: (1) summarize the project in 5 bullet points so I can confirm you understood it, (2) list the open decisions from section 10 that block Day 1, (3) propose the Day 1 plan. Do not write any code until I approve the plan.

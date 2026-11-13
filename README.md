# Leeward Design System

<!-- DRAFT: headline needs Kemal's approval (PROJECT_BRIEF.md, section 7.2). -->
**An open-source, AI-ready design system for a fictional digital bank, built in 7 days.**

> Status: Day 1 of 7. Foundations only. Nothing here is ready to install yet.

<!-- Hero image or GIF of the docs site goes here on Day 7. -->

## Why it exists

When an AI agent (Claude Code, Cursor or similar) generates a banking screen, how do you guarantee it is on-brand, accessible and consistent?

This repo is one answer, built in public with every step measured in [the build log](docs/build-log.md).

## The brand

Leeward is a fictional digital-only bank. It is not a real company. In sailing, the lee is the side of the ship sheltered from the wind. Leeward brings that idea to money: however rough the world gets, your money sits on the sheltered side.

*Steady money, whatever the weather.*

## Principles

| Principle | What it means | What it changes in the UI |
|---|---|---|
| **Clear over clever** | Plain language, no jargon | Labels describe outcomes. No icon-only actions for moving money. |
| **Honest numbers** | Amounts, fees and rates are never hidden or styled down | Amounts use tabular figures. Fees use the same text size as the amount they belong to. |
| **Calm confidence** | Money is stressful. The interface is not. | Restrained motion. Red only for real errors. Generous spacing. |
| **Accessible by default** | Everyone can bank on their own | WCAG 2.2 AA minimum, APCA reported, 44px touch targets. |

## What is inside

| Area | Status |
|---|---|
| Design tokens (DTCG, CSS, TypeScript, Figma JSON) | Day 2 |
| 20 core components | Days 3 and 4 |
| 5 banking patterns | Day 4 |
| Themes: light, dark, Business, generated partner theme | Days 2 and 7 |
| Governance: contrast, lint, visual regression, axe in CI | Day 5 |
| Agent layer: DESIGN.md, llms.txt, manifest, MCP server | Day 6 |
| "Same prompt, two results" demo | Day 7 |

## Repository layout

```
packages/
  tokens/       DTCG source and Style Dictionary build
  react/        Components and banking patterns
  lint/         ESLint and Stylelint governance rules
  mcp-server/   MCP server for AI agents
apps/
  docs/         Storybook
  demo/         Same prompt, two results
scripts/        Contrast report, theme generator, manifest and agent docs builders
docs/
  build-log.md  Daily time log and AI mistakes
  decisions/    Architecture decision records
```

## Develop

Requires Node.js 24 or newer. pnpm is pinned in `package.json` and installed through Corepack.

```bash
corepack enable pnpm
pnpm install
pnpm typecheck
```

## Use it with an AI agent

Coming on Day 6.

## Build log

Real numbers land here at the end of Day 7. Until then, see [docs/build-log.md](docs/build-log.md).

## Toolchain

Claude Code, Figma, ColorsMine, Coverage Report, DesignOps.Tools.

## Credits

Designed and directed by Kemal Salih Carfi ([kscarfi.com](https://kscarfi.com)). Built with Claude Code.

## License

[MIT](LICENSE)

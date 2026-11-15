# Contributing to Leeward

Thank you for helping. This guide explains how the system is run, how to set up, and how to propose and ship a change.

## House rules

- **The system serves product teams.** A change goes in when more than one screen needs it. One-off needs stay in the product (see "Build it locally or contribute it" below).
- **Accessibility is not optional.** WCAG 2.2 AA in every brand and mode, keyboard support, visible focus, an accessible name, and never color alone.
- **Tokens, not values.** Components use semantic and component tokens only. Lint fails on raw colors, unknown tokens and off-scale spacing.
- **Docs ship with code.** A component is done when it has a docs page, stories with interaction tests, unit tests, and Turkish and English copy.
- **Decisions are written down.** Anything someone might later ask "why?" about gets an ADR in [docs/decisions](docs/decisions).

## Set up

```bash
corepack enable pnpm
```

```bash
pnpm install
```

```bash
pnpm storybook
```

Node.js 24 is used in CI (see `.nvmrc`).

## Build it locally or contribute it

| Situation | Do this |
|---|---|
| One screen needs a layout or a combination of existing components | Build it in the product from Leeward components and tokens. |
| A product needs a new variant of an existing component | Open a component proposal; until it ships, compose from existing parts rather than restyling the component. |
| Two or more products need the same new component | Open a component proposal; it belongs in the system. |
| A local library for one product area (vertical library) | Allowed. It must use Leeward tokens and components, pass the same lint rules, follow the Leeward release cycle and not restyle core components. |

## Propose a change

1. Search existing issues.
2. Open a **component proposal** (new component or variant) or a **bug report** from the [issue templates](https://github.com/kscarfi/leeward-design-system/issues/new/choose).
3. For a new component, the proposal needs: the problem, two or more places it is needed, how other systems solve it, the variants and states, keyboard and screen reader behavior, and the copy.
4. Wait for a "ready" label before writing code, so nobody builds something that will not be merged.

## Make the change

- Component folder: `Name.tsx`, `Name.module.css`, `Name.docs.md`, `Name.stories.tsx`; unit tests in the shared test files.
- Sizes and radii come from component tokens in `packages/tokens/build/foundation.ts`; add the component to `scripts/sync-docs-tokens.ts` so its docs get a token table.
- New copy goes into `packages/react/src/utils/messages.ts` in English and Turkish, following [the writing guide](docs/guides/writing.md).
- Add the component to the decision table in [AGENTS.md](AGENTS.md).
- Conventional commits: `feat(button): ...`, `fix(tokens): ...`, `docs: ...`.

## Before you open a pull request

```bash
pnpm build:tokens && pnpm build:agent
```

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm test:stories
```

```bash
pnpm check:copy && pnpm check:examples && pnpm check:coverage && pnpm contrast
```

The pull request template has an accessibility checklist. CI runs all of the above, a visual comparison of every story, a 360 px layout check and a clean install of the packages. Visual changes on purpose need new baselines: run the "Update visual baselines" workflow after review.

## Recognition

Every contributor is credited in the release notes of the version that ships their work.

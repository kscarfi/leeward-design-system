# 0001. Token architecture

- Status: Accepted
- Date: 2026-11-13
- Deciders: Kemal Salih Carfi

## Context

Leeward needs one source of design decisions that serves four readers: CSS in components, TypeScript in apps, Figma variables for design work and AI agents that generate screens. The source must support several themes (light, dark, Business, and partner themes generated from one seed color) without changing component code.

The central question of the project is how to keep agent-generated UI on-brand and accessible. Tokens are the first line of that answer: if an agent can only reach meaningful names, it cannot pick an off-brand color by accident.

## Decision

### Format

Tokens are written in the [Design Tokens Community Group (DTCG)](https://www.designtokens.org/) JSON format and compiled with Style Dictionary. The exact DTCG and Style Dictionary versions are checked against official docs on Day 2, before the build is configured.

### Three tiers

| Tier | Purpose | Example | Who may use it |
|---|---|---|---|
| **Primitive** | Raw values and ramps. No meaning. | `color.iris.600`, `space.4`, `radius.8` | Only semantic tokens |
| **Semantic** | Meaning and intent | `color.text.primary`, `color.surface.raised`, `color.action.primary.bg` | Components, patterns, apps |
| **Component** | A component-specific decision that no semantic token covers | `button.primary.bg` | Only that component |

Rules:

1. Components and patterns use semantic or component tokens only. Never primitives. Lint enforces this from Day 5.
2. A component token exists only when a component truly needs to diverge from the semantic layer. The default answer is "use the semantic token".
3. Component tokens reference semantic tokens, and semantic tokens reference primitives. Raw values live only in the primitive tier.

### Naming

- Dot-separated paths in source, lowercase, singular category first: `color`, `space`, `radius`, `elevation`, `motion`, `font`.
- Semantic names follow `category.role.variant.state`, for example `color.action.primary.bg.hover`.
- Ramps use numeric steps (`50` to `950`) so generated partner ramps share the same shape.
- CSS variables use the `--lw-` prefix and kebab case: `color.text.primary` becomes `--lw-color-text-primary`.

### Themes

- Primitives are shared. A theme is a different mapping from semantic names to primitives.
- Light is the default. Dark, Business and partner themes override semantic tokens only.
- Themes switch with a `data-theme` attribute on a container, so a demo page can show two themes side by side.
- Every theme must satisfy the same contrast pairs. The contrast script (Day 2) and the theme generator (Day 7) fail when a required pair misses WCAG 2.2 AA.

### Seed palette

Day 1 uses the seed palette in `PROJECT_BRIEF.md`, section 2, as decided by Kemal. Role names stay stable even if values change, so a later ColorsMine export can replace values without renaming tokens.

### Outputs

| Output | Path | Reader |
|---|---|---|
| CSS custom properties, one block per theme | `packages/tokens/dist/css/` | Components (CSS Modules) |
| Typed TS object | `packages/tokens/dist/ts/` | Apps, scripts, MCP server |
| `figma-variables.json` | `packages/tokens/dist/` | Kemal, imported into Figma |

## Consequences

- Changing a brand color is a one-line change in the primitive tier, and every theme stays checkable.
- New themes cost no component work.
- Agents get a small vocabulary of semantic names instead of hundreds of raw values. This is what the manifest and MCP server expose on Day 6.
- There is extra indirection. A developer has to look up two levels to find a final value. Storybook token pages (Day 3) and the TS output reduce that cost.
- Component tokens can grow without control. Rule 2 and code review keep them rare.

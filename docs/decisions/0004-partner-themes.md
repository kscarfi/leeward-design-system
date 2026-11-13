# 0004. Partner themes from one seed color

- Status: Accepted
- Date: 2026-11-13

## Context

The brief asks for a partner theme generated from one seed color that fails if any required pair misses WCAG 2.2 AA. A white-label partner usually arrives with one brand color and an expectation that their buttons use it exactly.

## Decision

- The generator reuses the Leeward pipeline: the same OKLCH ramp generator (`palette.ts`), the same semantic mapping (`themes.ts`) with the partner ramp as the brand, and the same 104 required pairs per mode (`contrast.ts`).
- Because ramp steps are defined by contrast against white, not by lightness, the semantic mapping holds for any seed. The seed is pinned exactly at the step with the nearest contrast, so the brand color appears unchanged in the ramp.
- A property test runs 200 pseudo-random seeds across the sRGB cube. All 200 pass every pair in light and dark.
- `--pin-action` forces the seed onto primary buttons. For a light seed such as `#FFD000` the check fails and the theme is not written. The generator says which pairs fail, so the conversation with the partner is about facts.
- Generation is a pure function (`packages/tokens/build/partner.ts`), so the same code runs in the CLI and in the Storybook "Partner generator" page for live demos. It takes about 30 ms.
- Partner themes override color tokens only. Space, type, radius and motion stay Leeward's.
- Output goes to `packages/tokens/partners/<name>.css` with `[data-theme="<name>"]` and `[data-theme="<name>-dark"]`. The example partner "Harbor" (`#0E7490`) is committed and every story test also runs in it in CI.

## Consequences

- A partner theme can never ship an inaccessible color mapping by accident.
- A brand that needs its exact color on buttons gets a clear "no" with the failing pairs, and can choose a darker variant from its own ramp.

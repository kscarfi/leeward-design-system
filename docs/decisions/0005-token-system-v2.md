# 0005. Token system v2: token source, brands and the contrast resolver

- Status: Accepted, replaces the color and type parts of ADR 0003
- Date: 2026-11-13
- Deciders: Kemal Salih Carfi

## Context

Kemal asked to bring Leeward to that level: richer palettes, complete tokens, more components, multi-brand, accessible, responsive, a better font than Inter, and Solar icons. Copying from it is allowed because he designed it.

## What the token source contains

- 26 primitive ramps with 14 steps (0 to 1000), plus alpha ramps. Most are Tailwind based; lapisBlue, purpleHaze, oceanBlue, coralRed, blueRibbon, richBlack and pumpkin are custom.
- 436 semantic colors: `fill`, `text`, `icon` and `border` for 8 roles (primary, secondary, neutral, info, success, warning, attention, danger) with intensities (default, emphasis, strong, subtle, subtler, subtlest, weak, on-*), plus disabled, inverse, focus rings and links.
- Spacing (0 to 80 px), a sizer for component heights (16 to 72 px), radii (0 to 32 px and pill), border widths, a major second type scale and 8 elevation levels.

## What we measured and fixed

| Issue in the first mapping | Measured | Fix |
|---|---|---|
| `text.subtle` on white | 3.8:1 | Resolver moves it one step darker |
| `text.placeholder` | 2.7:1 | Resolver |
| `text.success` (green 600) | 3.3:1 | Resolver moves to 700 |
| Link (cyan 600) | 3.7:1 | Resolver |
| Input border (`border.default`) | 1.5:1 | Resolver moves it until 3:1 (WCAG 1.4.11) |
| `fill.attention.on-default` white on yellow | 1.5:1 | Overridden to dark text, matching `text.attention-on-attention` |
| Medium and SemiBold text styles | exported at 400 | Weights set to 500 and 600 |
| 10 and 11 px text | below Leeward's 12 px minimum | Dropped from the scale |
| No dark mode | | Derived by mirroring steps, then resolved |
| Averta PE | commercial font | Plus Jakarta Sans (OFL) |
| Soft 4 px focus rings | below 3:1 | Kept as a halo, with a 2 px 3:1 outline as the real indicator |

## Decision

1. `packages/tokens/source/` holds Leeward's token source. `build/source.ts` reads it; primitives are generated from them.
2. The semantic template is the 436 semantic colors expressed as role and step. A **brand** picks a ramp per role, a roundness and a density (`build/brands.ts`). Leeward: indigo, violet, slate, blue, teal, pumpkin, yellow, red. Business: its own mapping, compact, tighter radii.
3. **Dark mode** mirrors each step (600 becomes 400, 50 becomes 975). Leeward's surface stack is explicit so surfaces get lighter as they rise. Soft role fills in dark are a low-ratio OKLab mix of the role color into the dark surface, because the mirrored dark end of vivid ramps reads loud and muddy.
4. The **contrast resolver** checks 334 required pairs per brand and mode. A failing token moves one ramp step at a time toward more contrast and never returns to a step it left. Every move is listed in `docs/contrast-report.md`. The build fails if a pair still misses AA.
5. **Typography**: Plus Jakarta Sans for display and text (checked: it has the lira sign, Turkish letters and tabular figures; most OFL candidates lacked the lira sign), IBM Plex Mono for codes. Roles follow Leeward's text styles. Display, title and large amount roles are fluid between 360 and 1280 px.
6. **Sizes**: control heights xs 32, sm 36, md 44, lg 48, xl 56 (compact brands step down). Every interactive element keeps a 44 px hit area.
7. **Icons**: Solar (CC BY 4.0), 142 curated icons in linear, bold and duotone, imported by `scripts/import-solar-icons.ts`.
8. v1 variable names stay available through `dist/css/compat-v1.css` while code migrates.

## Consequences

- A designer changing a ramp or a mapping in Figma re-exports, and the whole system, both modes and every brand, rebuilds with contrast guaranteed.
- New brands cost a few lines. Partner brands are generated from one color and refused if they fail.
- The resolver means the shipped mapping differs from the template in 8 to 12 tokens per brand and mode (measured on this build). The report says exactly where and why, so the template can be updated to match.

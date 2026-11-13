# 0003. Color ramps, dark mode and typography

- Status: Accepted
- Date: 2026-11-13
- Deciders: Kemal Salih Carfi (delegated the final values to Claude Code, will review)

## Context

Kemal kept the seed palette from the brief and asked for the best current practice in color and typography, including dark mode. Research covered OKLCH palette generation, dark mode surface and contrast practice, and Inter's OpenType and optical size features.

## Decision

### Ramps are generated in OKLCH and defined by contrast

- `packages/tokens/build/palette.ts` builds 11 steps (50 to 950) per hue in OKLCH. Hue stays constant, chroma tapers toward white and black and is clamped to sRGB.
- Each step is defined by its WCAG 2 contrast against white, not by a lightness number. Every ramp therefore has the same accessibility shape:

| Step | Contrast on white | Guarantee |
|---|---|---|
| 400 | 3.3:1 | Borders, icons and UI parts pass 3:1 on white and on Mist |
| 500 | 5.0:1 | Lightest step that passes AA for text on white and on Mist |
| 600 | 6.6:1 | Comfortable text and actions |
| 800 and darker | 12:1 and up | Carries light text at AAA |

- Seed colors are pinned exactly to the step with the nearest contrast (Iris at 600, Teal, Danger, Warning and Coral dark at 500, Coral at 400, Mist at ink 50, Ink at ink 950). The brief's colors appear unchanged in the output.
- Known exception: Coral at 400 is 2.57:1, below the 400 guarantee. Coral is decorative only (brief, section 2), so no semantic token uses it for text or state.
- The same generator builds partner themes from one seed, so any partner ramp has the same guarantees.

### Dark mode is its own mapping, not an inversion

- Surfaces come from a separate low-chroma `deep` ramp tinted with the Ink hue (OKLCH L 0.19 to 0.37). No pure black, which causes halation around light text.
- Elevation in dark mode comes from lighter surfaces (canvas, default, raised, overlay step up in lightness). Shadows stay but are secondary.
- Text is off-white (`ink.50`, the Mist seed), with secondary and tertiary tiers each checked against every surface they can sit on.
- Primary actions use a light brand step (`iris.300`) with dark text, as in Material 3 dark schemes. A saturated mid-tone with white text vibrates on dark surfaces and reads louder than the light theme.

### Contrast rules

- WCAG 2.2 AA is the pass/fail bar. It is the current legal baseline.
- APCA Lc is reported next to every pair as a perceptual check, mainly for dark mode, where WCAG 2 is known to be forgiving. Guidance used: text Lc 60, large text Lc 45, UI parts Lc 30.
- `scripts/contrast-report.ts` checks 104 required pairs per theme and fails CI on any AA miss. The first run caught three dark mode failures (tertiary text and control borders on the overlay surface), which were fixed by moving those tokens one step lighter.

### Typography

- **One family: Inter (variable, with the `opsz` optical size axis).** The brief proposed Inter Tight for display. Inter 4 ships a display optical size that the browser picks automatically from the font size (`font-optical-sizing: auto`). This gives tighter spacing and finer detail at large sizes, drawn by the type designer, from one font file. Inter Tight is the same design with tracking reduced uniformly, which is a coarser tool. This replaces Inter Tight and removes one font download.
- Weights: 400, 500, 600, 700.
- Scale: 12, 14, 16, 20, 24, 28, 32, 40, 48 px, about a 1.2 ratio, rounded so every line height sits on the 4 px grid (16 to 56).
- Sizes are emitted in `rem` so they follow the user's browser font setting.
- Tracking: 0 for body, -0.01em for small headings, -0.02em for large headings and amounts. Caption at 12 px gets +0.02em.
- Numbers: every amount, balance and table column uses `font-variant-numeric: tabular-nums`. IBANs also turn on slashed zero (`"zero"`) so 0 and O cannot be confused.

## Sources

- [OKLCH in CSS, Evil Martians](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Inter, rsms.me](https://rsms.me/inter/)
- [Dark mode decisions, idealo tech blog](https://medium.com/idealo-tech-blog/9-decisions-made-when-developing-a-unified-dark-mode-4a6fbfb96b28)
- [Dark mode UI best practices, Atmos](https://atmos.style/blog/dark-mode-ui-best-practices)

## Consequences

- Kemal can change any seed and every ramp, theme and contrast check updates in one build.
- Contrast is checked by a script, not trusted to the eye.
- Changing the display font away from Inter would need a new ADR, because the type roles assume optical sizing.

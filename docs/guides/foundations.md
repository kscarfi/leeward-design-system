# Foundations: how to use color, type, layout, elevation and motion

The values live in the tokens. This guide says how and when to use them.

## Color

- **Use semantic tokens only.** `--lw-fill-primary-default`, `--lw-text-muted`, `--lw-border-subtle`. Primitive ramps are not emitted as CSS; lint rejects raw colors and unknown tokens.
- **Layer, role, intensity.** `fill`, `text`, `icon`, `border` × `primary`, `secondary`, `neutral`, `info`, `success`, `warning`, `attention`, `danger` × `default`, `emphasis`, `strong`, `subtle`, `subtler`, `subtlest`, `weak`, `on-default`.
- **Interactive states** use the same role one step stronger: default, then `emphasis` on hover, then `strong` when pressed. Disabled uses `fill-disabled-default` and `text-subtler`.
- **Feedback colors** carry meaning: `success` (done), `warning` (needs attention soon), `attention` (look here), `danger` (error or irreversible). Outgoing money is never red.
- **Contrast.** 334 required pairs per brand and mode pass WCAG 2.2 AA (4.5:1 for text, 3:1 for large text, icons and control borders). The resolver adjusts tokens until they pass and lists every change in the contrast report.
- **Color blindness.** Color is never the only signal: states add an icon, a word or a change in weight. Success, warning, danger and info fills have almost the same lightness, so for someone with red-green color blindness they can look alike; that is why every status component pairs its color with an icon and a word.
- **Dark mode** is a full set of tokens, not an inversion: surfaces get lighter as they rise, soft fills are mixed into the dark surface, and every pair is checked again.
- **Accent** (`--lw-fill-accent-*`) is decorative only: under about 10 percent of a screen, never text, never a state.

## Typography

- **Roles, not sizes.** 34 roles (`display`, `title`, `subtitle`, `heading`, `body`, `label`, `button`, `amount`, `caption`, `badge`, `code`), each with size, line height, weight, tracking and family.
- **Scale.** A major second scale; display, title and large amount roles are fluid between 360 and 1280 px, so phones get smaller headings without breakpoints.
- **Readability.** Body text at 16 px with 1.5 line height; line length is limited by the content widths (`--lw-size-content-md` is 720 px). Headings use tighter line height and slight negative tracking.
- **Minimum size.** Nothing visible is smaller than 12 px (`caption`).
- **Zoom.** Sizes are in rem, so text follows the browser font size; layouts are tested to reflow at 360 px, which is what 200 percent zoom on a 720 px window looks like.
- **Grid relation.** Every fixed line height is a multiple of 4 px, and icon sizes match the line height of the text they sit next to.
- **Loading.** Fonts load with `display=swap` and fall back to the system sans-serif and monospace stacks, so text is readable before the web fonts arrive. Self-host the fonts in production for privacy and speed.

## Layout

- **Units.** Everything sits on a 4 px grid. Spacing tokens go from `--lw-space-3xs` (2 px) to `--lw-space-4xl` (80 px).
- **Spacing.** Use `space-xs` to `space-sm` inside components, `space-md` to `space-lg` between components, `space-xl` and up between sections. Stack gives you vertical and horizontal rhythm without writing margins.
- **Grid.** Phones use 4 columns, tablets 8 and desktops 12 (`--lw-grid-columns-*`), with gutters `--lw-grid-gutter-*` and page margins `--lw-grid-margin-*`.
- **Breakpoints.** `sm` 640, `md` 768, `lg` 1024, `xl` 1280 px. CSS cannot read variables in media queries, so the tokens are a reference: use the same numbers in your media queries. Phones are under `sm`, tablets from `sm` to `lg`, desktops from `lg`.
- **Content widths.** `--lw-size-content-sm` (480 px) for forms and flows, `-md` (720 px) for reading, `-lg` (1120 px) for dashboards.
- **Density.** Leeward is comfortable; Leeward Business is compact (controls one step shorter). Choose density with the brand, not per screen.
- **Touch.** Every interactive element has at least a 44 px hit area.

## Elevation and layers

- **Shadows.** Eight levels (`--lw-elevation-100` to `-800`). In the components: 100 for primary buttons and raised cards, 300 for the payment card, 500 for menus and popovers, 600 for toasts, 700 for dialogs and 800 for sheets.
- **Dark mode.** Shadows are weak on dark backgrounds, so each level also has a surface: `fill-surface-default`, `-raised`, `-overlay` get lighter as they rise.
- **Layers (z-index).** Use the layer tokens, never a raw number: `--lw-layer-base` 0, `-raised` 10, `-sticky` 100, `-overlay` 1000 (dialogs and sheets), `-toast` 1100, `-tooltip` 1200.

## Motion

- **Durations.** `instant` 100 ms (hover), `fast` 150 ms (small state changes), `base` 200 ms (menus), `slow` 300 ms (dialogs, sheets), `slower` 400 ms (large surfaces).
- **Easing.** `standard` for changes in place, `enter` for things that appear, `exit` for things that leave.
- **Reduced motion.** When the system asks for reduced motion, transitions become fades or are removed, and skeleton shimmer stops.
- Motion explains a change; it is never decoration. Money amounts never animate their digits.

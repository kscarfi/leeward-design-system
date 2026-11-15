# Leeward Figma builder

A development plugin that builds the Leeward Design System Figma file from this repository: the same tokens, icons and component manifest the React package uses.

## What it builds

- **Variables:** a hidden Primitives collection and a Leeward collection with four modes (Leeward and Business, light and dark). Component tokens alias the semantic token they come from, colors alias their primitive, and every variable shows its CSS name in Dev Mode.
- **Styles:** a text style for every type role and effect styles for elevation and focus rings.
- **Icons:** every icon as a component set with linear, bold and duotone weights.
- **Components and banking patterns:** each built from base parts. Base parts hold the states (for example `_OTPInput digit` has empty, hover, active, filled, error and disabled), and the published component is made of their instances. Names that start with `_` stay out of the published library.
- **Documentation:** a page per component with its base parts, variants, when to use, do and don't, accessibility, props and the default variant in every mode, plus foundation pages.

## Run it

1. Build it: `pnpm --filter @leeward/figma-plugin build`
2. In the Figma desktop app, open a new design file.
3. Plugins > Development > Import plugin from manifest, and choose `packages/figma-plugin/manifest.json`.
4. Plugins > Development > Leeward Design System builder.

Building takes about 15 minutes. Run it again in the same file to rebuild; it only touches files where every variable collection is one it made.

Variable modes need a paid Figma plan. On the Starter plan the builder makes Leeward Light only and says so in the build report next to the cover.

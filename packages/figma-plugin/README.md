# Leeward Figma builder

A development plugin that builds the Leeward Design System Figma file from this repository: the same tokens, icons and component manifest the React package uses.

## What it builds

- **Variables,** in collections split by what changes them: Color (Leeward and Business, light and dark), Dimension (space, size, radius and component sizes, per brand), Typography and Layout (one mode), and hidden Primitives. Tokens alias the token they come from, and every variable shows its CSS name in Dev Mode.
- **Styles:** a text style for every type role, bound to the typography variables, with weight and mono variations; effect styles for elevation and focus rings, with ring colors bound to variables.
- **Icons:** the 142 Leeward icons in linear, bold and duotone, and the full Solar library: 1,576 icons in six styles.
- **Components and banking patterns:** each built from base parts. Base parts hold the states (for example `_OTPInput digit` has empty, hover, active, filled, error and disabled), and the published component is made of their instances. Names that start with `_` stay out of the published library.
- **Documentation:** every frame uses the `_Doc header` and `_Doc footer` templates on the Helpers page. Each component page has frames side by side for the overview, base parts, labelled variants, usage and accessibility, props, and brands and modes. Foundations cover color, the primitive palette, typography, spacing, size, radius and border, elevation and layout.
- **Pages** grouped under FOUNDATIONS, COMPONENTS, BANKING PATTERNS and ASSETS, with dividers, then Helpers and a Playground.

## Run it

1. Build it: `pnpm --filter @leeward/figma-plugin build`
2. In the Figma desktop app, open a new design file.
3. Plugins > Development > Import plugin from manifest, and choose `packages/figma-plugin/manifest.json`.
4. Plugins > Development > Leeward Design System builder > Build everything.

Building everything takes about 30 minutes, most of it the Solar library. To rebuild after a change, use Build without the Solar library (faster): it keeps the Solar page and rebinds its colors. Either command only touches files where every variable collection is one it made.

The Solar data comes from `scripts/import-solar-library.ts`; the comment at its top says how to fetch the source.

Variable modes need a paid Figma plan. On the Starter plan the builder makes Leeward Light only and says so in the build report next to the cover.

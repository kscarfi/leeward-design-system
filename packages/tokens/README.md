# @leeward/tokens

Design tokens of the [Leeward Design System](https://github.com/kscarfi/leeward-design-system), designed by Kemal Salih Carfi. Every brand and mode, as CSS variables, typed TypeScript and Figma variables. Every required color pair passes WCAG 2.2 AA.

```bash
npm install @leeward/tokens
```

## CSS variables

```css
@import "@leeward/tokens/css";
```

Pick a brand and a mode on any element. They can be nested, and the closest one wins.

```html
<div data-brand="leeward" data-theme="light">...</div>
<div data-brand="business" data-theme="dark">...</div>
<div data-theme="auto">Follows the operating system</div>
```

Use only semantic variables: `--lw-fill-primary-default`, `--lw-text-default`, `--lw-space-md`, `--lw-control-height-md`, `--lw-radius-card`. Primitive ramps are not emitted as CSS, so they cannot be used by mistake.

## TypeScript

```ts
import { tokens, brands, modes, type TokenName } from "@leeward/tokens";

tokens.leeward.light["fill.primary.default"];
// { value: "#4f46e5", cssVar: "--lw-fill-primary-default", type: "color", ... }
```

## Other entry points

| Import | Contents |
|---|---|
| `@leeward/tokens/css` | All brands and modes in one file |
| `@leeward/tokens/css/leeward.light.css` | One brand and mode |
| `@leeward/tokens/tokens.json` | Leeward light as JSON |
| `@leeward/tokens/figma/*` | Figma variables (DTCG), one file per brand and mode |
| `@leeward/tokens/partner` | `generatePartnerTheme()`: a full brand from one color, refused if any required pair fails AA |
| `@leeward/tokens/palette`, `/contrast`, `/semantic` | The ramp generator, contrast checks and semantic resolver behind it |

## License

MIT. Primitive ramps partly based on the Tailwind CSS palette (MIT).

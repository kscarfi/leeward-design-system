# @leeward/lint

ESLint and Stylelint rules that keep code on the [Leeward Design System](https://github.com/kscarfi/leeward-design-system), designed by Kemal Salih Carfi.

```bash
npm install --save-dev @leeward/lint eslint stylelint
```

## ESLint (flat config)

```js
// eslint.config.mjs
import { recommended as leeward } from "@leeward/lint/eslint";

export default [leeward];
```

| Rule | Catches |
|---|---|
| `leeward/no-raw-color` | Hex, rgb or hsl colors in code |
| `leeward/known-token` | `--lw-` variables that do not exist, or primitive tokens |
| `leeward/no-icon-only-money-action` | Send, Pay or Transfer as an icon-only button |
| `leeward/no-outgoing-danger` | Outgoing money styled as an error |

## Stylelint

```js
// stylelint.config.mjs
import leeward from "@leeward/lint/stylelint";

export default leeward;
```

Adds `no-raw-color`, `known-token`, `spacing-scale`, `type-scale` and `composes-single-class`.

## License

MIT

# @leeward/mcp-server

MCP server that gives AI agents the Leeward design system: tokens, components, rules and a validator for the code they write.

## Tools

| Tool | What it returns |
|---|---|
| `get_tokens(brand?, mode?, category?)` | Semantic tokens with CSS variable, value and use. Brands: leeward, business. Modes: light, dark. Categories: fill, text, icon, border, focus-ring, amount, space, size, radius, type, elevation, motion, layer. |
| `get_component(name)` | Import, props with types, variants, sizes, do and don't rules, accessibility notes and a correct example. |
| `search_components(query)` | Components ranked for a need, for example "one-time code". |
| `get_guidelines(topic)` | Rules for workflow, principles, tokens, color, typography, amounts, forms, errors, layout, copy, accessibility, motion, dark-mode, or all. |
| `validate_ui(code)` | Issues in generated TSX with a fix for each: raw colors, unknown or primitive tokens, raw spacing, unknown components, missing labels, icon-only money actions, red amounts, hand-formatted money, em dashes. |

## Use it with Claude Code

Requires Node.js 20.10 or newer.

```bash
claude mcp add leeward -- npx -y @leeward/mcp-server
```

Then ask for a screen, for example: "Build a money transfer screen with the Leeward design system. Check your code with validate_ui."

Other MCP clients (Cursor and similar) use the same command over stdio: `npx -y @leeward/mcp-server`.

## From a clone of the repository

```bash
claude mcp add leeward -- node "$PWD/packages/mcp-server/src/index.ts"
```

## Data

The package ships `components.manifest.json` and depends on `@leeward/tokens`, so the server works offline. Both come from the same sources as the docs.

## License

MIT. Designed by Kemal Salih Carfi.

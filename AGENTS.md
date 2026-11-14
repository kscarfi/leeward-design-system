# AGENTS.md: building with the Leeward Design System

This guide is for AI agents (Claude Code, Cursor and similar) that design or build Leeward screens. Read it fully before you write code or produce a design. Leeward is a digital bank concept; its design system is designed and directed by Kemal Salih Carfi.

If something here conflicts with a component's own documentation, the component documentation wins for that component. If a decision is not covered anywhere, choose the calmer, plainer option and say what you assumed.

## 1. The ten rules

1. **Use Leeward components.** Never rebuild a button, field, list row, amount or dialog yourself. Find the right one first (section 4).
2. **Style only with semantic tokens.** `var(--lw-fill-…)`, `var(--lw-text-…)`, `var(--lw-space-…)` and so on. No hex, rgb, hsl or named colors. No raw px for spacing or type.
3. **Never use primitive tokens.** Names like `--lw-color-indigo-600` or `--lw-space-4` do not exist in CSS on purpose.
4. **Money goes through `AmountDisplay` or `formatAmount`.** Never `toFixed`, never string concatenation. Outgoing money is never red.
5. **Every input has a visible label.** Placeholders are not labels.
6. **Money movement needs a text button.** Never an icon-only Send, Pay or Transfer.
7. **One primary action per screen or section.** On phones it sits at the bottom, full width, size `xl`.
8. **State never relies on color alone.** Pair it with an icon and words. The components already do this; do not remove it.
9. **Write like Leeward.** Short sentences, second person, the outcome first. No em dashes. No hype words.
10. **Check your work.** Run `validate_ui` (MCP) or `pnpm lint`, and go through the checklist in section 12.

## 2. Where the knowledge lives

| Source | What it gives you | When to read it |
|---|---|---|
| MCP server `leeward` | Live answers: tokens, components, rules, validation | Always, when it is connected |
| `DESIGN.md` | Principles, token rules, layout, copy, component list, key color values | At the start of every task |
| `components.manifest.json` | Every component: props with types, variants, sizes, do and don't, accessibility, keyboard, a compiling example | Before using a component you have not used in this task |
| `docs/recipes/*.tsx` | Complete screens that compile: home, transfer, transaction details, settings, loading, empty and error states | Before building a similar screen |
| `packages/react/src/**/Name.docs.md` | The full page for each component, including its sizing and radius tokens | When you need detail beyond the manifest |
| Storybook | Every component in every brand and mode, with controls | When you can run it (`pnpm storybook`) |

## 3. Setup in an app

```bash
npm install @leeward/react
```

`@leeward/react` brings `@leeward/tokens` with it. Then, once at the root:

```tsx
import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import type { ReactNode } from "react";
import { ToastProvider, TooltipProvider } from "@leeward/react";

export function App({ children }: { children: ReactNode }) {
  return (
    <div data-brand="leeward" data-theme="light">
      <TooltipProvider>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </div>
  );
}
```

- `data-brand`: `leeward` (default) or `business`, or a generated partner name.
- `data-theme`: `light`, `dark` or `auto` (follows the operating system).
- Both attributes work on any element. Never write brand-specific or dark-specific CSS: change the attributes instead.

## 4. Choosing components

| You need | Use | Not |
|---|---|---|
| The main action of a step | `Button` (`primary`, `xl` and `fullWidth` on phones) | A styled `div` or link |
| A secondary action | `Button variant="secondary"` or `"outline"` | A second primary button |
| An icon-only action (close, more, settings) | `IconButton` with `label` | `IconButton` for money movement |
| Navigation to another page | `Link`, or `ListItem href` for rows | `Button` |
| A short text value | `TextField` | Raw `<input>` |
| A money amount to type | `AmountInput` | `TextField` |
| A one-time code | `OTPInput` | Six inputs |
| Long text | `Textarea` | `TextField` |
| One option from 2 to 5 | `RadioGroup` (in forms) or `SegmentedControl` (views) | `Select` |
| One option from 5 to 15 | `Select` | `RadioGroup` |
| A yes or no in a form | `Checkbox` | `Switch` |
| A setting that applies now | `Switch` | `Checkbox` |
| Filters on a list | `Chip` in a `role="group"` | `Tabs` |
| Views of the same object | `Tabs` | `SegmentedControl` for navigation |
| An amount or balance to show | `AmountDisplay`, or `BalanceHeader` at the top of a screen | `Text` with a formatted string |
| A transaction in a list | `TransactionRow` inside `List` | `ListItem` |
| A row in settings or menus | `ListItem` inside `List` | `TransactionRow` |
| Home shortcuts | `QuickActions` | A row of IconButtons |
| An account summary | `AccountCard` | A custom card |
| A status label | `Badge` | Colored text |
| A message on the page | `Alert` | A colored box |
| A confirmation after an action | `useToast().show(...)` | `Alert` |
| A decision that blocks the flow | `Dialog` | `Sheet` |
| A task in context (filters, details) | `Sheet` | `Dialog` |
| Secondary actions on an item | `DropdownMenu` with an `IconButton` "More actions" | Several IconButtons |
| Progress through steps | `Stepper` (`compact` on phones) | `ProgressBar` |
| Progress toward a goal or limit | `ProgressBar` with `valueText` | A styled div |
| Content loading | `Skeleton` inside `role="status"` | A spinner for whole pages |
| Nothing to show yet | `EmptyState` | Plain text |
| Headings | `Heading` with `level` | `Text` in bold |
| Body text | `Text` | Raw `<p>` with styles |

With MCP: call `search_components("what you need")`, then `get_component(name)` for each component you will use.

## 5. Tokens you will use most

| Job | Token |
|---|---|
| Page background | `--lw-fill-surface-canvas` |
| Card and sheet background | `--lw-fill-surface-default`, `--lw-fill-surface-raised` |
| Hover and pressed backgrounds | `--lw-fill-surface-bold`, `--lw-fill-surface-bolder` |
| Main text, secondary text, hints | `--lw-text-default`, `--lw-text-muted`, `--lw-text-subtle` |
| Brand text and links | `--lw-text-primary`, `--lw-text-link-default` |
| Decorative borders, dividers | `--lw-border-muted` |
| Input and control boundaries | `--lw-border-default` (3:1) |
| Brand fill and the text on it | `--lw-fill-primary-default`, `--lw-fill-primary-on-default` |
| Soft status backgrounds and text on them | `--lw-fill-<role>-weak`, `--lw-text-<role>-on-subtle` |
| Spacing | `--lw-space-2xs` 4, `xs` 8, `sm` 12, `md` 16, `lg` 24, `xl` 32, `2xl` 48 |
| Radius | `--lw-radius-card`, `--lw-radius-dialog`, `--lw-control-radius-<size>`, `--lw-radius-pill` |
| Elevation | `--lw-elevation-100` to `--lw-elevation-800` |
| Focus | `--lw-elevation-focus` (already applied globally; do not restyle focus) |
| Content widths | `--lw-size-content-sm` 480, `-md` 720, `-lg` 1120 |
| Type | `--lw-type-<role>-size`, `-line-height`, `-weight`, `-tracking`, `-family` |

Roles: `primary`, `secondary`, `neutral`, `info`, `success`, `warning`, `attention`, `danger`. Intensities: `default`, `emphasis`, `strong`, `subtle`, `subtler`, `subtlest`, `weak`, `on-default`. With MCP: `get_tokens({ category: "fill" })`.

## 6. Sizes

All controls share one scale. A Button, IconButton, TextField, Select, SegmentedControl and Chip of the same size have exactly the same height.

| Size | Height (comfortable / compact) | Use |
|---|---|---|
| `xs` | 32 / 28 px | Dense desktop tables and toolbars |
| `sm` | 36 / 32 px | Inside cards, rows and filters |
| `md` | 44 / 40 px | Default for forms and dialogs |
| `lg` | 48 / 44 px | Main fields and actions on phones |
| `xl` | 56 / 48 px | The last action of a mobile flow |

Button also has `shape="pill"` for fully rounded ends, at the same heights. Use pills for standalone actions (onboarding, empty states, promotional cards); keep `rounded` in forms and toolbars, and never mix the two in one group.

Every control keeps a 44 px hit area. Use the same size for controls that sit in one row.

## 7. Layout

- **Phones first.** Main column: `max-width: var(--lw-size-content-sm)`, side padding `var(--lw-space-md)`, top padding `var(--lw-space-lg)`.
- **Vertical rhythm.** Sections apart: `var(--lw-space-lg)`. Items inside a section: `var(--lw-space-sm)`. Label to field and tight groups: `var(--lw-space-xs)`.
- **Screen header.** Back `IconButton` (when not the first screen) and a `Heading level={1} size="title-xs"`.
- **Flows.** `Stepper variant="compact"` under the header, one task per step, the primary `Button size="xl" fullWidth` last.
- **Lists.** `Card padding="none"` wrapping `List` with `ListItem` or `TransactionRow`. Give the section a `Heading level={2}`.
- **Every data view has three more states:** loading (`Skeleton`), empty (`EmptyState`) and error (`Alert tone="danger"`). See `docs/recipes/ScreenStates.tsx`.
- **Desktop.** Use `--lw-size-content-md` or `-lg` and a two-column grid only when content benefits. Dialogs stay centered on desktop and become bottom sheets on phones automatically.

## 8. Banking rules

- Format money for the locale. `tr-TR` with TRY: `₺1.250,00`. `en-US` with TRY: `TRY 1,250.00`. Foreign currencies always use the code.
- `AmountDisplay direction="incoming"` adds a plus sign and the success color; `"outgoing"` a minus sign and default text. Outgoing is never red.
- Show the fee next to the amount at the same size, and the total that leaves the account before confirming.
- Mask IBANs on cards (`AccountCard` does it). Show the full IBAN only on a details screen.
- Confirm transfers with `OTPInput`. Never clear the code on error.
- Irreversible actions (closing an account) need a `Dialog` with a `danger` button and words that say what is lost.
- Balances must be hideable: use `BalanceHeader`.

## 9. Accessibility rules

- Use semantic structure: one `h1` per screen, headings in order, lists for rows, buttons for actions, links for navigation.
- Every interactive element needs an accessible name. IconButton needs `label`; inputs need `label`.
- Do not remove focus styles and do not add `outline: none`.
- Do not use color alone to convey meaning.
- Group related controls: chips in `role="group"` with `aria-label`; radios in `RadioGroup`.
- Mark loading regions with `role="status"`, `aria-busy` and a label.
- Use `live="alert"` only for urgent errors.

## 10. Writing

- Second person, short sentences, the outcome first: "Your money arrives in seconds."
- Buttons are verbs with an outcome: "Send ₺250", "Freeze card". Dialog titles are questions: "Freeze your card?".
- Errors say what happened and how to fix it: "This IBAN is too short. Check it and try again." When nothing moved, say so.
- Never use em dashes. Never use "revolutionary", "seamless" or "magic".

## 11. Designing (not coding)

When you design in Figma or describe a design:

- Variables live in two collections. **Leeward Primitives** holds the ramps (`color/indigo/600`). **Leeward Semantic** has one mode per brand and theme (`leeward.light`, `leeward.dark`, `business.light`, `business.dark`).
- Use only semantic variables in designs. The Figma name matches the CSS name: `fill/primary/default` is `--lw-fill-primary-default`, `space/md` is `--lw-space-md`, `button/height-md` is `--lw-button-height-md`.
- Name layers after the components and props: "Button / primary / md", "TextField / error".
- Annotate every non-obvious value with its token, never with a hex value or a px number.
- Design the loading, empty and error states with the screen, and both light and dark modes.
- Hand off by listing the components, their props and the copy. If you need something the system does not have, say so and propose it as a new token or component, instead of drawing a one-off.

## 12. Before you say you are done

- [ ] Only `@leeward/react` components and semantic `var(--lw-…)` tokens. No raw colors, px spacing or invented components.
- [ ] `validate_ui` (or `pnpm lint`) reports no issues.
- [ ] Every amount uses `AmountDisplay` or `formatAmount`. No red outgoing money.
- [ ] Every input and icon-only button has a label.
- [ ] One primary action per screen; money movement has a text label.
- [ ] Loading, empty and error states exist for every data view.
- [ ] Headings are in order; the screen has one `h1`.
- [ ] Copy follows section 10. No em dashes.
- [ ] It works in `leeward` and `business`, light and dark, at 360 px and 1280 px wide.

## 13. Common mistakes

| Mistake | Fix |
|---|---|
| `color: "#4C3FE0"` or `padding: 13` | `var(--lw-text-primary)`, `var(--lw-space-sm)` |
| `--lw-color-indigo-600` | `--lw-fill-primary-default` |
| `` `₺${amount.toFixed(2)}` `` | `<AmountDisplay value={amount} currency="TRY" locale="tr-TR" />` |
| Red text for a payment | `direction="outgoing"` |
| `<input placeholder="Amount">` | `<AmountInput label="Amount" currency="TRY" />` |
| `<IconButton icon="send" label="Send money" />` | `<Button iconStart="send">Send money</Button>` |
| Disabling Continue until the form is valid | Keep it enabled and show the error on the field |
| A custom modal | `Dialog` or `Sheet` |
| A spinner for a whole list | `Skeleton` rows in a status region |
| Writing dark-mode CSS | `data-theme="dark"` on the container |

## 14. Using the MCP server

```bash
claude mcp add leeward -- npx -y @leeward/mcp-server
```

From a clone of the repository: `claude mcp add leeward -- node "<repo>/packages/mcp-server/src/index.ts"`.

| Tool | Use it to |
|---|---|
| `get_guidelines({ topic })` | Read rules: principles, tokens, color, typography, amounts, forms, errors, layout, copy, accessibility, motion, dark-mode, or all |
| `search_components({ query })` | Find the right component for a need |
| `get_component({ name })` | Get props, variants, sizes, do and don't, accessibility, keyboard and an example |
| `get_tokens({ brand, mode, category })` | List tokens with CSS variables and values |
| `validate_ui({ code })` | Check generated TSX and get a fix for each problem |

A good loop: `get_guidelines("all")` once, then for each screen `search_components`, `get_component` for each pick, write the code, `validate_ui`, fix, repeat until it is clean.

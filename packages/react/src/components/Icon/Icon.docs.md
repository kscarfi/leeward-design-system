# Icon

Solar icons (480 Design, CC BY 4.0) on a 24 px grid: 142 icons in three weights. Use linear by default, bold for selected or active states, duotone for illustrations and empty states.

## Do

- Pair icons with text for anything important.
- Give `label` only when the icon carries meaning on its own.

## Don't

- Do not draw new SVGs inline in product code. Add them with `pnpm icons:import` (see scripts/import-solar-icons.ts).
- Do not use an icon as the only signal of state.

## Accessibility

- Decorative by default (`aria-hidden`).
- With `label` it becomes `role="img"` with that name.
- Uses `currentColor`, so it follows the text tone.

## Example

```tsx
<Icon name="lock" label="Secured" />
```

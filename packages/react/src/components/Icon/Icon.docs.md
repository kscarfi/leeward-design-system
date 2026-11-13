# Icon

Inline SVG icons on a 24px grid with a 1.75 stroke. 43 icons.

## Do

- Pair icons with text for anything important.
- Give `label` only when the icon carries meaning on its own.

## Don't

- Do not draw new SVGs inline in product code. Add them to the set.
- Do not use an icon as the only signal of state.

## Accessibility

- Decorative by default (`aria-hidden`).
- With `label` it becomes `role="img"` with that name.
- Uses `currentColor`, so it follows the text tone.

## Example

```tsx
<Icon name="lock" label="Secured" />
```

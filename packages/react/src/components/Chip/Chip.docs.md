# Chip

Filter toggle, for example in a transaction list.

## Do

- Group chips in an element with `role="group"` and an `aria-label`.

## Don't

- Do not use chips as navigation tabs. Use Tabs.
- Do not use for actions that move money.

## Accessibility

- Toggle button with `aria-pressed`. Selected chips show a check mark, not only color.

## Example

```tsx
<Chip selected={selected} onSelectedChange={setSelected}>Money in</Chip>
```

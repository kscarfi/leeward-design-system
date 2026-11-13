# Card

Surface that groups related content.

## Do

- Use `elevated` for primary objects like accounts, `outlined` for lists, `filled` for quiet grouping.
- Pick `as` for meaning: `section` with a heading, `article` for self-contained items.

## Don't

- Do not nest elevated cards.
- Do not make a whole card clickable if it contains other buttons.

## Accessibility

- No interactive behavior of its own.

## Example

```tsx
<Card variant="elevated" padding="lg">...</Card>
```

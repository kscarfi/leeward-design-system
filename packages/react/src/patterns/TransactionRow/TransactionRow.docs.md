# TransactionRow

One transaction: merchant, category, date, amount and status. The row reads as one sentence for screen readers.

## When to use

- Activity lists, statements.

## When not to use

- Other kinds of rows: use ListItem.

## States

- `completed`, `pending` (badge), `declined` (struck amount and badge).

## Content guidelines

- Merchant names as shown on receipts; categories in plain words.

## Do

- Use inside List or any `ul`.
- Pass `onClick` to open details.

## Don't

- Do not color the row by direction.

## Accessibility

- One sentence: merchant, category, date, direction, amount, status.
- The sentence starts with the visible merchant name, so voice control works.

## Example

```tsx
import { List, TransactionRow } from "@leeward/react";

export function Activity() {
  return (
    <List>
      <TransactionRow merchant="Coffee Lab" category="Eating out" date={new Date("2026-11-12")} amount={85} direction="outgoing" currency="TRY" locale="tr-TR" icon="coffee" />
    </List>
  );
}
```

## Related

- AmountDisplay
- ListItem

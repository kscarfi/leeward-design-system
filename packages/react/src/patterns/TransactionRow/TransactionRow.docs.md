# TransactionRow

One transaction: merchant, category, date, amount and status.

## Do

- Use inside List or any `ul`.
- Set `status` for pending and declined so a badge appears.

## Don't

- Do not color the row by direction.
- Do not build transaction rows from ListItem.

## Accessibility

- The whole row reads as one sentence: merchant, category, date, direction, amount, status.
- The sentence starts with the visible merchant name, so voice control works.

## Example

```tsx
<TransactionRow merchant="Coffee Lab" category="Eating out" date={date} amount={85} direction="outgoing" currency="TRY" locale="tr-TR" icon="coffee" />
```

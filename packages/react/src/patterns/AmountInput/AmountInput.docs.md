# AmountInput

Money entry with the decimal keypad, locale formatting and a clear limit error.

## Do

- Pass max as the available balance so the error explains the limit.
- Show the available balance in hint.

## Don't

- Do not use a plain TextField for money.
- Do not block typing: show the error and let people fix it.

## Accessibility

- inputMode="decimal" opens the number keypad. The error is linked to the field. Values use tabular figures.

## Example

```tsx
<AmountInput label="Amount" currency="TRY" locale="tr-TR" max={24580.35} hint="Available: ₺24.580,35" />
```

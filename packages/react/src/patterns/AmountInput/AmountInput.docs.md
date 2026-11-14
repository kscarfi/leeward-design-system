# AmountInput

Money entry with the decimal keypad on phones, locale formatting on blur and a clear limit error.

## When to use

- Transfer amounts, top ups, savings deposits.

## When not to use

- Non-money numbers: use TextField with `numeric`.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Field | 48 px | Always the large field size. |

## States

- Empty, typing (raw), formatted (on blur), over the limit (error), under the minimum (error).

## Content guidelines

- Show the available balance in `hint`.
- Built-in errors explain the limit: "This is more than you have. You can send up to ₺24.580,35."

## Behavior and responsive

- Accepts both 1250,5 and 1.250,50 in tr-TR, and formats to 1.250,50 on blur.
- Values are in major units (lira), up to two decimals.

## Do

- Pass `max` as the available balance.

## Don't

- Do not block typing: show the error and let people fix it.

## Accessibility

- `inputMode="decimal"` opens the number keypad.
- The error is linked to the field.

## Example

```tsx
import { AmountInput } from "@leeward/react";

export function TransferAmount() {
  return <AmountInput label="Amount" currency="TRY" locale="tr-TR" max={24580.35} hint="Available: ₺24.580,35" onValueChange={(value) => console.log(value)} />;
}
```

## Related

- AmountDisplay
- TextField

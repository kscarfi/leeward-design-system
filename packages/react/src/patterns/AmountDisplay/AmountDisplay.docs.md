# AmountDisplay

Every amount and balance in Leeward: locale formatting, tabular figures and a direction that never relies on color.

## When to use

- Balances, transaction amounts, fees, totals.

## When not to use

- Typing amounts: use AmountInput.

## Variants

| Variant | Use it for |
|---|---|
| `incoming` | Plus sign and the success color. |
| `outgoing` | Typographic minus and the default text color. Never red. |
| `neutral` | No sign, for balances. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 16 px | Lists. |
| `md` | 20 px | Cards and summaries. |
| `lg` | 28 to 36 px, fluid | Account cards. |
| `xl` | 36 to 51 px, fluid | The hero balance. |

## States

- `pending`: clock icon and the word Pending.
- `masked`: digits replaced by dots, announced as "Balance hidden".

## Content guidelines

- tr-TR with TRY shows ₺1.250,00. en-US with TRY shows TRY 1,250.00. Foreign currencies always use the code.
- Show fees at the same size as the amount they belong to.

## Do

- Pass a positive `value` and set `direction`.

## Don't

- Do not color outgoing amounts red.
- Do not format amounts by hand or with `toFixed`.

## Accessibility

- Screen readers hear one phrase: "Money in: 1,250.00 Turkish lira".
- Visual text is hidden from assistive tech to avoid reading symbols.

## Example

```tsx
import { AmountDisplay } from "@leeward/react";

export function Incoming() {
  return <AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="incoming" />;
}
```

### Hero balance

```tsx
import { AmountDisplay } from "@leeward/react";

export function TotalBalance() {
  return <AmountDisplay value={144580.35} currency="TRY" locale="tr-TR" size="xl" />;
}
```

## Related

- BalanceHeader
- TransactionRow
- AmountInput

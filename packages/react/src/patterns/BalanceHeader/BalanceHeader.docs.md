# BalanceHeader

The account balance at the top of home and account screens, with a hide and show control.

## When to use

- Once per screen, at the top.

## When not to use

- Lists of balances: use AmountDisplay in rows.

## Anatomy

- Label, hide toggle, balance (AmountDisplay `xl`), meta line, optional actions.

## Content guidelines

- Label says which balance: "Available balance".
- Meta says how fresh it is: "Updated just now".

## Do

- Keep the toggle: people check balances in public.

## Don't

- Do not hide the label when the balance is hidden.

## Accessibility

- Region named by the label.
- The toggle uses `aria-pressed` and changes its label; hidden balances read "Balance hidden".

## Example

```tsx
import { BalanceHeader } from "@leeward/react";

export function HomeBalance() {
  return <BalanceHeader label="Available balance" balance={24580.35} currency="TRY" locale="tr-TR" meta="Updated just now" />;
}
```

## Related

- AmountDisplay
- QuickActions

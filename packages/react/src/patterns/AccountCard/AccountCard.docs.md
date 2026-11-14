# AccountCard

An account summary: name, type, masked IBAN, balance and up to three quick actions.

## When to use

- Home and accounts screens.

## When not to use

- Account details: show the full IBAN on its own screen.

## Content guidelines

- Name is the person's own name for the account: "Everyday".
- Action labels are verbs: Send, Add money, Details.

## Do

- Give each action a text label. The first one is primary.

## Don't

- Do not show the full IBAN on the card.

## Accessibility

- Article named by account name and type.
- IBAN is masked visually and read as "IBAN ending in 1 3 2 6".

## Example

```tsx
import { AccountCard } from "@leeward/react";

export function Everyday() {
  return (
    <AccountCard
      name="Everyday"
      type="Current account"
      iban="TR33 0006 1005 1978 6457 8413 26"
      balance={24580.35}
      currency="TRY"
      locale="tr-TR"
      actions={[{ label: "Send", icon: "send", onClick: () => {} }]}
    />
  );
}
```

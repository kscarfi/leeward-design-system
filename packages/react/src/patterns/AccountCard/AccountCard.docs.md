# AccountCard

Account summary with type, masked IBAN, balance and up to three quick actions.

## Do

- Give each action a text label. The first one is primary.

## Don't

- Do not show the full IBAN on the card. Show it on the details screen.
- Do not use icon-only quick actions.

## Accessibility

- Article named by account name and type.
- IBAN is masked visually and read as "IBAN ending in 1 3 2 6".

## Example

```tsx
<AccountCard name="Everyday" type="Current account" iban={iban} balance={24580.35} currency="TRY" actions={[{ label: "Send", icon: "arrow-up-right", onClick: send }]} />
```

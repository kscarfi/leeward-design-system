# BalanceHeader

Account balance with a hide and show control.

## Do

- Use once at the top of home or account screens.
- Put Send and Request as text Buttons in `actions`.

## Don't

- Do not hide the toggle. People check balances in public.

## Accessibility

- Region named by the label. Toggle uses `aria-pressed` and changes its label.
- Hidden balances read "Balance hidden".

## Example

```tsx
<BalanceHeader label="Available balance" balance={24580.35} currency="TRY" locale="tr-TR" />
```

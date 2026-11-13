# AmountDisplay

Money amount with locale formatting, tabular figures and a direction that never relies on color.

## Do

- Use for every amount and balance.
- Pass a positive `value` and set `direction`.
- Use `pending` for money that has not settled.

## Don't

- Do not color outgoing amounts red. Outgoing is ink with a minus sign.
- Do not format amounts by hand.
- Do not make fees smaller than the amount they belong to.

## Accessibility

- Visual text is hidden. Screen readers hear "Money in: 1,250.00 Turkish lira".
- Incoming uses a plus sign, outgoing a typographic minus (U+2212).

## Example

```tsx
<AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="incoming" />
```

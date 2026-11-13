# Textarea

Multi-line text for payment notes and messages.

## Do

- Show the limit with maxLength and showCount when there is one.

## Don't

- Do not use it for single-line values such as names or IBANs: use TextField.

## Accessibility

- Visible label, hint and error linked like TextField.
- The counter is announced politely.

## Example

```tsx
<Textarea label="Payment note" maxLength={140} showCount optional />
```

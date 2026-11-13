# ListItem

Row in a list with title, description, leading and trailing slots. Use inside List.

## Do

- Use `href` for navigation and `onClick` for actions. The whole row becomes the target.
- Add `chevron` when the row opens another screen.

## Don't

- Do not put a button inside an interactive row.
- Do not use for transactions. Use TransactionRow.

## Accessibility

- Renders `li` inside `ul`. Rows are at least 44px tall.
- Interactive rows use a native link or button.

## Example

```tsx
<List><ListItem title="Security" description="Passcode, Face ID" href="/security" chevron /></List>
```

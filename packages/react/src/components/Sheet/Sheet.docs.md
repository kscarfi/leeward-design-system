# Sheet

Panel for a task in context, such as filters or transaction details.

## Do

- Use side="bottom" on phones and side="end" for side panels on wide screens.
- Put the main action last in footer.

## Don't

- Do not open a sheet from inside another sheet.

## Accessibility

- Modal dialog: traps focus, closes on Escape and returns focus. Named by title.

## Example

```tsx
<Sheet title="Filter transactions" trigger={<Button variant="outline">Filter</Button>}>...</Sheet>
```

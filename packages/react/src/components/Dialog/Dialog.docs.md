# Dialog

Modal for a decision that needs full attention, such as confirming a transfer or freezing a card.

## Do

- Write `title` as a question: "Freeze your card?".
- Put the main action last in `actions`. Use danger only if it cannot be undone.

## Don't

- Do not open a dialog on page load.
- Do not use for information that could sit on the page.

## Accessibility

- Traps focus, closes on Escape, returns focus to the trigger.
- Named by `title` and described by `description`.

## Example

```tsx
<Dialog title="Freeze your card?" trigger={<Button variant="secondary">Freeze card</Button>} actions={<Button>Freeze card</Button>} />
```

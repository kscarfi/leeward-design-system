# Button

Triggers an action. One primary button per screen or section.

## Do

- Use primary for the one main action, secondary or outline for alternatives, ghost for low emphasis, danger only for irreversible actions.
- Sizes: xs 32, sm 36, md 44 (default), lg 48, xl 56 px. Use xl full width for the last step of a mobile flow.
- Write the label as the outcome: "Send ₺250", "Freeze card".
- Use `loading` while the action runs, so the label stays readable and repeat clicks are blocked.
- Every size keeps a 44 px hit area on touch screens.

## Don't

- Do not use danger for normal payments. Sending money is not an error.
- Do not put two primary buttons next to each other.
- Do not use a Button for navigation to another page: use a link.
- Do not disable a submit button to hide errors. Let people submit and show the error.

## Accessibility

- Native `<button>` with `type="button"` by default.
- Loading uses `aria-busy` and `aria-disabled`, keeps focus and keeps the accessible name.
- Small size keeps a 44px hit area with an invisible extension.
- Focus ring is 2px with a 2px offset, 3:1 against every surface.

## Example

```tsx
<Button variant="primary" iconStart="arrow-up-right" onClick={send}>Send money</Button>
```

# IconButton

Icon-only button for secondary actions such as close, settings or show balance.

## Do

- Give `label` the outcome: "Close", "Show balance".
- Wrap in Tooltip when the icon is not obvious.

## Don't

- Do not use for moving money. Send, pay and transfer always need a text Button.
- Do not use an icon without a label.

## Accessibility

- `label` is required and becomes `aria-label`.
- 44 by 44px target at md size, extended hit area at sm.
- Use `aria-pressed` for toggles such as hide balance.

## Example

```tsx
<IconButton icon="close" label="Close" onClick={onClose} />
```

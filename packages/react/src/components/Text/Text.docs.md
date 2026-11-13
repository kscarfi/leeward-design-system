# Text

Body, label and caption text with token-based type roles and tones.

## Do

- Use `tabular` for numbers that line up in columns.
- Use tone `secondary` for supporting text and `tertiary` only for hints and captions.

## Don't

- Do not use tone `success` or `danger` as the only signal of state. Add an icon or words.
- Do not style text with raw font sizes.

## Accessibility

- Every tone passes WCAG 2.2 AA on every surface in light and dark themes.
- Pick `as` for meaning: `p` for paragraphs, `span` inline, `label` with `htmlFor`.

## Example

```tsx
<Text variant="body-sm" tone="secondary">Transfers to other banks take up to one working day.</Text>
```

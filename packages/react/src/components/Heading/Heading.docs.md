# Heading

Section and page headings with a required outline level.

## Do

- Set `level` for the document outline and `size` for the look. They can differ.
- One `level={1}` per screen.

## Don't

- Do not skip levels, for example h1 to h3.
- Do not use Heading only to make text big. Use Text or AmountDisplay.

## Accessibility

- `level` is required so the outline is intentional.
- Large headings use `text-wrap: balance`.

## Example

```tsx
<Heading level={2} size="sm">Recent activity</Heading>
```

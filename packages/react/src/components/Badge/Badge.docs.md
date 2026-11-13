# Badge

Short status label such as Pending, Paid or Declined.

## Do

- Keep it to one or two words.
- Status tones add an icon by default.

## Don't

- Do not use as a button.
- Do not remove the icon on status tones without another non-color signal.

## Accessibility

- Text is part of the content, so screen readers read it.
- Every tone passes AA against its background.

## Example

```tsx
<Badge tone="warning">Pending</Badge>
```

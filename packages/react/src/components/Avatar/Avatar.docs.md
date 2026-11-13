# Avatar

Initials, image or category icon for a person or merchant.

## Do

- Set `decorative` when the name is visible next to it.

## Don't

- Do not use an avatar as the only way to identify a person.

## Accessibility

- `role="img"` named by `name`, or hidden when decorative.
- Falls back to initials if the image fails.

## Example

```tsx
<Avatar name="Deniz Yılmaz" decorative />
```

# Avatar

Initials, a photo or a category icon for a person or merchant.

## When to use

- Recipients, merchants, account owners.

## When not to use

- As the only way to identify someone: show the name too.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `xs` | 24 px | Inline mentions. |
| `sm` | 32 px | Dense lists. |
| `md` | 40 px | Default, transaction rows. |
| `lg` | 48 px | Profile headers. |
| `xl` | 64 px | Profile screens. |

## States

- Image, initials fallback (also when the image fails), icon.

## Content guidelines

- Initials come from the first and last word of `name`.

## Do

- Set `decorative` when the name is visible next to it.

## Don't

- Do not rely on color to tell people apart.

## Accessibility

- `role="img"` named by `name`, or hidden when `decorative`.

## Example

```tsx
import { Avatar } from "@leeward/react";

export function Recipient() {
  return <Avatar name="Deniz Yılmaz" />;
}
```

## Related

- ListItem
- TransactionRow

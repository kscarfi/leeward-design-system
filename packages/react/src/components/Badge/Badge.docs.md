# Badge

A short status or category label such as Pending, Paid or Declined.

## When to use

- Transaction status, account type, counts.

## When not to use

- Actions: badges are not clickable.
- Long text: keep it to one or two words.

## Variants

| Variant | Use it for |
|---|---|
| `subtle` | Default. Lists, tables and rows. |
| `solid` | Strong status and counts that must stand out. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 20 px | Inside dense rows. |
| `md` | 24 px | Default. |

## States

- Tones: `neutral`, `info`, `success`, `warning`, `danger`. Status tones add an icon by default.

## Content guidelines

- Use past or present state words: Paid, Pending, Declined, New.

## Do

- Keep the icon on status tones.

## Don't

- Do not remove the icon on a status tone without another non-color signal.
- Do not use more than one badge per row when you can avoid it.

## Accessibility

- The text is read as part of the content.
- Every tone and appearance passes AA.

## Example

```tsx
import { Badge } from "@leeward/react";

export function PendingBadge() {
  return <Badge tone="warning">Pending</Badge>;
}
```

### Solid count

```tsx
import { Badge } from "@leeward/react";

export function NewCount() {
  return <Badge tone="danger" appearance="solid" icon={null} size="sm">2 new</Badge>;
}
```

## Related

- Chip
- Alert

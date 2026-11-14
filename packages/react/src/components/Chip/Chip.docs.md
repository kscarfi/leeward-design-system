# Chip

A toggle for filters, such as Money in or Money out in a transaction list.

## When to use

- Filtering a list on the same screen.

## When not to use

- Navigation: use Tabs.
- Actions that move money.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Default | 36 px | With a 44 px hit area. |

## States

- Unselected, selected (check mark and brand tint), disabled.

## Content guidelines

- One or two words per chip.

## Do

- Group chips in an element with `role="group"` and an `aria-label`.

## Don't

- Do not use chips as tabs.

## Accessibility

- Toggle button with `aria-pressed`.
- Selected chips show a check mark, not only color.

### Keyboard

| Key | Action |
|---|---|
| Tab | Moves between chips |
| Enter or Space | Toggles |

## Example

```tsx
import { useState } from "react";
import { Chip } from "@leeward/react";

export function MoneyInFilter() {
  const [selected, setSelected] = useState(false);
  return <Chip selected={selected} onSelectedChange={setSelected}>Money in</Chip>;
}
```

## Related

- SegmentedControl
- Badge

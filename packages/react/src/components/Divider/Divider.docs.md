# Divider

A thin line that separates groups of content on a surface.

## When to use

- Between groups that would otherwise blur together.
- With `label`, for an "or" between two options.

## When not to use

- When spacing alone separates the groups.

## Variants

| Variant | Use it for |
|---|---|
| `horizontal` | Default. |
| `vertical` | Between items in a row. |

## Content guidelines

- Labels are one short word: "or".

## Do

- Place dividers on surfaces such as cards and sheets.

## Don't

- Do not use a divider as the only signal that sections differ.

## Accessibility

- Hidden from screen readers by default.
- Set `decorative={false}` to expose a `separator` between real sections.

## Example

```tsx
import { Divider } from "@leeward/react";

export function OrDivider() {
  return <Divider label="or" />;
}
```

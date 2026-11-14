# Spinner

A small wait indicator when the shape of the result is unknown.

## When to use

- Short waits inside a region.

## When not to use

- Page content: use Skeleton.
- Inside buttons: use Button `loading`.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 16 px | Inline. |
| `md` | 20 px | Default. |
| `lg` | 32 px | Empty regions. |

## Content guidelines

- Give it a label when it is alone on screen: "Loading your accounts".

## Do

- Use `currentColor` by placing it inside colored text.

## Don't

- Do not show several spinners at once.

## Accessibility

- With `label` it is a status region; without it is decorative.
- With reduced motion it keeps turning slowly so it never looks frozen.

## Example

```tsx
import { Spinner } from "@leeward/react";

export function Loading() {
  return <Spinner label="Loading your accounts" />;
}
```

# Skeleton

A placeholder in the shape of content that is loading.

## When to use

- Lists, cards and balances while data loads.

## When not to use

- Waits longer than a few seconds without a message.
- Actions: use Button loading.

## Variants

| Variant | Use it for |
|---|---|
| `text` | Lines of text; `lines` adds more. |
| `rect` | Blocks such as cards. |
| `circle` | Avatars. |

## Content guidelines

- Match the shape of the content that will appear.

## Behavior and responsive

- Shimmers gently; with reduced motion it stays still.

## Do

- Mark the loading region with `role="status"`, `aria-busy` and a label.

## Don't

- Do not show skeletons for content that loads instantly.

## Accessibility

- Hidden from screen readers: the region announces loading.

## Example

```tsx
import { Skeleton } from "@leeward/react";

export function LoadingList() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading transactions">
      <Skeleton shape="circle" />
      <Skeleton lines={2} />
    </div>
  );
}
```

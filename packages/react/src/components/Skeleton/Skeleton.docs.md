# Skeleton

Placeholder while content loads.

## Do

- Match the shape of the content that will appear.
- Mark the loading region with `role="status"` and `aria-busy`.

## Don't

- Do not show skeletons for more than a few seconds without a message.

## Accessibility

- Hidden from screen readers. No shimmer with reduced motion.

## Example

```tsx
<div role="status" aria-busy="true" aria-label="Loading transactions"><Skeleton lines={2} /></div>
```

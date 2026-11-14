# Alert

An inline message on the page: what happened and what to do next.

## When to use

- Context before an action (info), confirmations that stay on screen (success), limits (warning), failures (danger).

## When not to use

- Field errors: put them on the field.
- Short-lived confirmations: use Toast.

## Variants

| Variant | Use it for |
|---|---|
| `info` | Useful context. |
| `success` | Something finished and the page reflects it. |
| `warning` | Close to a limit or a deadline. |
| `danger` | Something failed. |
| `neutral` | Plain notices. |

## Content guidelines

- Title says what happened. Text says what to do.
- When nothing moved, say so: "Nothing left your account."

## Do

- Offer the fix as an action button.

## Don't

- Do not stack several alerts at the top of a screen.

## Accessibility

- `role="status"` by default; `live="alert"` for urgent failures.
- Icon, title and text, never color alone.
- The dismiss button is labelled.

## Example

```tsx
import { Alert, Button } from "@leeward/react";

export function LimitWarning() {
  return (
    <Alert tone="warning" title="You are close to your daily limit" actions={<Button size="sm">Raise limit</Button>}>
      ₺1.500 left today. Limits reset at midnight.
    </Alert>
  );
}
```

## Related

- Toast
- EmptyState

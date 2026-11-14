# Toast

A short confirmation after an action, such as "Money sent". Shown with `useToast` inside `ToastProvider`.

## When to use

- Confirming that something finished.
- Offering an undo for a reversible action.

## When not to use

- Errors inside forms: show them on the field.
- Anything people must act on: use Alert or Dialog.

## Variants

| Variant | Use it for |
|---|---|
| `neutral` | Information. |
| `success` | Done. |
| `warning` | Close to a limit. |
| `danger` | Failed. Stays until dismissed. |

## Content guidelines

- Title says what happened in two or three words.
- Description adds one useful detail.

## Behavior and responsive

- Non-error toasts hide after 6 seconds; errors stay.
- Full width at the bottom of phones, up to 520 px on wide screens. Swipe down to dismiss.

## Do

- Wrap the app once in `ToastProvider`.

## Don't

- Do not put the only way to do something in a toast.

## Accessibility

- Radix Toast region with a label. Danger toasts are announced assertively.
- Each tone has an icon and a colored edge, never color alone.

### Keyboard

| Key | Action |
|---|---|
| F8 | Moves focus to the toast region |
| Escape | Dismisses |

## Example

```tsx
import { Button, useToast } from "@leeward/react";

export function SendWithToast() {
  const toast = useToast();
  return <Button onClick={() => toast.show({ title: "Money sent", description: "Deniz gets ₺250,00 in a few seconds.", tone: "success" })}>Send</Button>;
}
```

## Related

- Alert

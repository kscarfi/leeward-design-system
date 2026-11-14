# Tooltip

Extra information on hover and keyboard focus. Wrap the app once in `TooltipProvider`.

## When to use

- Naming an icon-only control.
- A short explanation that is nice to have.

## When not to use

- Required information, fees or errors.
- Touch-first screens, where hover does not exist: show the text inline.

## Content guidelines

- One short sentence, no actions or links.

## Behavior and responsive

- Opens after 300 ms, flips to stay on screen.

## Do

- Wrap a single focusable element.

## Don't

- Do not wrap disabled buttons: they cannot receive focus.

## Accessibility

- Shows on focus and hover, hides on Escape.
- Content is linked to the trigger.

### Keyboard

| Key | Action |
|---|---|
| Tab | Focus shows the tooltip |
| Escape | Hides it |

## Example

```tsx
import { IconButton, Tooltip } from "@leeward/react";

export function FeeInfo() {
  return (
    <Tooltip content="The fee is the same for every amount.">
      <IconButton icon="info" label="About the fee" />
    </Tooltip>
  );
}
```

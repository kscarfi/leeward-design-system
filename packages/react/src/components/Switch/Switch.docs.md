# Switch

Turns a setting on or off immediately, such as online card payments.

## When to use

- Settings that take effect right away.

## When not to use

- Choices inside a form with a submit button: use Checkbox.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Track | 44 by 24 px | Full width is the touch target. |

## States

- Off, on, disabled (with a hint saying why).

## Content guidelines

- Label the setting, not the state: "Online card payments", not "On".
- Use the hint to explain consequences or why it is disabled.

## Do

- Confirm risky changes with a toast or dialog.

## Don't

- Do not use "On" and "Off" as labels.

## Accessibility

- `switch` role from Radix, labelled.
- The track meets 3:1 against every surface.

### Keyboard

| Key | Action |
|---|---|
| Space | Toggles |

## Example

```tsx
import { useState } from "react";
import { Switch } from "@leeward/react";

export function OnlinePayments() {
  const [on, setOn] = useState(true);
  return <Switch label="Online card payments" checked={on} onCheckedChange={setOn} />;
}
```

## Related

- Checkbox

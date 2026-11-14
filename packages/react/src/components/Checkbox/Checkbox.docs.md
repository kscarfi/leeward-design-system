# Checkbox

A yes or no choice inside a form, or one of several independent choices.

## When to use

- Agreeing to terms, choosing several filters, saving a recipient.

## When not to use

- Settings that apply immediately: use Switch.
- Choosing one of several options: use RadioGroup.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Box | 20 px | Always 20 px, with a 44 px hit area. |

## States

- Unchecked, checked, indeterminate, error, disabled.

## Content guidelines

- Write the label as a statement people agree with: "Save this person as a recipient".

## Do

- Let the label toggle the box too.

## Don't

- Do not pre-check consent boxes.

## Accessibility

- Built on Radix Checkbox, with a real label.
- Indeterminate is announced as mixed.

### Keyboard

| Key | Action |
|---|---|
| Space | Toggles |

## Example

```tsx
import { Checkbox } from "@leeward/react";

export function SaveRecipient() {
  return <Checkbox label="Save this person as a recipient" onCheckedChange={(checked) => console.log(checked)} />;
}
```

## Related

- Switch
- RadioGroup

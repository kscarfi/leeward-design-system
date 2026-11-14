# Stepper

Shows where people are in a multi-step flow, such as a transfer.

## When to use

- Flows of 3 to 5 steps.

## When not to use

- Single screens or more than 5 steps.

## Variants

| Variant | Use it for |
|---|---|
| `full` | Every step with its name. Under 480 px only the current name shows. |
| `compact` | "Step 2 of 4" with a progress bar, for phones. |

## Content guidelines

- Short step names: Recipient, Amount, Review, Confirm.

## Do

- Let people go back with a Back button.

## Don't

- Do not make steps clickable unless going back is safe.

## Accessibility

- `nav` landmark with an ordered list.
- The current step has `aria-current="step"`; completed steps say so in text.

## Example

```tsx
import { Stepper } from "@leeward/react";

export function TransferProgress() {
  return <Stepper steps={["Recipient", "Amount", "Review", "Confirm"]} current={1} label="Transfer progress" />;
}
```

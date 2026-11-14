# Textarea

Multi-line text for payment notes and messages. It grows with its content.

## When to use

- Payment notes, messages to support, descriptions.

## When not to use

- Single-line values: use TextField.

## States

- Default, hover, focus, error, disabled.

## Content guidelines

- Tell people who sees the text: "The recipient sees this".
- Show the limit with `maxLength` and `showCount`.

## Behavior and responsive

- Grows with content where the browser supports `field-sizing`, and can be resized vertically.

## Do

- Mark it `optional` when it is.

## Don't

- Do not use it to collect structured data such as addresses.

## Accessibility

- Visible label, hint and error linked like TextField.
- The counter is announced politely as people type.

## Example

```tsx
import { Textarea } from "@leeward/react";

export function PaymentNote() {
  return <Textarea label="Payment note" hint="The recipient sees this" optional maxLength={140} showCount />;
}
```

## Related

- TextField

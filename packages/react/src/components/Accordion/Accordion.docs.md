# Accordion

Expandable sections for fees, FAQs and account details.

## When to use

- Long pages where people need only some sections.

## When not to use

- Information people need to make a decision, such as the fee of a transfer.

## Variants

| Variant | Use it for |
|---|---|
| `single` | One section open at a time. |
| `multiple` | Several sections open. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Trigger | 48 px | Full width. |

## Content guidelines

- Write triggers as questions or clear topics.

## Do

- Set `headingLevel` so triggers fit the page outline.

## Don't

- Do not nest accordions.

## Accessibility

- Buttons inside headings with `aria-expanded`.
- Behavior from Radix Accordion.

### Keyboard

| Key | Action |
|---|---|
| Enter or Space | Opens or closes |
| Arrow keys | Move between triggers |

## Example

```tsx
import { Accordion } from "@leeward/react";

export function FeesFaq() {
  return <Accordion items={[{ value: "fees", title: "What does a transfer cost?", content: "Free between Leeward accounts." }]} />;
}
```

# Card

A surface that groups related content, such as an account, a goal or a list.

## When to use

- Grouping content that belongs together.

## When not to use

- Nesting cards inside cards.
- Making a whole card clickable when it contains other buttons.

## Variants

| Variant | Use it for |
|---|---|
| `outlined` | Default. Lists and secondary content. |
| `elevated` | Primary objects such as accounts. |
| `filled` | Quiet grouping on white backgrounds. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `padding` | none, sm 12, md 16, lg 24 px | Use `none` for cards that hold lists. |

## Content guidelines

- Give a card a heading when it is a section.

## Do

- Use `as="section"` with a heading, `as="article"` for self-contained items.

## Don't

- Do not use shadows by hand: pick a variant.

## Accessibility

- No behavior of its own. The semantic element comes from `as`.

## Example

```tsx
import { Card, Heading, Text } from "@leeward/react";

export function SavingsGoal() {
  return (
    <Card as="section" variant="elevated" padding="lg" aria-labelledby="goal">
      <Heading level={2} size="h4" id="goal">Holiday fund</Heading>
      <Text tone="secondary">You saved ₺4.500 of ₺10.000.</Text>
    </Card>
  );
}
```

## Related

- AccountCard
- List

# Link

Navigation to another page or site.

## When to use

- Going to another screen or a help page.

## When not to use

- Actions such as Send or Delete: use Button.

## Variants

| Variant | Use it for |
|---|---|
| `inline` | Inside sentences. Always underlined. |
| `standalone` | On its own line. Underlined on hover. |

## Content guidelines

- Name the destination: "See all fees", not "Click here".

## Behavior and responsive

- `external` opens a new tab and says so.

## Do

- Use inline links sparingly in long text.

## Don't

- Do not style buttons as links.

## Accessibility

- Native anchor.
- External links add an icon and the text "opens in a new tab" for screen readers.

### Keyboard

| Key | Action |
|---|---|
| Tab | Moves to the link |
| Enter | Follows it |

## Example

```tsx
import { Link } from "@leeward/react";

export function FeesLink() {
  return <Link href="/fees" variant="standalone">See all fees</Link>;
}
```

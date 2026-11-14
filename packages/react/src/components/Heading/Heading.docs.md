# Heading

Page and section headings. `level` sets the document outline, `size` sets the look, so both can be right at the same time.

## When to use

- Page titles, section titles, card titles.

## When not to use

- Big numbers: use AmountDisplay.
- Emphasis inside a paragraph: use Text with a label variant.

## Variants

| Variant | Use it for |
|---|---|
| `display-lg`, `display-md` | Marketing and hero moments. Fluid: 40 to 58 px. |
| `title-xl` to `title-xs` | Screen titles. Fluid: 20 to 40 px. |
| `h1` to `h6` | Section headings, 28 to 14 px. The default size follows `level`. |

## States

- Tones: `default`, `muted`, `primary`, `inverse`.

## Content guidelines

- Use sentence case.
- Say what the section is about: "Recent activity", not "Activity list".

## Behavior and responsive

- Display and title sizes scale smoothly between 360 and 1280 px viewports.
- Long headings balance their lines (`text-wrap: balance`).

## Do

- Use one `level={1}` per screen.
- Keep levels in order without skipping.

## Don't

- Do not skip levels, for example h1 to h3.
- Do not use Heading only to make text bigger.

## Accessibility

- `level` is required, so the outline is always intentional.
- Screen reader users navigate by headings: keep them meaningful.

## Example

```tsx
import { Heading } from "@leeward/react";

export function SectionTitle() {
  return <Heading level={2} size="h3">Recent activity</Heading>;
}
```

### Screen title

```tsx
import { Heading } from "@leeward/react";

export function ScreenTitle() {
  return <Heading level={1} size="title-md">Send money</Heading>;
}
```

## Related

- Text

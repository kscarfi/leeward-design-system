# Text

Body text, labels, subtitles, captions and inline code, using the type roles and text tones of the system.

## When to use

- Paragraphs, labels, helper lines, captions and numbers in lists.

## When not to use

- Headings: use Heading so the page outline is correct.
- Amounts: use AmountDisplay so signs and formatting are right.

## Variants

| Variant | Use it for |
|---|---|
| `body-lg`, `body-md`, `body-sm` | Reading text. `body-md` (16 px) is the default. |
| `label-lg` to `label-xs` | Short labels and values, semibold. |
| `subtitle-lg`, `-md`, `-sm` | Intro lines under titles. |
| `caption` | 12 px supporting text such as timestamps. |
| `code` | IBANs, references and codes in the mono font. |

## States

- Tones: `primary` (default text), `secondary` (muted), `tertiary` (subtle), `brand`, `success`, `warning`, `danger`, `inverse`.

## Content guidelines

- Keep sentences short and in second person.
- Use `tabular` for numbers that line up in columns.
- Never use em dashes in copy: use commas, colons or periods.

## Do

- Pick `as` for meaning: `p` for paragraphs, `span` inline, `label` with `htmlFor`.
- Use `secondary` for supporting text and `tertiary` only for hints and captions.

## Don't

- Do not use `success` or `danger` tones as the only signal of state: add an icon or words.
- Do not set font sizes by hand.

## Accessibility

- Every tone passes WCAG 2.2 AA on every surface in every brand and mode.
- Text follows the browser font size because sizes are in rem.

## Example

```tsx
import { Text } from "@leeward/react";

export function TransferNote() {
  return <Text variant="body-sm" tone="secondary">Transfers to other banks take up to one working day.</Text>;
}
```

### Numbers in a column

```tsx
import { Text } from "@leeward/react";

export function Totals() {
  return (
    <div>
      <Text tabular>₺1.111,11</Text>
      <Text tabular>₺9.999,99</Text>
    </div>
  );
}
```

## Related

- Heading
- AmountDisplay

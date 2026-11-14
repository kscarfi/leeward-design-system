# TextField

Single-line text input with a visible label, hint, error, and optional prefix or suffix.

## When to use

- Names, IBANs, references, search, short answers.

## When not to use

- Money: use AmountInput.
- One-time codes: use OTPInput.
- Long text: use Textarea.

## Anatomy

- Label (and "(optional)" when optional).
- Hint, above the field.
- Field with optional prefix and suffix.
- Error with an icon, below the field.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 36 px | Dense desktop forms. Grows to 44 px with 16 px text on touch screens. |
| `md` | 44 px | Default. |
| `lg` | 48 px | Main field of a screen, such as an amount. |

## States

- Default, hover, focus (focus ring), error (thicker danger border and danger focus ring), disabled.

## Content guidelines

- Labels name the value: "IBAN", not "Enter your IBAN".
- Hints explain format before people type: "26 characters, starts with TR".
- Errors say what is wrong and how to fix it: "This IBAN is too short. Check it and try again."

## Behavior and responsive

- Touch screens never zoom into the field: text stays at least 16 px.
- Pass any native input attribute, such as `inputMode`, `autoComplete` or `maxLength`.

## Do

- Always set a visible label.
- Use the right `inputMode` and `autoComplete`.

## Don't

- Do not use the placeholder as a label.
- Do not blame people in errors ("Invalid input").

## Accessibility

- Label linked with `htmlFor`.
- Hint and error linked with `aria-describedby`; error sets `aria-invalid`.
- Errors use an icon, text and a thicker border, never color alone.

### Keyboard

| Key | Action |
|---|---|
| Tab | Moves into the field |

## Example

```tsx
import { TextField } from "@leeward/react";

export function IbanField({ error }: { error?: string }) {
  return <TextField label="IBAN" hint="26 characters, starts with TR" autoComplete="off" {...(error ? { error } : {})} />;
}
```

### With prefix and suffix

```tsx
import { TextField } from "@leeward/react";

export function RateField() {
  return <TextField label="Interest rate" suffix="%" numeric inputMode="decimal" defaultValue="42,5" />;
}
```

## Related

- AmountInput
- Textarea
- Select

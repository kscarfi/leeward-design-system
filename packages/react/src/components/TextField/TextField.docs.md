# TextField

Single-line input with label, hint, error, prefix and suffix.

## Do

- Always set a visible `label`.
- Use `hint` for format help before people type, `error` for what went wrong and how to fix it.
- For amounts use `prefix="₺"`, `inputMode="decimal"` and `numeric`.

## Don't

- Do not use the placeholder as a label.
- Do not write errors that blame: "Invalid input". Say what to do: "This IBAN is too short. Check it and try again."

## Accessibility

- Label is linked with `htmlFor`.
- Hint and error are linked with `aria-describedby`. Error sets `aria-invalid`.
- Errors pair an icon with text and a thicker border, never color alone.

## Example

```tsx
<TextField label="IBAN" hint="26 characters, starts with TR" error={error} />
```

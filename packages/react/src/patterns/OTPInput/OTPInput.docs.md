# OTPInput

One-time code entry with paste, SMS autofill and clear errors.

## Do

- Say where the code was sent in `hint`.
- Use `onComplete` to verify automatically.

## Don't

- Do not split the code into separate inputs.
- Do not clear the code on error. Let people fix one digit.

## Accessibility

- One real input with `autocomplete="one-time-code"` and `inputMode="numeric"`.
- Spaces and letters are stripped, so pasting "482 913" works.

## Example

```tsx
<OTPInput label="Verification code" hint="We sent a code to •••• 4821" onComplete={verify} />
```

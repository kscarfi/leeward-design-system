# Alert

Inline message on the page: what happened and what to do next.

## Do

- Use info for useful context, success after something completed, warning before a limit, danger when something failed.
- Lead with what happened in the title, then what to do in the text.
- Use live="alert" only for urgent failures.

## Don't

- Do not use an Alert for field errors: put the error on the field.
- Do not stack more than one Alert at the top of a screen.

## Accessibility

- role="status" by default, role="alert" when urgent.
- Every tone has an icon and text, never color alone.
- The dismiss button is labelled.

## Example

```tsx
<Alert tone="warning" title="You are close to your daily limit">₺1.500 left today.</Alert>
```

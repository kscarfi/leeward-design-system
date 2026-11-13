# Stepper

Shows where people are in a multi-step flow.

## Do

- Use short step names.
- Use variant="compact" on phones.

## Don't

- Do not use for more than 5 steps.
- Do not make steps clickable unless going back is safe.

## Accessibility

- nav landmark with an ordered list. The current step has aria-current="step", completed steps say so in text.

## Example

```tsx
<Stepper steps={["Recipient", "Amount", "Review", "Confirm"]} current={1} />
```

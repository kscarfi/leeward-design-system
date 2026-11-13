# Switch

A setting that applies immediately, such as online card payments.

## Do

- Label the setting, not the state: "Online card payments".

## Don't

- Do not use inside a form that has a submit button. Use Checkbox.
- Do not write "On" or "Off" as the label.

## Accessibility

- `switch` role from Radix. Track meets 3:1 against every surface.
- 44px wide target.

## Example

```tsx
<Switch label="Online card payments" checked={on} onCheckedChange={setOn} />
```

# RadioGroup

Pick exactly one option from 2 to 5 visible choices.

## Do

- Write `label` as the question: "When should it arrive?".
- Add `description` to explain the consequence of each option.

## Don't

- Do not use for more than about 5 options.
- Do not leave a group with no default unless the choice must be explicit.

## Accessibility

- `radiogroup` role named by the label. Arrow keys move between options.
- Descriptions are linked with `aria-describedby`.

## Example

```tsx
<RadioGroup label="When should it arrive?" options={options} defaultValue="now" />
```

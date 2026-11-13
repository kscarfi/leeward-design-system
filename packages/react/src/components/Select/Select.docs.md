# Select

Pick one option from a short list. Built on Radix Select.

## Do

- Use for 5 to 15 options. Use RadioGroup for fewer, a searchable list for more.
- Write a placeholder that asks: "Choose an account".

## Don't

- Do not use Select for actions.
- Do not hide important differences between options. Use RadioGroup with descriptions.

## Accessibility

- Trigger is a labelled combobox. Full keyboard support from Radix.
- Options are 44px tall.

## Example

```tsx
<Select label="Pay from" options={[{ value: "everyday", label: "Everyday account" }]} onValueChange={setAccount} />
```

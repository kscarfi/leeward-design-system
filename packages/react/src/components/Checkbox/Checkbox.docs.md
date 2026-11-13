# Checkbox

A yes or no choice inside a form, or one of many independent choices.

## Do

- Write the label as a statement people agree with: "Save this person as a recipient".

## Don't

- Do not use for settings that apply immediately. Use Switch.
- Do not pre-check consent boxes.

## Accessibility

- Built on Radix Checkbox with a native-like label.
- 20px box with a 44px hit area. Supports indeterminate.

## Example

```tsx
<Checkbox label="Save this person as a recipient" onCheckedChange={setSave} />
```

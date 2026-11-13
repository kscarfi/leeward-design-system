# SegmentedControl

Pick one view or filter from 2 to 5 short options.

## Do

- Keep labels to one word when you can: Week, Month, Year.
- Use fullWidth on phones.

## Don't

- Do not use it for navigation between pages: use Tabs.
- Do not use it for form choices that need a submit: use RadioGroup.

## Accessibility

- radiogroup role named by label. Arrow keys move. One option is always selected.
- The selected option uses a raised surface and shadow, not color alone.

## Example

```tsx
<SegmentedControl label="Period" options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
```

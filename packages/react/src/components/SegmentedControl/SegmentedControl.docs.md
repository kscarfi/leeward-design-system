# SegmentedControl

Switch between 2 to 5 views or filters of the same content, such as Week, Month and Year.

## When to use

- Changing the period of a chart, list or chart view, Now or Later.

## When not to use

- Navigation between pages: use Tabs.
- Form choices with descriptions: use RadioGroup.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 36 px | Above charts and inside cards. |
| `md` | 44 px | Default. |

## States

- One option is always selected. Options can be disabled.

## Content guidelines

- One word per option when possible.

## Behavior and responsive

- `fullWidth` stretches options equally, for phones.

## Do

- Keep options mutually exclusive.

## Don't

- Do not use more than 5 options.

## Accessibility

- `radiogroup` named by `label`.
- The selected option uses a raised surface and shadow, not color alone.

### Keyboard

| Key | Action |
|---|---|
| Arrow keys | Move and select |

## Example

```tsx
import { SegmentedControl } from "@leeward/react";

export function PeriodPicker() {
  return (
    <SegmentedControl
      label="Period"
      defaultValue="month"
      options={[
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year" },
      ]}
    />
  );
}
```

## Related

- Tabs
- RadioGroup

# Tabs

Switch between views of the same object, such as Activity, Statements and Details of an account.

## When to use

- Two to five sibling views.

## When not to use

- Steps of a flow: use Stepper.
- Filters: use SegmentedControl or Chip.

## Content guidelines

- One or two words per tab.

## Behavior and responsive

- The tab list scrolls sideways on narrow screens.
- `fullWidth` gives each tab equal width on phones.

## Do

- Keep the selected tab when people come back.

## Don't

- Do not hide required form fields in other tabs.

## Accessibility

- Radix Tabs: `tablist`, `tab` and `tabpanel` roles.
- The active tab uses weight and an underline, not only color.

### Keyboard

| Key | Action |
|---|---|
| Arrow keys | Move between tabs |
| Tab | Moves into the panel |

## Example

```tsx
import { Tabs, Text } from "@leeward/react";

export function AccountViews() {
  return (
    <Tabs
      label="Account views"
      items={[
        { value: "activity", label: "Activity", content: <Text>Last 30 days</Text> },
        { value: "details", label: "Details", content: <Text>IBAN and branch</Text> },
      ]}
    />
  );
}
```

## Related

- SegmentedControl

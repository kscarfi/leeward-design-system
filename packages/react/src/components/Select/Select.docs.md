# Select

Pick one option from a list in a popover. Built on Radix Select.

## When to use

- 5 to 15 options, such as the account to pay from.

## When not to use

- 2 to 5 options that people should compare: use RadioGroup.
- Long lists: use a searchable list.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `sm` | 36 px | Dense desktop forms. |
| `md` | 44 px | Default. |
| `lg` | 48 px | Main choice of a screen. |

## States

- Default, open, hover, focus, error, disabled. Options can be disabled.

## Content guidelines

- Write the placeholder as a request: "Choose an account".
- Keep option labels short and unique.

## Do

- Order options by how often they are used.

## Don't

- Do not hide important differences between options: use RadioGroup with descriptions.
- Do not use Select for actions: use DropdownMenu.

## Accessibility

- The trigger is a labelled combobox.
- Options are at least 44 px tall.

### Keyboard

| Key | Action |
|---|---|
| Enter, Space or Arrow down | Opens the list |
| Arrow keys | Move between options |
| Enter | Selects |
| Escape | Closes |

## Example

```tsx
import { Select } from "@leeward/react";

export function PayFrom() {
  return (
    <Select
      label="Pay from"
      options={[
        { value: "everyday", label: "Everyday account" },
        { value: "savings", label: "Savings" },
      ]}
      onValueChange={(value) => console.log(value)}
    />
  );
}
```

## Related

- RadioGroup
- SegmentedControl

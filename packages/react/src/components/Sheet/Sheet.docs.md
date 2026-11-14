# Sheet

A panel for a task in context, such as filters or transaction details.

## When to use

- Filters, details and short forms that keep the page behind in view.

## When not to use

- Confirmations: use Dialog.

## Variants

| Variant | Use it for |
|---|---|
| `bottom` | Default. Slides up, within thumb reach. Centered and limited to 560 px on wide screens. |
| `end` | Slides in from the side on wide screens. |

## Content guidelines

- Title names the task: "Filter transactions".

## Do

- Put the main action last in `footer`.

## Don't

- Do not open a sheet from a sheet.

## Accessibility

- Modal dialog: traps focus, closes on Escape and returns focus.
- Respects the safe area at the bottom of phones.

### Keyboard

| Key | Action |
|---|---|
| Escape | Closes |

## Example

```tsx
import { Button, Checkbox, Sheet, SheetClose } from "@leeward/react";

export function Filters() {
  return (
    <Sheet title="Filter transactions" trigger={<Button variant="outline" iconStart="filter">Filter</Button>} footer={<SheetClose asChild><Button>Show results</Button></SheetClose>}>
      <Checkbox label="Pending only" />
    </Sheet>
  );
}
```

## Related

- Dialog

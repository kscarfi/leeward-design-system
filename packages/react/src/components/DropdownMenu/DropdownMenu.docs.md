# DropdownMenu

Secondary actions for an item, behind a More button.

## When to use

- Copy IBAN, download statement, freeze card on an account.

## When not to use

- The main action: keep it visible.
- Navigation.

## Content guidelines

- Verbs first: Copy IBAN, Download statement.
- Destructive actions name what they destroy: Close account.

## Behavior and responsive

- Destructive actions go last, after a separator.

## Do

- Use an IconButton labelled "More actions" as the trigger.

## Don't

- Do not put more than about 7 actions in one menu.

## Accessibility

- `menu` and `menuitem` roles from Radix.
- Items are at least 44 px tall.

### Keyboard

| Key | Action |
|---|---|
| Enter or Space | Opens |
| Arrow keys | Move |
| Enter | Selects |
| Escape | Closes |

## Example

```tsx
import { DropdownMenu, IconButton } from "@leeward/react";

export function AccountMenu() {
  return (
    <DropdownMenu
      trigger={<IconButton icon="more-vertical" label="More actions" />}
      actions={[
        { label: "Copy IBAN", icon: "copy", onSelect: () => {} },
        { label: "Close account", icon: "trash", onSelect: () => {}, destructive: true },
      ]}
    />
  );
}
```

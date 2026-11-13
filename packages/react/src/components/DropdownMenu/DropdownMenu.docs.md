# DropdownMenu

Secondary actions for an item, behind a More button.

## Do

- Order actions by how often they are used. Destructive actions go last and are separated.

## Don't

- Do not hide the main action in a menu.
- Do not use a menu for navigation.

## Accessibility

- menu role with menuitems. Arrow keys move, Enter selects, Escape closes. Behavior from Radix.

## Example

```tsx
<DropdownMenu trigger={<IconButton icon="more-vertical" label="More actions" />} actions={[{ label: "Copy IBAN", icon: "copy", onSelect: copy }]} />
```

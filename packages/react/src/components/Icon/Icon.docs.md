# Icon

Solar icons by 480 Design (CC BY 4.0) on a 24 px grid: 142 icons in three weights. Icons draw in `currentColor`, so they follow the text tone around them.

## When to use

- Next to labels to help scanning: buttons, list rows, badges.
- As the only content of IconButton, with a label.

## When not to use

- As the only signal of state: pair with text.
- Decoration that adds no meaning.

## Variants

| Variant | Use it for |
|---|---|
| `linear` | Default for UI. |
| `bold` | Selected or active states, filled status icons. |
| `duotone` | Illustrations, empty states and quick actions. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `xs` | 12 px | Inside small badges. |
| `sm` | 16 px | Inside small buttons, chips and captions. |
| `md` | 20 px | Default. |
| `lg` | 24 px | Navigation and large buttons. |
| `xl` | 32 px | Empty states and illustrations. |

## Content guidelines

- Name icons by meaning: `send`, `card-transfer`, `alert-circle`.
- Add icons with `pnpm icons:import`; do not paste SVG into product code.

## Do

- Give `label` only when the icon means something on its own.

## Don't

- Do not color icons with raw values: they inherit the text color.

## Accessibility

- Decorative by default (`aria-hidden`).
- With `label` it becomes `role="img"` with that name.

## Example

```tsx
import { Icon } from "@leeward/react";

export function Secured() {
  return <Icon name="lock" label="Secured" />;
}
```

### Weights

```tsx
import { Icon } from "@leeward/react";

export function WalletWeights() {
  return (
    <span>
      <Icon name="wallet" weight="linear" />
      <Icon name="wallet" weight="bold" />
      <Icon name="wallet" weight="duotone" size="xl" />
    </span>
  );
}
```

## Related

- IconButton
- EmptyState
- QuickActions

# IconButton

An icon-only button for frequent, well-known secondary actions such as close, settings, more or show balance.

## When to use

- Close, back, more actions, settings, show or hide balance.
- Toolbars where space is short and the icon is universally understood.

## When not to use

- Moving money: Send, Pay and Transfer always need a text Button.
- Actions whose icon is not obvious: use Button with a label.

## Anatomy

- Round container, centered icon, invisible 44 px hit area.
- The accessible name comes from `label`.

## Variants

| Variant | Use it for |
|---|---|
| `ghost` | Default. Toolbars and headers. |
| `secondary` | A soft brand surface, for emphasis without competing with primary. |
| `outline` | Neutral, for example a More button on a card. |
| `primary` | Floating or main icon actions, rarely. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `xs` | 32 px | Inside chips, badges and tight rows. |
| `sm` | 36 px | Dialog and sheet headers. |
| `md` | 44 px | Default. |
| `lg` | 48 px | Main icon actions on mobile. |

## States

- Default, hover, pressed, focus, disabled.
- Toggle: pass `aria-pressed`; the icon switches to the bold weight and the background tints, so state is visible without color alone.

## Content guidelines

- Write `label` as the outcome: "Close", "Show balance", "More actions".
- Add a Tooltip with the same text when the icon may be unclear on desktop.

## Behavior and responsive

- Hit area never drops below 44 by 44 px.

## Do

- Always set `label`.
- Use `aria-pressed` for toggles such as hide balance.

## Don't

- Do not use for money movement (lint rule `no-icon-only-money-action`).
- Do not put several unlabeled icon buttons in a row without tooltips.

## Accessibility

- `label` is required and becomes `aria-label`.
- Pressed toggles expose `aria-pressed` and change weight, not only color.

### Keyboard

| Key | Action |
|---|---|
| Tab | Moves focus to the control |
| Enter or Space | Activates it |

## Example

```tsx
import { IconButton } from "@leeward/react";

export function CloseButton({ onClose }: { onClose: () => void }) {
  return <IconButton icon="close" label="Close" onClick={onClose} />;
}
```

### Toggle

```tsx
import { useState } from "react";
import { IconButton } from "@leeward/react";

export function HideBalanceToggle() {
  const [hidden, setHidden] = useState(false);
  return <IconButton icon={hidden ? "eye" : "eye-off"} label={hidden ? "Show balance" : "Hide balance"} aria-pressed={hidden} onClick={() => setHidden(!hidden)} />;
}
```

## Related

- Button
- Tooltip

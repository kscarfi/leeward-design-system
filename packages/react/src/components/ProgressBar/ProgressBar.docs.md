# ProgressBar

Progress toward a goal or limit, such as a savings goal or a daily card limit.

## When to use

- Goals, limits, profile completion.

## When not to use

- Loading: use Skeleton or Spinner.

## Variants

| Variant | Use it for |
|---|---|
| `brand` | Neutral progress. |
| `success` | Goal reached. |
| `warning` | Close to a limit. |
| `danger` | Over a limit. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Bar | 8 px | Full width of its container. |

## Content guidelines

- Always set `valueText` in words for money: "₺4.500 of ₺10.000".
- Pair warning and danger with words: "92% used, ₺800 left".

## Do

- Show the numbers, not only the bar.

## Don't

- Do not rely on the bar color.

## Accessibility

- `progressbar` role named by the label, with `aria-valuetext`.

## Example

```tsx
import { ProgressBar } from "@leeward/react";

export function HolidayFund() {
  return <ProgressBar label="Holiday fund" value={4500} max={10000} valueText="₺4.500 of ₺10.000" />;
}
```

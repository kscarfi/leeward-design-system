# ProgressBar

Progress toward a goal or limit.

## Do

- Always set `valueText` in words for money: "₺4.500 of ₺10.000".
- Use warning and danger with words: "92% used, ₺800 left".

## Don't

- Do not use for loading. Use Skeleton or a loading Button.

## Accessibility

- `progressbar` role named by the label, with `aria-valuetext`.

## Example

```tsx
<ProgressBar label="Holiday fund" value={4500} max={10000} valueText="₺4.500 of ₺10.000" />
```

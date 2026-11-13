# Tooltip

Extra information on hover and focus. Wrap the app in TooltipProvider.

## Do

- Keep it to one short sentence.

## Don't

- Do not put required information, fees or actions in a tooltip.
- Do not wrap non-focusable elements.

## Accessibility

- Shows on keyboard focus, hides on Escape. Content is linked to the trigger.

## Example

```tsx
<Tooltip content="The fee is the same for every amount."><IconButton icon="info" label="About the fee" /></Tooltip>
```

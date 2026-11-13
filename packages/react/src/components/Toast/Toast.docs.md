# Toast

Short confirmation after an action, such as "Money sent". Use with ToastProvider and useToast.

## Do

- Confirm what happened in plain words.
- Errors stay until dismissed. Other tones hide after 6 seconds.

## Don't

- Do not put the only way to do something in a toast.
- Do not use toasts for errors inside forms. Show them next to the field.

## Accessibility

- Radix Toast region with a label. Danger toasts are announced assertively.
- Each tone has an icon and a colored edge, never color alone.

## Example

```tsx
const toast = useToast();
toast.show({ title: "Money sent", description: "Deniz gets ₺250,00 in a few seconds.", tone: "success" });
```

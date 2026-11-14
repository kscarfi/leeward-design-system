# Button

Buttons start an action: send money, confirm a transfer, freeze a card. The label always says what happens next.

## When to use

- To start an action on the current screen, such as Send, Save or Confirm.
- To submit a form (`type="submit"`).
- For the single most important action of a screen or section, with `variant="primary"`.

## When not to use

- To go to another page: use Link.
- For icon-only actions: use IconButton, and never for moving money.
- For on and off settings: use Switch.

## Anatomy

- Container with the variant background and a 44 px hit area.
- Optional start icon (`iconStart`), label, optional end icon (`iconEnd`).
- Spinner that replaces the content while `loading`.

## Variants

| Variant | Use it for |
|---|---|
| `primary` | The one main action of a screen or section. |
| `secondary` | Alternatives next to a primary action, such as Request next to Send. |
| `outline` | Neutral actions that should not compete with the brand color, such as Download statement. |
| `ghost` | Low emphasis actions such as See all or Cancel. |
| `danger` | Irreversible actions only, such as Close account. |

## Sizes

| Size | Height | Use it for |
|---|---|---|
| `xs` | 32 px (compact 32) | Dense tables and toolbars on desktop. |
| `sm` | 36 px (compact 32) | Inside cards and list rows. |
| `md` | 44 px (compact 40) | Default for forms and dialogs. |
| `lg` | 48 px (compact 44) | Main actions on mobile screens. |
| `xl` | 56 px (compact 48) | The last step of a mobile flow, usually `fullWidth`. |

## States

- Default, hover, pressed (slightly scaled), focus (focus ring token).
- `loading`: spinner shown, label kept for screen readers, clicks ignored, focus kept.
- `disabled`: native disabled. Prefer showing an error over disabling a submit button.

## Content guidelines

- Start with a verb and say the outcome: "Send ₺250", "Freeze card", "Download PDF".
- Use sentence case, two or three words.
- Put the amount in the label of money actions when it helps people check it.

## Behavior and responsive

- Every size keeps a 44 px hit area, also on desktop.
- `fullWidth` stretches the button; use it with `xl` at the bottom of mobile flows.
- In compact brands (Leeward Business) heights step down automatically.

## Do

- Use one primary button per screen or section.
- Keep the primary action on the right in dialogs and at the bottom on mobile.
- Use `loading` while an action runs.

## Don't

- Do not use `danger` for normal payments: sending money is not an error.
- Do not put two primary buttons next to each other.
- Do not disable a submit button to hide errors: let people submit and show what to fix.
- Do not use a button for navigation.

## Accessibility

- Native `<button>` with `type="button"` by default.
- Loading uses `aria-busy` and `aria-disabled`, keeps focus and keeps the accessible name.
- Focus uses the `elevation.focus` ring: 3:1 against every surface.
- Text on every variant passes WCAG 2.2 AA in every brand and mode.

### Keyboard

| Key | Action |
|---|---|
| Tab | Moves focus to the control |
| Enter or Space | Activates it |

## Example

```tsx
import { Button } from "@leeward/react";

export function SendButton() {
  return (
    <Button iconStart="send" onClick={() => console.log("send")}>
      Send money
    </Button>
  );
}
```

### Primary and secondary together

```tsx
import { Button } from "@leeward/react";

export function TransferActions() {
  return (
    <div style={{ display: "flex", gap: "var(--lw-space-sm)" }}>
      <Button variant="secondary" iconStart="hand-money">Request</Button>
      <Button iconStart="send">Send</Button>
    </div>
  );
}
```

### Last step of a mobile flow

```tsx
import { Button } from "@leeward/react";

export function ConfirmStep({ sending }: { sending: boolean }) {
  return (
    <Button size="xl" fullWidth loading={sending} type="submit">
      Send ₺250,00
    </Button>
  );
}
```

## Related

- IconButton for icon-only secondary actions.
- Link for navigation.
- Dialog for confirming destructive actions.

# Dialog

A modal for a decision that needs full attention, such as freezing a card or closing an account.

## When to use

- Confirming important or irreversible actions.
- Short tasks that must finish before going on.

## When not to use

- Information that could sit on the page.
- Opening on page load.

## Anatomy

- Title, close button, description, content, actions.

## Sizes

| Size | Height | Use it for |
|---|---|---|
| Width | up to 520 px | On phones (under 640 px) it becomes a bottom sheet with full width actions. |

## Content guidelines

- Title as a question: "Freeze your card?".
- Description says the consequence.
- Buttons say the outcome: "Freeze card" and "Keep it active".

## Do

- Put the main action last.
- Use `danger` only when it cannot be undone.

## Don't

- Do not stack dialogs.

## Accessibility

- Traps focus, closes on Escape, returns focus to the trigger.
- Named by `title`, described by `description`.

### Keyboard

| Key | Action |
|---|---|
| Escape | Closes |
| Tab | Cycles inside the dialog |

## Example

```tsx
import { Button, Dialog, DialogClose } from "@leeward/react";

export function FreezeCard() {
  return (
    <Dialog
      title="Freeze your card?"
      description="Card payments stop until you unfreeze it."
      trigger={<Button variant="secondary">Freeze card</Button>}
      actions={
        <>
          <DialogClose asChild><Button variant="ghost">Keep it active</Button></DialogClose>
          <DialogClose asChild><Button>Freeze card</Button></DialogClose>
        </>
      }
    />
  );
}
```

## Related

- Sheet
- Alert

# QuickActions

A row of shortcuts such as Send, Request, Top up and Pay bills. It wraps on narrow screens.

## When to use

- Home screens, under the balance.

## When not to use

- More than four shortcuts on phones.

## Content guidelines

- One or two words per action.
- Use `badge` only for a count that needs attention.

## Do

- Use duotone icons that match the label.

## Don't

- Do not use icon-only shortcuts: every action has a text label.

## Accessibility

- A labelled list of buttons or links.
- Each target is at least 44 px.

## Example

```tsx
import { QuickActions } from "@leeward/react";

export function HomeShortcuts() {
  return (
    <QuickActions
      label="Quick actions"
      actions={[
        { label: "Send", icon: "send", onClick: () => {} },
        { label: "Request", icon: "hand-money", onClick: () => {} },
      ]}
    />
  );
}
```

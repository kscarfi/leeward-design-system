# QuickActions

Row of shortcuts such as Send, Request, Top up and Pay bills.

## Do

- Keep to four actions on phones.
- Use a badge only for a count that needs attention.

## Don't

- Do not use icon-only shortcuts: every action has a text label.

## Accessibility

- A labelled list of buttons or links. Each target is at least 44 px.

## Example

```tsx
<QuickActions label="Quick actions" actions={[{ label: "Send", icon: "send", onClick: send }]} />
```
